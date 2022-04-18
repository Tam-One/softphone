import * as Sentry from '@sentry/react-native'
import debounce from 'lodash/debounce'
import { action, computed, observable } from 'mobx'
import moment from 'moment'
import { Platform } from 'react-native'
import RNCallKeep, { CONSTANTS } from 'react-native-callkeep'
import IncallManager from 'react-native-incall-manager'
import { v4 as uuid } from 'react-native-uuid'

import AuthPBX from '@/stores/AuthPBX'
import AuthSIP from '@/stores/AuthSIP'

import pbx from '../api/pbx'
import sip from '../api/sip'
import uc from '../api/uc'
import { BackgroundTimer } from '../utils/BackgroundTimer'
import { IncomingCall } from '../utils/RnNativeModules'
import { arrToMap } from '../utils/toMap'
import waitTimeout from '../utils/waitTimeout'
import { getAuthStore } from './authStore'
import Call from './Call'
import { intlDebug } from './intl'
import Nav from './Nav'
import { reconnectAndWaitSip } from './reconnectAndWaitSip'
import RnAlert from './RnAlert'

export class CallStore {
  recentPn?: {
    uuid: string
    at: number
    action?: 'answered' | 'rejected'
  }
  recentCallActivityAt = 0

  cancelRecentPn = () => {
    const uuid = this.recentPn?.uuid || this.prevCallKeepUuid || ''
    console.error(`SIP PN debug: cancel PN uuid=${uuid}`)
    endCallKeep(uuid)
  }

  prevCallKeepUuid?: string
  private getIncomingCallkeep = (
    uuid: string,
    o?: { includingAnswered: boolean },
  ) => {
    let call = this.calls.find(
      c =>
        c.incoming &&
        !c.callkeepAlreadyRejected &&
        (!c.callkeepUuid || c.callkeepUuid === uuid) &&
        (o?.includingAnswered
          ? true
          : !c.answered && !c.callkeepAlreadyAnswered),
    )

    // if (!call) {
    //    let rnCalls =  await RNCallKeep.getCalls()

    //   //  [{
    //   //   callUUID: "E26B14F7-2CDF-48D0-9925-532199AE7C48",
    //   //   hasConnected: true,
    //   //   hasEnded: false,
    //   //   onHold: false,
    //   //   outgoing: false,
    //   // }]

    //    call = rnCalls.find(
    //     c =>
    //       c.incoming &&
    //       !c.callkeepAlreadyRejected &&
    //       (!c.callkeepUuid || c.callkeepUuid === uuid) &&
    //       (o?.includingAnswered
    //         ? true
    //         : !c.answered && !c.callkeepAlreadyAnswered),
    //   )
    // }

    return call
  }

  onCallKeepDidDisplayIncomingCall = (uuid: string) => {
    if (Platform.OS === 'ios') {
      let date = new Date()
      Sentry.captureMessage(
        'init onCallKeepDidDisplayIncomingCall' +
          date.getSeconds() +
          ' ms ' +
          date.getMilliseconds(),
        Sentry.Severity.Debug,
      )
    }
    // Find the current incoming call which is not callkeep
    const c = this.getIncomingCallkeep(uuid)
    if (c) {
      if (Platform.OS === 'ios') {
        let date = new Date()
        Sentry.captureMessage(
          'init onCallKeepDidDisplayIncomingCall in c' +
            c +
            ' ' +
            date.getSeconds() +
            ' ms ' +
            date.getMilliseconds(),
          Sentry.Severity.Debug,
        )
      }
      // If the call is existing and not answered yet, we'll mark that call as displaying in callkeep
      // We assume that the app is being used in foreground (not quite exactly but assume)
      c.callkeepUuid = uuid
      let displayName = c.partyName
        ? c.partyName + ' (' + c.partyNumber + ')'
        : c.partyNumber
      RNCallKeep.updateDisplay(uuid, displayName, 'Qooqie Phone', {
        hasVideo: c.remoteVideoEnabled,
      })
      this.recentPn = undefined
    } else {
      // Otherwise save the data for later process
      this.recentPn = {
        uuid,
        at: Date.now(),
      }
    }
    // Allow 1 ringing callkeep only
    if (this.prevCallKeepUuid) {
      const prevCall = this.calls.find(
        c => c.callkeepUuid === this.prevCallKeepUuid,
      )
      if (prevCall) {
        prevCall.callkeepAlreadyRejected = true
      }
      endCallKeep(this.prevCallKeepUuid)
    }
    this.prevCallKeepUuid = uuid
    // New timeout logic
    callkeepMap[uuid] = {
      uuid,
      at: Date.now(),
    }
    setAutoEndCallKeepTimer()
  }
  onCallKeepAnswerCall = (uuid: string) => {
    const c = this.getIncomingCallkeep(uuid)
    if (c && !c.callkeepAlreadyAnswered) {
      c.callkeepAlreadyAnswered = true
      c.answer()
      console.error('SIP PN debug: answer by onCallKeepAnswerCall')
    } else if (this.recentPn?.uuid === uuid) {
      this.recentPn.action = 'answered'
    }
  }
  onCallKeepEndCall = (uuid: string) => {
    const c = this.getIncomingCallkeep(uuid, {
      includingAnswered: true,
    })
    if (Platform.OS === 'ios') {
      let date = new Date()
      Sentry.captureMessage(
        'init onCallKeepEndCall' +
          uuid +
          ' ' +
          c +
          ' ' +
          date.getSeconds() +
          ' ms ' +
          date.getMilliseconds(),
        Sentry.Severity.Debug,
      )
    }
    if (c) {
      c.callkeepAlreadyRejected = true
      c.hangup()
      console.error('SIP PN debug: reject by onCallKeepEndCall')
    } else if (this.recentPn?.uuid === uuid) {
      if (Platform.OS === 'ios') {
        let date = new Date()
        Sentry.captureMessage(
          'init onCallKeepEndCall elseif' +
            this.recentPn?.uuid +
            ' ' +
            c +
            ' ' +
            date.getSeconds() +
            ' ms ' +
            date.getMilliseconds(),
          Sentry.Severity.Debug,
        )
      }
      endCallKeep(uuid)
      this.recentPn.action = 'rejected'
      // } else {
      //   endCallKeep(uuid)
    } else {
      if (Platform.OS === 'ios') {
        let date = new Date()
        Sentry.captureMessage(
          'init onCallKeepEndCall else' +
            this.recentPn?.uuid +
            ' ' +
            c +
            ' ' +
            date.getSeconds() +
            ' ms ' +
            date.getMilliseconds(),
          Sentry.Severity.Debug,
        )
      }
      endCallKeep(uuid)
      // } else {
      //   endCallKeep(uuid)
    }
    if (this.prevCallKeepUuid === uuid) {
      this.prevCallKeepUuid = undefined
    }
  }

  endCallKeep = (
    // To keep reference on the Call type, use Pick
    c?: Pick<Call, 'callkeepUuid'> &
      Partial<Pick<Call, 'callkeepAlreadyRejected'>>,
  ) => {
    this.recentPn = undefined
    if (Platform.OS === 'ios') {
      let date = new Date()
      Sentry.captureMessage(
        'init endCallKeep' +
          c?.callkeepUuid +
          ' ' +
          date.getSeconds() +
          ' ms ' +
          date.getMilliseconds(),
        Sentry.Severity.Debug,
      )
    }
    if (c?.callkeepUuid) {
      const uuid = c.callkeepUuid
      c.callkeepUuid = ''
      c.callkeepAlreadyRejected = true
      endCallKeep(uuid)
    }
  }

  @observable calls: Call[] = []
  @computed get incomingCall() {
    return this.calls.find(c => c.incoming && !c.answered)
  }
  @observable currentCallId?: string = undefined
  @computed get currentCall() {
    this.updateCurrentCallDebounce()
    return this.calls.find(c => c.id === this.currentCallId)
  }
  @computed get backgroundCalls() {
    return this.calls.filter(
      c => c.id !== this.currentCallId && (!c.incoming || c.answered),
    )
  }

  @action upsertCall = (
    cPartial: Pick<Call, 'id'> & Partial<Omit<Call, 'id'>>,
  ) => {
    if (Platform.OS === 'ios') {
      let date = new Date()
      Sentry.captureMessage(
        'init upsertCall' +
          cPartial +
          ' ' +
          date.getSeconds() +
          ' ms ' +
          date.getMilliseconds(),
        Sentry.Severity.Debug,
      )
    }
    this.recentCallActivityAt = Date.now()
    const cExisting = this.calls.find(c => c.id === cPartial.id)
    if (cExisting) {
      if (!cExisting.answered && cPartial.answered) {
        cPartial.answeredAt = Date.now()
      }
      if (cPartial.endVideoCall) {
        cPartial.localVideoEnabled = false
        cPartial.remoteVideoEnabled = false
      }
      Object.assign(cExisting, cPartial)
      return
    }
    // Construct a new call
    const c = new Call(this)
    console.log(cPartial, 'cPartial')
    Object.assign(c, cPartial)
    this.calls = [c, ...this.calls]
    // Get and check callkeep
    let recentPnUuid = ''
    let recentPnAction = ''
    if (this.recentPn && Date.now() - this.recentPn.at < 20000) {
      recentPnUuid = this.recentPn.uuid
      recentPnAction = this.recentPn.action || ''
    }
    if (Platform.OS === 'web' || !recentPnUuid || !c.incoming || c.answered) {
      return
    }
    // Assign callkeep to the call and handle logic
    if (recentPnUuid) {
      c.callkeepUuid = recentPnUuid
    }
    if (!recentPnAction) {
      let displayName = c.partyName
        ? c.partyName + ' (' + c.partyNumber + ')'
        : c.partyNumber

      if (Platform.OS === 'ios') {
        let date = new Date()
        Sentry.captureMessage(
          'init upsertCall updatedisplay' +
            displayName +
            ' ' +
            date.getSeconds() +
            ' ms ' +
            date.getMilliseconds(),
          Sentry.Severity.Debug,
        )
      }
      RNCallKeep.updateDisplay(recentPnUuid, displayName, 'Qooqie Phone', {
        hasVideo: c.remoteVideoEnabled,
      })
      return
    }
    if (recentPnAction === 'answered') {
      if (Platform.OS === 'ios') {
        let date = new Date()
        Sentry.captureMessage(
          'init upsertCall updatedisplay recentPnAction answered' +
            ' ' +
            date.getSeconds() +
            ' ms ' +
            date.getMilliseconds(),
          Sentry.Severity.Debug,
        )
      }
      c.callkeepAlreadyAnswered = true
      c.answer()
      console.error('SIP PN debug: answer by recentPnAction')
    } else if (recentPnAction === 'rejected') {
      if (Platform.OS === 'ios') {
        let date = new Date()
        Sentry.captureMessage(
          'init upsertCall updatedisplay recentPnAction rejected' +
            ' ' +
            date.getSeconds() +
            ' ms ' +
            date.getMilliseconds(),
          Sentry.Severity.Debug,
        )
      }

      c.callkeepAlreadyRejected = true
      c.hangup()
      console.error('SIP PN debug: reject by recentPnAction')
    }
  }
  @action removeCall = (id: string) => {
    this.recentCallActivityAt = Date.now()
    const c = this.calls.find(c => c.id === id)
    if (c) {
      getAuthStore().pushRecentCall({
        id: uuid(),
        incoming: c.incoming,
        answered: c.answered,
        partyName: c.partyName,
        partyNumber: c.partyNumber,
        duration: c.duration,
        created: moment().format('HH:mm - MMM D'),
      })
      if (uc.client && c.duration && !c.incoming) {
        uc.sendCallResult(c.duration, c.partyNumber)
      }
    }
    this.calls = this.calls.filter(c => c.id !== id)
    this.endCallKeep(c)
    if (!this.calls.length && Platform.OS !== 'web') {
      this.isLoudSpeakerEnabled = false
      IncallManager.setForceSpeakerphoneOn(false)
    }
  }

  @action selectBackgroundCall = (c: Call) => {
    if (c.holding) {
      c.toggleHold()
    }
    this.currentCallId = c.id
    Nav().backToPageBackgroundCalls()
  }

  private startCallIntervalAt = 0
  private startCallIntervalId = 0
  private clearStartCallIntervalTimer = () => {
    if (this.startCallIntervalId) {
      BackgroundTimer.clearInterval(this.startCallIntervalId)
      this.startCallIntervalId = 0
    }
  }
  startCall = async (number: string, options = {}) => {
    const s = sip.phone?.getPhoneStatus()

    if (
      s === undefined ||
      (s !== 'starting' && s !== 'started') ||
      getAuthStore().sipConnectingOrFailure
    ) {
      console.log('currentCall is null')

      // Nav().backToPageCallRecents()
      RnAlert.dismiss()
      RnAlert.error({
        message: intlDebug`Sip connection failed, Please login again`,
      })
      sip.disconnect()
      const authSIP = new AuthSIP()
      const authPBX = new AuthPBX()
      setTimeout(() => {
        getAuthStore().reconnectPbx()
        getAuthStore().reconnectSip()
        authPBX.auth()
        authSIP.sipReconnect()
      }, 300)

      return
    }

    let reconnectCalled = false
    const startCall = async (isReconnect?: boolean) => {
      console.log('taggy 6')

      if (isReconnect) {
        console.log('taggy 7')

        // Do not call sip too frequencely on reconnect
        await waitTimeout(3000)
      }
      await pbx.getConfig()
      sip.createSession(number, options)
      console.log('taggy 8')
    }
    try {
      await startCall()
    } catch (err) {
      reconnectAndWaitSip(startCall)
      reconnectCalled = true
    }

    console.log('taggy 9', getAuthStore().sipConnectingOrFailure)
    // const s = sip.phone?.getPhoneStatus()

    // if (s === undefined || (s !== 'starting' && s !== 'started') || getAuthStore().sipConnectingOrFailure) {
    //   console.log('currentCall is null')

    //   // Nav().backToPageCallRecents()
    //   RnAlert.error({
    //     message: intlDebug`Sip connection failed, Please login again1`,
    //   })
    //   sip.disconnect()
    //   const authSIP = new AuthSIP()
    //   const authPBX = new AuthPBX()
    //   setTimeout(() => {
    //     getAuthStore().reconnectPbx()
    //     getAuthStore().reconnectSip()
    //     authPBX.auth()
    //     authSIP.sipReconnect()
    //   }, 300)

    //   return
    // } else {
    Nav().goToPageCallManage({ propsNumber: number })
    // }

    getAuthStore().callConnecting = true
    console.log('taggy 1')
    // Auto update currentCallId
    this.currentCallId = undefined
    const prevIds = arrToMap(this.calls, 'id') as { [k: string]: boolean }
    this.clearStartCallIntervalTimer()
    this.startCallIntervalAt = Date.now()
    this.startCallIntervalId = BackgroundTimer.setInterval(() => {
      console.log('taggy 2')

      const currentCallId = this.calls.map(c => c.id).find(id => !prevIds[id])
      // If after 3s and there's no call in the store
      // It's likely a connection issue occurred
      if (
        !reconnectCalled &&
        !currentCallId &&
        Date.now() - this.startCallIntervalAt > 3000
      ) {
        console.log('taggyy 3')
        getAuthStore().callConnecting = false
        RnAlert.dismiss()
        RnAlert.error({
          message: intlDebug`Sip connection failed, Please login again`,
        })
        Nav().backToPageCallRecents()

        this.clearStartCallIntervalTimer()
        // reconnectAndWaitSip(startCall)
        return
      } else if (
        !currentCallId &&
        Date.now() - this.startCallIntervalAt > 3000
      ) {
        console.log('taggyy 3')
        getAuthStore().callConnecting = false
        RnAlert.dismiss()
        RnAlert.error({
          message: intlDebug`Sip connection failed, Please login again`,
        })
        Nav().backToPageCallRecents()
        this.clearStartCallIntervalTimer()
        // reconnectAndWaitSip(startCall)
        return
      }
      if (currentCallId) {
        console.log('taggy 4')
        // Nav().goToPageCallManage()
        getAuthStore().callConnecting = false

        this.currentCallId = currentCallId
      }
      // Add a guard of 10s to clear the interval
      if (currentCallId || Date.now() - this.startCallIntervalAt > 10000) {
        console.log('taggy 5')

        this.clearStartCallIntervalTimer()
      }
    }, 500)
  }

  startVideoCall = (number: string) => {
    this.startCall(number, {
      videoEnabled: true,
    })
  }

  private updateCurrentCall = () => {
    let currentCall: Call | undefined
    if (this.calls.length) {
      currentCall =
        this.calls.find(c => c.id === this.currentCallId) ||
        this.calls.find(c => c.answered && !c.holding) ||
        this.calls[0]
    }
    const currentCallId = currentCall?.id
    if (currentCallId !== this.currentCallId) {
      BackgroundTimer.setTimeout(
        action(() => (this.currentCallId = currentCallId)),
        300,
      )
    }
    this.updateBackgroundCallsDebounce()
  }
  private updateCurrentCallDebounce = debounce(this.updateCurrentCall, 500, {
    maxWait: 1000,
  })
  @action private updateBackgroundCalls = () => {
    // Auto hold background calls
    this.calls
      .filter(
        c =>
          c.id !== this.currentCallId &&
          c.answered &&
          !c.transferring &&
          !c.holding,
      )
      .forEach(c => c.toggleHold())
  }
  private updateBackgroundCallsDebounce = debounce(
    this.updateBackgroundCalls,
    500,
    {
      maxWait: 1000,
    },
  )

  @observable isLoudSpeakerEnabled = false
  @action toggleLoudSpeaker = () => {
    if (Platform.OS !== 'web') {
      this.isLoudSpeakerEnabled = !this.isLoudSpeakerEnabled
      IncallManager.setForceSpeakerphoneOn(this.isLoudSpeakerEnabled)
    }
  }

  @action enableLoudSpeaker = () => {
    if (Platform.OS !== 'web') {
      this.isLoudSpeakerEnabled = true
      IncallManager.setForceSpeakerphoneOn(true)
    }
  }

  @observable newVoicemailCount = 0

  // Style in CallVideosUI to save the previous video position
  @observable videoPositionT = 25
  @observable videoPositionL = 5

  dispose = () => {
    this.clearStartCallIntervalTimer()
  }
}

const callStore = new CallStore()

let callkeepMap: {
  [uuid: string]: {
    uuid: string
    at: number
  }
} = {}
let totalEmptyCallsAttempt = 0
let autoEndCallKeepTimerId = 0
const clearAutoEndCallKeepTimer = () => {
  if (Platform.OS === 'web' || !autoEndCallKeepTimerId) {
    return
  }
  totalEmptyCallsAttempt = 0
  BackgroundTimer.clearInterval(autoEndCallKeepTimerId)
  autoEndCallKeepTimerId = 0
}
const setAutoEndCallKeepTimer = () => {
  if (Platform.OS === 'web') {
    return
  }
  clearAutoEndCallKeepTimer()
  autoEndCallKeepTimerId = BackgroundTimer.setInterval(() => {
    const n = Date.now()
    if (
      !callStore.calls.length &&
      (!callStore.recentPn || n - callStore.recentPn.at > 20000)
    ) {
      callkeepMap = {}
    } else {
      const prev = callStore.prevCallKeepUuid
      Object.values(callkeepMap).forEach(k => {
        const d2 = n - k.at
        const c = callStore.calls.find(c => c.callkeepUuid === k.uuid)
        if ((d2 > 20000 && !c) || (prev && prev !== k.uuid)) {
          if (c) {
            c.callkeepUuid = ''
            c.callkeepAlreadyRejected = true
          }
          endCallKeep(k.uuid)
          if (prev === k.uuid) {
            callStore.recentPn = undefined
          }
        }
      })
    }
    if (!Object.keys(callkeepMap).length) {
      totalEmptyCallsAttempt += 1
      const endAllCalls = () => {
        if (totalEmptyCallsAttempt > 2) {
          clearAutoEndCallKeepTimer()
        }
        RNCallKeep.endAllCalls()
      }
      if (Platform.OS === 'ios') {
        endAllCalls()
      } else if (
        callStore.recentPn?.action !== 'answered' &&
        !callStore.calls.find(c => c.answered || c.callkeepAlreadyAnswered)
      ) {
        endAllCalls()
        IncomingCall.closeIncomingCallActivity()
      }
    }
  }, 1000)
}
const endCallKeep = (uuid: string) => {
  if (Platform.OS === 'ios') {
    let date = new Date()
    Sentry.captureMessage(
      'init const endCallKeep' +
        callStore.calls.length +
        ' ' +
        callStore.recentPn +
        ' ' +
        callStore.recentPn?.at +
        ' ' +
        date.getSeconds() +
        ' ms ' +
        date.getMilliseconds(),
      Sentry.Severity.Debug,
    )
  }
  delete callkeepMap[uuid]
  const n = Date.now()
  if (
    !callStore.calls.length &&
    (!callStore.recentPn || n - callStore.recentPn.at > 20000)
  ) {
    if (Platform.OS === 'ios') {
      let date = new Date()
      Sentry.captureMessage(
        'init const endCallKeep in if' +
          date.getSeconds() +
          ' ms ' +
          date.getMilliseconds(),
        Sentry.Severity.Debug,
      )
    }
    RNCallKeep.endAllCalls()
    RNCallKeep.rejectCall(uuid)
    callStore.recentPn = undefined
  } else {
    if (Platform.OS === 'ios') {
      let date = new Date()
      Sentry.captureMessage(
        'init const endCallKeep in else' +
          date.getSeconds() +
          ' ms ' +
          date.getMilliseconds(),
        Sentry.Severity.Debug,
      )
    }
    RNCallKeep.rejectCall(uuid)
    RNCallKeep.endCall(uuid)
  }
  if (Platform.OS === 'ios') {
    let date = new Date()
    Sentry.captureMessage(
      'init const endCallKeep in endinng' +
        date.getSeconds() +
        ' ms ' +
        date.getMilliseconds(),
      Sentry.Severity.Debug,
    )
  }
  RNCallKeep.reportEndCallWithUUID(
    uuid,
    CONSTANTS.END_CALL_REASONS.REMOTE_ENDED,
  )
}

export default callStore
