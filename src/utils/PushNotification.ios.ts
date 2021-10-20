import './callkeep'

import PushNotificationIOS, {
  PushNotification as PN,
} from '@react-native-community/push-notification-ios'
import messaging from '@react-native-firebase/messaging'
import { AppState } from 'react-native'
import FCM, { FCMEvent, Notification as FPN } from 'react-native-fcm'
import Voip from 'react-native-voip-push-notification'

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
  if (!n) {
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
      title: n.body,
      body: n.isCall ? 'Answer' : 'View',
      sound: n.isCall ? 'incallmanager_ringtone.mp3' : undefined,
      badge: badge,
    })
    PushNotificationIOS.setApplicationIconBadgeNumber(badge)
  })
}

const getFcmToken = async () => {
  const token = await messaging().getToken()
  console.log('token')
  console.log(token)
  alert(token)
  onToken(token)
  onVoipToken(token)
}

const { Notification, RefreshToken } = FCMEvent
const PushNotification = {
  register: async (initApp: Function) => {
    try {
      initApp()
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
