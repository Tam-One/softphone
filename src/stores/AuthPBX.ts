import NetInfo from '@react-native-community/netinfo'
import * as Sentry from '@sentry/react-native'
import { debounce } from 'lodash'
import { Lambda, observe } from 'mobx'
import { Platform } from 'react-native'

import AuthSIP from '@/stores/AuthSIP'

import pbx from '../api/pbx'
import Nav from '../stores/Nav'
import { getAuthStore } from './authStore'
import { intlDebug } from './intl'
import RnAlert from './RnAlert'

class AuthPBX {
  private clearObserve?: Lambda
  auth() {
    console.log('taggy :: AuthPBX.auth')
    this.authWithCheck()
  }
  dispose() {
    this.clearObserve?.()
    pbx.disconnect()
    getAuthStore().pbxState = 'stopped'
  }

  private authWithCheck = () => {
    // alert('taggy :: AuthPBX.authWithCheck')
    // alert('taggy :: AuthPBX.authWithCheck ')
    // if (Platform.OS === 'ios') {
    //   let date = new Date()
    //   Sentry.captureMessage(
    //     'init pbbx  authWithCheck' +
    //       date.getSeconds() +
    //       ' ms ' +
    //       date.getMilliseconds(),
    //     Sentry.Severity.Debug,
    //   )
    // }
    console.log('authwithcheckpbx', getAuthStore().pbxShouldAuth)
    if (!getAuthStore().pbxShouldAuth) {
      return
    }
    pbx.disconnect()
    getAuthStore().pbxState = 'connecting'
    pbx
      .connect(getAuthStore().currentProfile)
      .then(() => {
        // if (Platform.OS === 'ios') {
        //   let date = new Date()
        //   Sentry.captureMessage(
        //     'init pbbx  authWithCheck connect completed' +
        //       date.getSeconds() +
        //       ' ms ' +
        //       date.getMilliseconds(),
        //     Sentry.Severity.Debug,
        //   )
        // }
        getAuthStore().pbxState = 'success'
        console.log('pbc then')
        const authSIP = new AuthSIP()
        authSIP.auth()
      })
      .catch((err: Error) => {
        console.log('pbc catch')
        getAuthStore().pbxState = 'failure'
        getAuthStore().pbxTotalFailure += 1
        getAuthStore().signedInId = ''
        RnAlert.dismiss()
        NetInfo.fetch().then(state => {
          RnAlert.error({
            message: state.isConnected
              ? intlDebug`Invalid Credentials`
              : intlDebug`No Internet Connection`,
          })
        })

        getAuthStore().signOut()
        Nav().goToPageProfileSignIn()
      })
  }
  private authWithCheckDebounced = debounce(this.authWithCheck, 300)
}

export default AuthPBX
