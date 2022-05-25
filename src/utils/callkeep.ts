import * as Sentry from '@sentry/react-native'
import { AppState, NativeEventEmitter, Platform } from 'react-native'
import RNCallKeep from 'react-native-callkeep'

import sip from '../api/sip'
import callStore from '../stores/callStore'
import intl, { intlDebug } from '../stores/intl'
import RnAlert from '../stores/RnAlert'
import { BackgroundTimer } from './BackgroundTimer'
import { getLastCallPn } from './PushNotification-parse'
import { IncomingCall, RnNativeModules } from './RnNativeModules'

let alreadSetupCallKeep = false

const _setupCallKeep = async () => {
  console.log('_setupCallKeep')
  if (alreadSetupCallKeep) {
    return
  }

  // Do not re-setup ios calls
  // https://github.com/react-native-webrtc/react-native-callkeep/issues/367#issuecomment-804923269
  if (
    Platform.OS === 'ios' &&
    Object.keys(await RNCallKeep.getCalls()).length
  ) {
    return
  }

  alreadSetupCallKeep = true

  await RNCallKeep.setup({
    ios: {
      appName: 'Qooqie Phone',
      imageName: 'callkit.png',
      // https://github.com/react-native-webrtc/react-native-callkeep/issues/193
      // https://github.com/react-native-webrtc/react-native-callkeep/issues/181
      supportsVideo: false,
    },
    android: {
      alertTitle: intl`Permissions required`,
      alertDescription: intl`Qooqie Phone needs to your permission to display calls`,
      cancelButton: intl`Cancel`,
      okButton: intl`OK`,
      imageName: 'phone_account_icon',
      additionalPermissions: [],
      // Android self-managed connection service forked version
      selfManaged: true,
    },
  })
    .then(() => {
      console.log('RNCallKeep.setup')

      RNCallKeep.registerPhoneAccount()
      RNCallKeep.registerAndroidEvents()
      RNCallKeep.setAvailable(true)
      RNCallKeep.canMakeMultipleCalls(false)
      if (Platform.OS === 'android') {
        RNCallKeep.setForegroundServiceSettings({
          channelId: 'com.brekeke.phone',
          channelName: 'Foreground service for Qooqie Phone',
          notificationTitle: 'Qooqie Phone is running on background',
          notificationIcon: 'ic_launcher',
        })
      }
    })
    .catch((err: Error) => {
      if (AppState.currentState !== 'active') {
        console.error(err)
        return
      }
      RnAlert.error({
        message: intlDebug`Can not get permission to show call notification`,
        err,
      })
    })
}

export const setupCallKeep = async () => {
  console.log('setupCallKeep')
  if (Platform.OS === 'web') {
    return
  }

  await _setupCallKeep()

  const onDidLoadWithEvents = (e: { name: string; data: unknown }[]) => {
    e.forEach(e => {
      // if (Platform.OS === 'ios') {
      //   let date = new Date()
      //   Sentry.captureMessage(
      //     'init onDidLoadWithEvents' +
      //       date.getSeconds() +
      //       ' ms ' +
      //       date.getMilliseconds() +
      //       ' ' +
      //       e.name +
      //       ' ' +
      //       JSON.stringify(e.data),
      //     Sentry.Severity.Debug,
      //   )
      // }
      handlers[e.name.replace('RNCallKeepPerform', 'on')]?.(e.data)
    })
  }
  const onAnswerCallAction = (e: { callUUID: string }) => {
    // if (Platform.OS === 'ios') {
    //   let date = new Date()
    //   Sentry.captureMessage(
    //     'init onAnswerCallAction' +
    //       date.getSeconds() +
    //       ' ms ' +
    //       date.getMilliseconds() +
    //       ' ' +
    //       e,
    //     Sentry.Severity.Debug,
    //   )
    // }

    // Use the custom native incoming call module for android
    if (Platform.OS === 'android') {
      return
    }
    const uuid = e.callUUID.toUpperCase()
    callStore.onCallKeepAnswerCall(uuid)
  }
  const onEndCallAction = (e: { callUUID: string }) => {
    // if (Platform.OS === 'ios') {
    //   let date = new Date()
    //   Sentry.captureMessage(
    //     'init onEndCallAction' +
    //       e.callUUID +
    //       ' ' +
    //       date.getSeconds() +
    //       ' ms ' +
    //       date.getMilliseconds(),
    //     Sentry.Severity.Debug,
    //   )
    // }

    console.log('onEndCallAction', e)
    // BackgroundTimer.setTimeout(_setupCallKeep, 0)
    // Use the custom native incoming call module for android
    if (Platform.OS === 'android') {
      return
    }
    const uuid = e.callUUID.toUpperCase()
    callStore.onCallKeepEndCall(uuid)
  }
  const onDidDisplayIncomingCall = (e: {
    callUUID: string
    handle: string
    localizedCallerName: string
    hasVideo: string // '0' | '1'
    fromPushKit: string // '0' | '1'
    payload: any // VOIP
    error: string // ios only
  }) => {
    const uuid = e.callUUID.toUpperCase()
    // Use the custom native incoming call module for android
    if (Platform.OS === 'android') {
      return
    }
    // if (Platform.OS === 'ios') {
    //   let date = new Date()
    //   Sentry.captureMessage(
    //     'init onDidDisplayIncomingCall' +
    //       e.payload +
    //       ' ' +
    //       date.getSeconds() +
    //       ' ms ' +
    //       date.getMilliseconds(),
    //     Sentry.Severity.Debug,
    //   )
    // }

    const { x_from, x_displayname } = e.payload

    // Try set the caller name from last known PN
    // const n = getLastCallPn()
    // if (
    //   n?.from &&
    //   (e.localizedCallerName === 'Loading...' || e.handle === 'Loading...')
    // ) {
    RNCallKeep.updateDisplay(uuid, x_displayname, 'Qooqie Phone')

    // if (callStore.calls.length === 0) {
    //   callStore.upsertCall({ "id": "1", "incoming": true, "partyNumber": x_from, "partyName": x_displayname, "remoteVideoEnabled": false, "localVideoEnabled": false })
    // }
    // Call event handler in callStore
    callStore.onCallKeepDidDisplayIncomingCall(uuid)
  }
  const onDidPerformSetMutedCallAction = (e: {
    callUUID: string
    muted: boolean
  }) => {
    // Use the custom native incoming call module for android
    if (Platform.OS === 'android') {
      return
    }
    const uuid = e.callUUID.toUpperCase()
    const c = callStore.calls.find(c => c.callkeepUuid === uuid)
    if (c && c.muted !== e.muted) {
      c.toggleMuted(true)
    }
  }
  const onDidToggleHoldCallAction = (e: {
    callUUID: string
    hold: boolean
  }) => {
    // Use the custom native incoming call module for android
    if (Platform.OS === 'android') {
      return
    }
    const uuid = e.callUUID.toUpperCase()
    const c = callStore.calls.find(c => c.callkeepUuid === uuid)
    if (c && c.holding !== e.hold) {
      c.toggleHold(true)
    }
  }
  const onDidPerformDTMFAction = (e: { callUUID: string; digits: string }) => {
    // Use the custom native incoming call module for android
    if (Platform.OS === 'android') {
      return
    }
    const uuid = e.callUUID.toUpperCase()
    const c = callStore.calls.find(c => c.callkeepUuid === uuid)
    if (c) {
      sip.sendDTMF({
        sessionId: c.id,
        signal: e.digits.charAt(e.digits.length - 1),
        talkerId: c.pbxTalkerId,
        tenant: c.pbxTenant,
      })
    }
  }
  const onShowIncomingCallUi = (e: { callUUID: string }) => {
    const uuid = e.callUUID.toUpperCase()
    const callDetails = callStore.calls.find(c => c.incoming)
    IncomingCall.showCall(
      uuid,
      callDetails?.partyName || '',
      callDetails?.partyNumber || getLastCallPn()?.from || 'Loading...',
      !!callStore.calls.find(c => c.incoming && c.remoteVideoEnabled),
    )
    callStore.onCallKeepDidDisplayIncomingCall(uuid)
    RNCallKeep.endAllCalls()
  }
  const handlers: { [k: string]: Function } = {
    onAnswerCallAction,
    onEndCallAction,
    onDidDisplayIncomingCall,
    onDidPerformSetMutedCallAction,
    onDidToggleHoldCallAction,
    onDidPerformDTMFAction,
    onShowIncomingCallUi,
  }

  RNCallKeep.addEventListener('didLoadWithEvents', onDidLoadWithEvents)
  RNCallKeep.addEventListener('answerCall', onAnswerCallAction)
  RNCallKeep.addEventListener('endCall', onEndCallAction)
  RNCallKeep.addEventListener(
    'didDisplayIncomingCall',
    onDidDisplayIncomingCall,
  )
  RNCallKeep.addEventListener(
    'didPerformSetMutedCallAction',
    onDidPerformSetMutedCallAction,
  )
  RNCallKeep.addEventListener(
    'didToggleHoldCallAction',
    onDidToggleHoldCallAction,
  )
  RNCallKeep.addEventListener('didPerformDTMFAction', onDidPerformDTMFAction)

  // Android self-managed connection service forked version
  if (Platform.OS === 'android') {
    RNCallKeep.addEventListener('showIncomingCallUi', onShowIncomingCallUi)
    const eventEmitter = new NativeEventEmitter(RnNativeModules.IncomingCall)
    eventEmitter.addListener('answerCall', (uuid: string) => {
      console.log('answerCall', uuid)
      uuid = uuid.toUpperCase()
      callStore.onCallKeepAnswerCall(uuid)
      IncomingCall.closeIncomingCallActivity(true)
    })
    eventEmitter.addListener('rejectCall', (uuid: string) => {
      console.log('rejectCall', uuid)
      uuid = uuid.toUpperCase()
      callStore.onCallKeepEndCall(uuid)
      IncomingCall.closeIncomingCallActivity()
    })
    // In case of answer call when phone locked
    eventEmitter.addListener('showCall', () => {
      console.log('showCall')
      RNCallKeep.backToForeground()
    })
  }
}
