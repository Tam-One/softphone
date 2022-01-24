import React from 'react'
import { View } from 'react-native'

import styles from '@/components/CustomGradient/Styles'
import CustomValues from '@/utils/CustomValues'

const CustomGradient = props => (
  <View
    {...props}
    style={[
      styles.CustomGradient,
      props.customStyle,
      CustomValues.iosAndroid && styles.flexbox,
    ]}
  ></View>
)

export default CustomGradient
