import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { action, observable } from 'mobx'
import { AppState, Platform } from 'react-native'

export class RnAppState {
  @observable currentState = AppState.currentState
  constructor() {
    AppState.addEventListener(
      'change',
      action(() => {
        this.currentState = AppState.currentState
        // if (Platform.OS === 'ios') {
        //   PushNotificationIOS.removeAllDeliveredNotifications()
        // }
      }),
    )
  }
}

export default new RnAppState()
