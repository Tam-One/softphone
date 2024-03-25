import Url from 'url-parse'

import { getAuthStore } from '../stores/authStore'

export const checkImageUrl = (url: string) => {
  if (getAuthStore().phoneappliEnabled()) {
    return true
  }
  url = url.toLowerCase()
  const u = new Url(url)
  return (
    /\.(jpeg|jpg|gif|png)$/.test(u.pathname) ||
    // default image url from uc
    // https://dev01.brekeke.com:8443/uc/image?ACTION=DOWNLOAD&tenant=nam&user=1003&dlk=ltt3&SIZE=40
    url.includes('/uc/image?action=download&tenant')
  )
}
