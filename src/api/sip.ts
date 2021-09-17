import 'brekekejs/lib/jsonrpc'
import 'brekekejs/lib/webrtcclient'

import { APP_VERSION } from '@env'
import { CallOptions, Sip } from 'api/brekekejs'
import getFrontCameraSourceId from 'api/getFrontCameraSourceId'
import pbx from 'api/pbx'
import turnConfig from 'api/turnConfig'
import EventEmitter from 'eventemitter3'
import { Platform } from 'react-native'
import callStore from 'stores/callStore'
import { cancelRecentPn } from 'stores/cancelRecentPn'
import { BackgroundTimer } from 'utils/BackgroundTimer'
import CustomStrings from 'utils/CustomStrings'

const sipCreateMediaConstraints = (sourceId?: string) => {
  return ({
    audio: false,
    video: {
      mandatory: {
        minWidth: 0,
        minHeight: 0,
        minFrameRate: 0,
      },
      facingMode: Platform.OS === 'web' ? undefined : 'user',
      optional: sourceId ? [{ sourceId }] : [],
    },
  } as unknown) as MediaStreamConstraints
}

export class SIP extends EventEmitter {
  phone: Sip = null!
  init = async (loginOptions: SipLoginOption) => {
    const sourceId = await getFrontCameraSourceId()
    const { dtmfSendMode } = loginOptions
    const phone = new window.Brekeke.WebrtcClient.Phone({
      logLevel: 'all',
      multiSession: 1,
      defaultOptions: {
        videoOptions: {
          call: {
            mediaConstraints: sipCreateMediaConstraints(sourceId),
          },
          answer: {
            mediaConstraints: sipCreateMediaConstraints(sourceId),
          },
        },
      },
      dtmfSendMode: isNaN(dtmfSendMode) ? 1 : dtmfSendMode,
      ctiAutoAnswer: 1,
      eventTalk: 1,
      configuration: {
        socketKeepAlive: 60,
      },
    })
    this.phone = phone

    const connectionEvent = (event: { phoneStatus: string }) => {
      if (!event) {
        return
      }
      const { phoneStatus } = event
      if (phoneStatus === 'started') {
        return this.emit('connection-started')
      }
      if (phoneStatus === 'stopping' || phoneStatus === 'stopped') {
        phone.removeEventListener('phoneStatusChanged', connectionEvent)
        BackgroundTimer.setTimeout(() => this.disconnect(), 0)
        BackgroundTimer.setTimeout(
          () => this.emit('connection-stopped', event),
          300,
        )
      }
      return
    }

    phone.addEventListener('phoneStatusChanged', connectionEvent)

    // sessionId: "1"
    // sessionStatus: "dialing"
    // answering: false
    // audio: true
    // video: false
    // remoteStreamObject: MediaStream{...}
    // localStreamObject: MediaStream{...}
    // remoteWithVideo: false
    // withVideo: true
    // shareStream: false
    // exInfo: ""
    // muted: {main: false, videoClient: false}
    // localVideoStreamObject: null
    // videoClientSessionTable: {}
    // rtcSession: RTCSession{...}
    // incomingMessage: null
    // remoteUserOptionsTable: {}
    // analyser: null
    phone.addEventListener('sessionCreated', event => {
      if (!event) {
        return
      }
      const { sessionId, rtcSession, withVideo, remoteWithVideo } = event

      const { remote_identity, direction } = rtcSession
      const {
        uri: { user },
        display_name,
      } = remote_identity

      this.emit('session-started', {
        id: sessionId,
        incoming: direction === 'incoming',
        partyNumber: user,
        partyName: display_name,
        remoteVideoEnabled: remoteWithVideo,
        localVideoEnabled: withVideo,
      })
    })

    phone.addEventListener('sessionStatusChanged', event => {
      if (!event) {
        return
      }
      const {
        sessionId,
        sessionStatus,
        remoteStreamObject,
        withVideo,
        remoteWithVideo,
        incomingMessage,
        endVideoCall,
      } = event

      if (sessionStatus === 'terminated') {
        return this.emit('session-stopped', sessionId)
      }
      const patch = {
        id: sessionId,
        answered: sessionStatus === 'connected',
        voiceStreamObject: remoteStreamObject,
        localVideoEnabled: withVideo,
        remoteVideoEnabled: remoteWithVideo,
        pbxTenant: '',
        pbxRoomId: '',
        pbxTalkerId: '',
        pbxUsername: '',
        endVideoCall: endVideoCall,
      }
      if (incomingMessage) {
        const pbxSessionInfo = incomingMessage.getHeader('X-PBX-Session-Info')
        if (typeof pbxSessionInfo === 'string') {
          const infos = pbxSessionInfo.split(';')
          patch.pbxTenant = infos[0]
          patch.pbxRoomId = infos[1]
          patch.pbxTalkerId = infos[2]
          patch.pbxUsername = infos[3]
        }
      }
      this.emit('session-updated', patch)
      return
    })

    phone.addEventListener('remoteUserOptionsChanged', event => {
      if (!event) {
        return
      }
      const currentCall = callStore.currentCall
      const {
        sessionId,
        sessionStatus,
        remoteStreamObject,
        withVideo,
        remoteWithVideo,
        incomingMessage,
      } = event

      if (sessionStatus === CustomStrings.Terminated) {
        return this.emit('session-stopped', sessionId)
      }
      const patch = {
        id: sessionId,
        answered: sessionStatus === CustomStrings.Connected,
        voiceStreamObject: remoteStreamObject,
        localVideoEnabled: !remoteWithVideo
          ? false
          : currentCall?.localVideoEnabled,
        remoteVideoEnabled: remoteWithVideo,
        pbxTenant: '',
        pbxRoomId: '',
        pbxTalkerId: '',
        pbxUsername: '',
      }
      if (incomingMessage) {
        const pbxSessionInfo = incomingMessage.getHeader('X-PBX-Session-Info')
        if (typeof pbxSessionInfo === 'string') {
          const infos = pbxSessionInfo.split(';')
          patch.pbxTenant = infos[0]
          patch.pbxRoomId = infos[1]
          patch.pbxTalkerId = infos[2]
          patch.pbxUsername = infos[3]
        }
      }
      this.emit('session-updated', patch)
      return
    })

    phone.addEventListener('videoClientSessionCreated', event => {
      if (!event) {
        return
      }
      const { sessionId, videoClientSessionId } = event

      const session = phone.getSession(sessionId)
      const videoSession = session.videoClientSessionTable[videoClientSessionId]
      const { remoteStreamObject, localStreamObject } = videoSession
      this.emit('session-updated', {
        id: sessionId,
        videoSessionId: videoClientSessionId,
        remoteVideoEnabled: session.remoteWithVideo,
        remoteVideoStreamObject: remoteStreamObject,
        localVideoStreamObject: localStreamObject,
      })
    })
    phone.addEventListener('videoClientSessionEnded', event => {
      if (!event) {
        return
      }
      const { sessionId, videoClientSessionId } = event
      this.emit('session-updated', {
        id: sessionId,
        videoSessionId: videoClientSessionId,
        remoteVideoEnabled: false,
        remoteVideoStreamObject: null,
        localVideoStreamObject: null,
      })
    })

    phone.addEventListener('rtcErrorOccurred', event => {
      console.error('sip.phone.rtcErrorOccurred:', event) // TODO
    })
  }

  connect = async (sipLoginOption: SipLoginOption) => {
    this.disconnect()
    await this.init(sipLoginOption)
    const platformConfig = {
      ios: 'iOS',
      android: 'Android',
      web: 'Web',
    }
    const {
      pbxTurnEnabled,
      hostname,
      username,
      accessToken,
      port,
    } = sipLoginOption

    let platformOs: string = Platform.OS
    platformOs = platformConfig[platformOs]

    const jssipVersion = '3.2.15'
    const lUseragent =
      'Qooqie Phone for ' +
      platformOs +
      ' ' +
      APP_VERSION +
      '/JsSIP ' +
      jssipVersion
    //
    const callOptions = ((pbxTurnEnabled && turnConfig) || {}) as CallOptions
    const { pcConfig } = callOptions
    let pcConfigObj = { ...pcConfig }

    if (!pcConfigObj) {
      pcConfigObj = {}
    }
    if (!Array.isArray(pcConfigObj.iceServers)) {
      pcConfigObj.iceServers = []
    }
    if (sipLoginOption.turnConfig) {
      pcConfigObj.iceServers = [
        ...pcConfigObj.iceServers,
        sipLoginOption.turnConfig,
      ]
    }
    let callOptionsObj = { ...callOptions, pcConfig: pcConfigObj }

    this.phone.setDefaultCallOptions(callOptionsObj)
    //
    this.phone.startWebRTC({
      url: `wss://${hostname}:${port}/phone`,
      tls: true,
      user: username,
      auth: accessToken,
      useVideoClient: true,
      userAgent: lUseragent,
    })

    console.error('SIP PN debug: added listener on _ua')

    // temporary cancel PN via SIP ua
    const ua = ((this.phone as unknown) as {
      _ua: {
        on: Function
      }
    })._ua
    ua?.on(
      'newNotify',
      (e: {
        request: {
          data: string
        }
      }) => {
        const d = e?.request?.data
        const canceled = d && /INVITE,.+, Canceled/.test(d)
        console.error(
          `SIP PN debug: newNotify fired on _ua, canceled=${canceled}`,
        )
        if (canceled) {
          cancelRecentPn()
        }
      },
    )
  }

  disconnect = () => {
    if (this.phone) {
      this.phone.stopWebRTC()
      this.phone = null!
    }
  }

  createSession = (number: string, opts: { videoEnabled?: boolean } = {}) => {
    const { videoEnabled } = opts
    return this.phone.makeCall(number, null, videoEnabled)
  }

  hangupSession = (sessionId: string) => {
    const session = this.phone.getSession(sessionId)
    const rtcSession = session && session.rtcSession
    return rtcSession && rtcSession.terminate()
  }
  answerSession = (
    sessionId: string,
    opts: { videoEnabled?: boolean } = {},
  ) => {
    const { videoEnabled } = opts
    return this.phone.answer(sessionId, null, videoEnabled)
  }
  sendDTMF = async (props: {
    signal: string
    sessionId: string
    tenant: string
    talkerId: string
  }) => {
    const { signal, sessionId, tenant, talkerId } = props
    const config = await pbx.getConfig()
    const dtmfSendMode = config['webrtcclient.dtmfSendMode']
    if (dtmfSendMode && dtmfSendMode !== 'false' && dtmfSendMode !== '0') {
      await pbx.client._pal('sendDTMF', {
        signal: signal,
        tenant: tenant,
        talker_id: talkerId,
      })
      return
    }
    return this.phone.sendDTMF(signal, sessionId)
  }
  enableVideo = (sessionId: string) => {
    return this.phone.setWithVideo(sessionId, true)
  }
  disableVideo = (sessionId: string, endVideoCall?: boolean) => {
    return this.phone.setWithVideo(sessionId, false, null, null, endVideoCall)
  }
  setMuted = (muted: boolean, sessionId: string) => {
    return this.phone.setMuted({ main: muted }, sessionId)
  }
}

const sip = new SIP()
export default sip

export interface SipLoginOption {
  hostname: string
  port: string
  pbxTurnEnabled: boolean
  username: string
  accessToken: string
  dtmfSendMode: number
  turnConfig?: RTCIceServer
}
