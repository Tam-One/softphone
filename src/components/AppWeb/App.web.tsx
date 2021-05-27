// Main entry for the create-react-app web bundle

import { mdiAndroid, mdiApple, mdiWeb } from '@mdi/js'
import brand from 'assets/brand.png'
import logo from 'assets/logo.png'
// @ts-ignore
import App from 'components/App/App.tsx'
import styles from 'components/AppWeb/Styles'
import BrekekeGradient from 'components/BrekekeGradient'
import { RnIcon, RnImage, RnText, RnTouchableOpacity } from 'components/Rn'
import qs from 'qs'
import React, { ReactElement, useState } from 'react'
import { isAndroid, isIOS } from 'react-device-detect'
import { View } from 'react-native'
import intl from 'stores/intl'
import Url from 'url-parse'
import parse from 'utils/deeplink-parse'

const globalCss = `* {
  outline: none !important;
  box-sizing: border-box;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
*::-webkit-scrollbar {
  display: none;
}
a {
  text-decoration: none;
}`

requestAnimationFrame(() => {
  const s = document.createElement('style')
  s.type = 'text/css'
  s.appendChild(document.createTextNode(globalCss))
  const h = document.head || document.getElementsByTagName('head')[0]
  h.appendChild(s)
})

const AppSelection = () => {
  const [isBrowser, setIsBrowser] = useState(!isIOS && !isAndroid)
  let child: ReactElement | null = null
  if (isBrowser) {
    child = <App />
  } else {
    const params = parse((window.location as unknown) as Url)
    const q = qs.stringify(params)
    const appUrl = isIOS
      ? `brekekeapp://open?${q}`
      : `intent://open?${q}#Intent;scheme=brekekeapp;package=com.brekeke.phonedev;end`
    child = (
      <>
        <RnImage
          source={{
            uri: logo,
          }}
          style={styles.webAppLogo}
        />
        <RnImage
          source={{
            uri: brand,
          }}
          style={styles.webAppBrand}
        />
        <a href={appUrl}>
          <RnTouchableOpacity style={[styles.webAppBtn, styles.webAppBtnApp]}>
            <RnText small style={styles.webAppBtnTxtBrowser}>
              {intl`OPEN IN APP`}
            </RnText>
            <RnIcon
              color='white'
              path={isIOS ? mdiApple : mdiAndroid}
              style={styles.webAppIcon}
            />
          </RnTouchableOpacity>
        </a>
        <RnTouchableOpacity
          onPress={() => setIsBrowser(true)}
          style={[styles.webAppBtn, styles.webAppBtnBrowser]}
        >
          <RnText small>{intl`OPEN IN BROWSER`}</RnText>
          <RnIcon path={mdiWeb} style={styles.webAppIcon} />
        </RnTouchableOpacity>
      </>
    )
  }
  const Container = isBrowser ? View : BrekekeGradient
  return <Container style={styles.webApp}>{child}</Container>
}

export default AppSelection
