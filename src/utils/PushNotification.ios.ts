import './callkeep'

import PushNotificationIOS, {
  PushNotification as PN,
} from '@react-native-community/push-notification-ios'
import messaging from '@react-native-firebase/messaging'
import { AppState } from 'react-native'
import FCM, { FCMEvent, Notification as FPN } from 'react-native-fcm'
import Voip from 'react-native-voip-push-notification'

import CustomValues from './CustomValues'
import parse from './PushNotification-parse'

let voipApnsToken = ''
const onVoipToken = (t: string) => {
  if (t) {
    voipApnsToken = t
  }
}

let apnsToken = ''
const onToken = (t: string) => {
  if (t) {
    apnsToken = t
  }
}

const onNotification = async (
  n0: any | null,
  initApp: Function,
  isLocal = false,
) => {
  const n: any = parse((n0 as unknown) as { [k: string]: unknown }, isLocal)
  console.log('onNotification', n0)
  console.log('onNotification', n)

  if (AppState.currentState === 'active' || !n || !n0 || !n0.x_title) {
    return
  }
  initApp()
  PushNotificationIOS.getApplicationIconBadgeNumber(badge => {
    badge = 1 + (Number(badge) || 0)
    if (AppState.currentState === 'active') {
      badge = 0
    }
    PushNotificationIOS.addNotificationRequest({
      id: 'call',
      title: n0.x_title,
      body: n.isCall ? 'Answer' : 'View',
      sound: n.isCall ? 'incallmanager_ringtone.mp3' : undefined,
      badge: 0,
    })
    PushNotificationIOS.setApplicationIconBadgeNumber(0)
  })
}

const getFcmToken = async () => {
  const token = await messaging().getToken()
  onToken(token)
  onVoipToken(token)
}

const { Notification, RefreshToken } = FCMEvent
const PushNotification = {
  register: async (initApp: Function) => {
    try {
      PushNotificationIOS.requestPermissions()
      // alert('PushNotificationIOS.requestPermissions')
      initApp()
      //
      Voip.addEventListener('register', onVoipToken)
      Voip.addEventListener('notification', (n: PN) =>
        onNotification(n, initApp),
      )
      Voip.addEventListener(
        'didLoadWithEvents',
        (e: { name: string; data: PN }[]) => {
          if (!e?.length) {
            return
          }
          e.forEach(({ name, data }) => {
            if (name === Voip.RNVoipPushRemoteNotificationsRegisteredEvent) {
              if (typeof data === 'string') {
                onVoipToken(data)
              }
            } else if (
              name === Voip.RNVoipPushRemoteNotificationReceivedEvent
            ) {
              onNotification(data, initApp)
            }
          })
        },
      )
      Voip.registerVoipToken()
      //
      PushNotificationIOS.addEventListener('register', onToken)
      PushNotificationIOS.addEventListener('notification', (n: PN) =>
        onNotification(n, initApp),
      )
      PushNotificationIOS.addEventListener('localNotification', (n: PN) =>
        onNotification(n, initApp, true),
      )

      //
      // const n0 = await PushNotificationIOS.getInitialNotification()
      // onNotification(n0, initApp, true)
    } catch (err) {
      console.log(err)
    }
  },
  getVoipToken: () => {
    return Promise.resolve(voipApnsToken)
  },
  getToken: () => {
    return Promise.resolve(apnsToken)
  },
  resetBadgeNumber: () => {
    PushNotificationIOS.setApplicationIconBadgeNumber(0)
  },
}

export default PushNotification
