import { observe } from 'mobx'
import { observer } from 'mobx-react'
import React, { Fragment, useEffect } from 'react'
import {
  ActivityIndicator,
  AppState,
  BackHandler,
  Dimensions,
  Keyboard,
  LogBox,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import SplashScreen from 'react-native-splash-screen'

import { SyncPnToken } from '@/api/syncPnToken'
import AnimatedSize from '@/components/AnimatedSize'
import styles from '@/components/App/Styles'
import CallBar from '@/components/CallBar'
import CallNotify from '@/components/CallNotify'
import CallVideos from '@/components/CallVideos'
import CallVoices from '@/components/CallVoices'
import ChatGroupInvite, { UnreadChatNoti } from '@/components/ChatGroupInvite'
import { RnStatusBar, RnText } from '@/components/Rn'
import AuthPBX from '@/stores/AuthPBX'
import AuthSIP from '@/stores/AuthSIP'
import { getAuthStore } from '@/stores/authStore'
import authStore from '@/stores/authStore2'
import AuthUC from '@/stores/AuthUC'
import callStore from '@/stores/callStore'
import chatStore from '@/stores/chatStore'
import contactStore from '@/stores/contactStore'
import intl from '@/stores/intl'
import Nav from '@/stores/Nav'
import profileStore from '@/stores/profileStore'
import RnAlert from '@/stores/RnAlert'
import RnAlertRoot from '@/stores/RnAlertRoot'
import RnKeyboard from '@/stores/RnKeyboard'
import RnPicker from '@/stores/RnPicker'
import RnPickerRoot from '@/stores/RnPickerRoot'
import RnStacker from '@/stores/RnStacker'
import RootStacks from '@/stores/RnStackerRoot'
import { setupCallKeep } from '@/utils/callkeep'
import CustomColors from '@/utils/CustomColors'
import CustomValues from '@/utils/CustomValues'
// @ts-ignore
import PushNotification from '@/utils/PushNotification'
import registerOnUnhandledError from '@/utils/registerOnUnhandledError'

import api from '../../api/index'

// API was a component but had been rewritten to a listener
void api

AppState.addEventListener('change', () => {
  if (AppState.currentState === 'active') {
    getAuthStore().reconnect()
    PushNotification.resetBadgeNumber()
  }
})
registerOnUnhandledError(unexpectedErr => {
  // Must wrap in window.setTimeout to make sure
  //    there's no state change when rendering
  window.setTimeout(() => RnAlert.error({ unexpectedErr }))
  return false
})

const getAudioVideoPermission = () => {
  const cb = (s: MediaStream) => s.getTracks().forEach(t => t.stop())
  const er = (err: MediaStreamError) => {
    /* TODO */
  }
  const p = (window.navigator.getUserMedia(
    {
      audio: true,
      video: true,
    },
    cb,
    er,
  ) as unknown) as Promise<MediaStream>
  if (p?.then) {
    p.then(cb).catch(er)
  }
}

if (
  AppState.currentState === 'active' &&
  !callStore.calls.length &&
  !callStore.recentPn &&
  !authStore.sipPn.sipAuth
) {
  getAudioVideoPermission()
}

// Handle android hardware back button press
BackHandler.addEventListener('hardwareBackPress', () => {
  if (RnKeyboard.isKeyboardShowing) {
    Keyboard.dismiss()
    return true
  }
  if (RnAlert.alerts.length) {
    RnAlert.dismiss()
    return true
  }
  if (RnPicker.currentRnPicker) {
    RnPicker.dismiss()
    return true
  }
  if (RnStacker.stacks.length > 1) {
    RnStacker.stacks.pop()
    return true
  }
  return false
})

let alreadyInitApp = false
PushNotification.register(() => {
  if (alreadyInitApp) {
    return
  }
  const s = getAuthStore()
  alreadyInitApp = true

  setupCallKeep()
  profileStore.loadProfilesFromLocalStorage().then(() => {
    if (AppState.currentState === 'active') {
      SyncPnToken().syncForAllAccounts()
    }
  })

  Nav().goToPageIndex()
  s.handleUrlParams()

  const authPBX = new AuthPBX()
  const authSIP = new AuthSIP()
  const authUC = new AuthUC()

  observe(s, 'signedInId', () => {
    chatStore.clearStore()
    contactStore.clearStore()
    if (s.signedInId) {
      s.reconnect()
      authPBX.auth()
    } else {
      authPBX.dispose()
      authSIP.dispose()
      authUC.dispose()
      SyncPnToken().sync(profileStore.profiles[0], {
        onError: () => {
          // Revert on error?
          // p0.pushNotificationEnabled = pn0
          // this.profiles = profiles0
          // this.saveProfilesToLocalStorage()
        },
        noUpsert: true,
      })
    }
  })

  observe(s, 'loginPressed', () => {
    if (profileStore.profiles && profileStore.profiles[0]) {
      profileStore.profiles[0].loginPressed = s.loginPressed
      profileStore.saveProfilesToLocalStorage()
    }
    Nav().goToPageIndex()
  })
})

const App = observer(() => {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      SplashScreen.hide()
    }
    LogBox.ignoreAllLogs()
  }, [])

  if (!profileStore.profilesLoadedObservable) {
    return (
      <View style={styles.loadingFullScreen}>
        <ActivityIndicator size='small' color='white' />
      </View>
    )
  }
  const s = getAuthStore()
  const {
    isConnFailure,
    pbxConnectingOrFailure,
    shouldShowConnStatus,
    sipConnectingOrFailure,
    ucConnectingOrFailure,
    ucLoginFromAnotherPlace,
    pbxTotalFailure,
    sipTotalFailure,
    ucTotalFailure,
    signedInId,
    loginPressed,
  } = s
  let service = ''
  let isRetrying = false
  if (pbxConnectingOrFailure) {
    service = intl`PBX`
    isRetrying = pbxTotalFailure > 0
  } else if (sipConnectingOrFailure) {
    service = intl`SIP`
    isRetrying = sipTotalFailure > 0
  } else if (ucConnectingOrFailure) {
    service = intl`UC`
    isRetrying = ucTotalFailure > 0
  }
  let connMessage =
    service &&
    (isConnFailure
      ? intl`${service} connection failed`
      : intl`Connecting to ${service}...`)
  void isRetrying
  if (isConnFailure && ucConnectingOrFailure && ucLoginFromAnotherPlace) {
    connMessage = intl`UC signed in from another location`
  }

  return (
    <Fragment>
      <View
        style={{
          width: CustomValues.compatableWidth,
          flex: 1,
          backgroundColor: 'white',
        }}
      >
        <RnStatusBar />
        {shouldShowConnStatus && !!signedInId && (
          <AnimatedSize
            style={[
              styles.appConnectionStatus,
              isConnFailure && styles.appConnectionStatusFailure,
            ]}
          >
            <View style={styles.appConnectionStatusInner}>
              <RnText small white>
                {connMessage}
              </RnText>
            </View>
          </AnimatedSize>
        )}

        {!!signedInId && !!loginPressed && (
          <>
            <CallNotify />
            <CallBar />
            <CallVoices />
            <ChatGroupInvite />
            <UnreadChatNoti />
          </>
        )}

        {signedInId &&
        !loginPressed &&
        !pbxTotalFailure &&
        !sipTotalFailure &&
        !ucTotalFailure ? (
          <View style={styles.container}>
            <ActivityIndicator color={CustomColors.ActiveBlue} size={'large'} />
          </View>
        ) : (
          <></>
        )}

        <View style={styles.appInner}>
          <RootStacks />
          <RnPickerRoot />
          <RnAlertRoot />
        </View>
        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </View>
      <SafeAreaView
        style={{ backgroundColor: CustomColors.AppBackground }}
      ></SafeAreaView>
    </Fragment>
  )
})

export default App
