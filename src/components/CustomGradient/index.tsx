import React from 'react'
import { ImageBackground, Platform } from 'react-native'

import styles from '@/components/CustomGradient/Styles'
import CustomImages from '@/utils/CustomImages'

const CustomGradient = props => (
  <ImageBackground
    {...props}
    source={CustomImages.BackgroundBlue}
    style={[
      styles.CustomGradient,
      props.customStyle,
      Platform.OS !== 'web' && styles.flexbox,
    ]}
  ></ImageBackground>
)

export default CustomGradient
