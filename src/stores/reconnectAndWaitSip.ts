import { BackgroundTimer } from '../utils/BackgroundTimer'
import { getAuthStore } from './authStore'

export const reconnectAndWaitSip = (fn: Function) => {
  console.log('taggy reconnectAndWaitSip')
  getAuthStore().reconnectSip()
  waitSip(fn)
}

export const waitSip = (fn: Function, forceCallFn = false) => {
  console.log('taggy waitSip')
  const at = Date.now()
  const id = BackgroundTimer.setInterval(() => {
    const enoughTimePassed = Date.now() > at + 10000
    const isSipConnected = getAuthStore().sipState === 'success'
    if (enoughTimePassed || isSipConnected) {
      BackgroundTimer.clearInterval(id)
    }
    if (enoughTimePassed) {
      if (forceCallFn) {
        fn(false)
      }
      return
    }
    if (isSipConnected) {
      fn(true)
    }
  }, 500)
}
