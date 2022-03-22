import NetInfo from '@react-native-community/netinfo'
import * as Sentry from '@sentry/react-native'
import { observe } from 'mobx'
import { observer } from 'mobx-react'
import React, { Fragment, useEffect, useState } from 'react'
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
import sip from '../../api/sip'

// API was a component but had been rewritten to a listener
void api

var int

clearInterval(int)

// int = setInterval(() => {
//   const authSIP = new AuthSIP()
//   const authPBX = new AuthPBX()
//   const s = sip.phone?.getPhoneStatus()
//   console.log('phoestatt tggg', s)
//   if (s === undefined || (s !== 'starting' && s !== 'started')) {
//     sip.disconnect()
//     setTimeout(() => {
//       getAuthStore().reconnectPbx()
//       getAuthStore().reconnectSip()
//       authPBX.auth()
//       authSIP.sipReconnect()
//     }, 300)
//   }
// }, 2000)

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

var alreadyInitApp = false
var activelist = true
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
    console.log('signinnid', s)
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
    AppState.addEventListener('change', () => {
      const authSIP = new AuthSIP()
      const authPBX = new AuthPBX()
      console.log(authSIP.getObservere())
      if (AppState.currentState === 'active') {
        const s = sip.phone?.getPhoneStatus()
        console.log('phoestatt', s)
        console.log(getAuthStore().pbxState, 'getAuthStore().pbxState')
        if (s === undefined || (s !== 'starting' && s !== 'started')) {
          sip.disconnect()
          setTimeout(() => {
            getAuthStore().reconnectPbx()
            getAuthStore().reconnectSip()
            authPBX.auth()
            authSIP.sipReconnect()
          }, 300)
        }
        activelist = false
        // alert('a')
        // if (s === undefined || (s !== 'starting' && s !== 'started')) {
        // window.location.reload()
        // console.error(`PN debug: SIP reconnect: getPhoneStatus()=${s}`)
        // const s = sip.phone?.getPhoneStatus()
        // if (s && s !== 'starting' && s !== 'started') {
        // console.error(`PN debug: SIP reconnect: getPhoneStatus()=${s}`)
        // }
        // if (this.sipPn.sipAuth) {
        //   return
        // }
        // await pbx.client?._pal('getProductInfo').catch((err: Error) => {
        //   if (authStore.pbxState === 'connecting') {
        //     return
        //   }
        //   console.error(`PN debug: PBX reconnect: getProductInfo() error=${err}`)
        //   this.reconnectPbx()
        // })
        // }
        // getAuthStore().reconnect()
        // PushNotification.resetBadgeNumber()
        // window.location.reload()
        // const s = getAuthStore()
        // setupCallKeep()
        // profileStore.loadProfilesFromLocalStorage().then(() => {
        //   SyncPnToken().syncForAllAccounts()
        // })
        // s.handleUrlParams()
      }
    })
  })

  activelist = false
})

const App = observer(() => {
  const [internetConnected, setInternetConnected] = useState(true)
  useEffect(() => {
    if (Platform.OS !== 'web') {
      SplashScreen.hide()
    }
    LogBox.ignoreAllLogs()
    Sentry.init({
      dsn:
        'https://048b2053107a4d3bb5f8d1bb69bc246c@o1134185.ingest.sentry.io/6181403',
      tracesSampleRate: 1,
      environment: 'development',
    })
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      setInternetConnected(!!state.isConnected)
    })
    return unsubscribe
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
    callConnecting,
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

  if (!internetConnected) {
    connMessage = intl`Please check your internet connection`
  }

  const bottomBarColor =
    !!signedInId && !!loginPressed
      ? CustomColors.MediumBlack
      : CustomColors.AppBackground

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
            <CallVoices />
            <ChatGroupInvite />
            <UnreadChatNoti />
          </>
        )}

        {callConnecting ||
        (signedInId &&
          !loginPressed &&
          !pbxTotalFailure &&
          !sipTotalFailure &&
          !ucTotalFailure) ? (
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
        style={{
          backgroundColor: bottomBarColor,
        }}
      ></SafeAreaView>
    </Fragment>
  )
})
var Comp
if (CustomValues.iosAndroid) {
  Comp = Sentry.wrap(App)
} else {
  Comp = App
}

export default Comp
