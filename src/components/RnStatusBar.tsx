import React, { FC } from 'react'
import {
  Platform,
  StatusBar,
  StatusBarIOS,
  StyleSheet,
  View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

import CustomColors from '@/utils/CustomColors'

import v from './variables'

const css = StyleSheet.create({
  RnStatusBar: {
    backgroundColor: CustomColors.StatusBarBlue,
    ...v.backdropZindex,
    ...Platform.select({
      ios: {
        height: getStatusBarHeight(true),
      },
    }),
  },
  RnStatusBar__transparent: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  Border: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderColor: v.borderBg,
    borderBottomWidth: 1,
    ...v.backdropZindex,
  },
})

const RnStatusBar: FC<{ transparent?: boolean }> = props =>
  Platform.OS === 'web' ? null : (
    <View
      style={[
        css.RnStatusBar,
        props.transparent && css.RnStatusBar__transparent,
      ]}
    >
      <StatusBar
        backgroundColor={CustomColors.StatusBarBlue}
        barStyle='dark-content'
      />
    </View>
  )

export default RnStatusBar
