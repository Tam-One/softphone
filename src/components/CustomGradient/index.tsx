import styles from 'components/CustomGradient/Styles'
import React from 'react'
import { ImageBackground } from 'react-native'
import CustomImages from 'utils/CustomImages'

const CustomGradient = props => (
  <ImageBackground
    {...props}
    source={CustomImages.BackgroundBlue}
    style={styles.CustomGradient}
  ></ImageBackground>
)

export default CustomGradient
