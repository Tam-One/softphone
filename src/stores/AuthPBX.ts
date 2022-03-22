import NetInfo from '@react-native-community/netinfo'
import { debounce } from 'lodash'
import { Lambda, observe } from 'mobx'

import AuthSIP from '@/stores/AuthSIP'

import pbx from '../api/pbx'
import Nav from '../stores/Nav'
import { getAuthStore } from './authStore'
import { intlDebug } from './intl'
import RnAlert from './RnAlert'

class AuthPBX {
  private clearObserve?: Lambda
  auth() {
    this.authWithCheck()
  }
  dispose() {
    this.clearObserve?.()
    pbx.disconnect()
    getAuthStore().pbxState = 'stopped'
  }

  private authWithCheck = () => {
    console.log('authwithcheckpbx', getAuthStore().pbxShouldAuth)
    if (!getAuthStore().pbxShouldAuth) {
      return
    }
    pbx.disconnect()
    getAuthStore().pbxState = 'connecting'
    pbx
      .connect(getAuthStore().currentProfile)
      .then(() => {
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
