import React, { FC } from 'react'
import { Image, ImageProps, ImageSourcePropType, View } from 'react-native'

import { RnText, RnTouchableOpacity } from '../Rn'
import styles from './Styles'

const CallActionButton: FC<{
  disabled?: boolean
  onPress?(): void
  bgcolor?: string
  name?: string
  textcolor?: string
  image: ImageSourcePropType
  imageStyle?: ImageProps['style']
}> = p => {
  return (
    <RnTouchableOpacity
      disabled={p.disabled}
      onPress={p.onPress}
      style={[styles.buttonIconBtn, { backgroundColor: p.bgcolor }]}
    >
      <Image source={p.image} style={[styles.btnLogo, p.imageStyle]}></Image>
      <RnText
        style={[styles.buttonIconName, !!p.textcolor && { color: p.textcolor }]}
      >
        {p.name}
      </RnText>
    </RnTouchableOpacity>
  )
}

export default CallActionButton
