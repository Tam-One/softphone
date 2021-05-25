import styles from 'components/CallActionButton/Styles'
import { RnText, RnTouchableOpacity } from 'components/Rn'
import React, { FC } from 'react'
import { Image, ImageProps, ImageSourcePropType, View } from 'react-native'

const CallActionButton: FC<{
  disabled?: boolean
  onPress?(): void
  bgcolor?: string
  name?: string
  textcolor?: string
  image: ImageSourcePropType
  imageStyle?: ImageProps['style']
}> = p => {
  const { disabled, onPress, bgcolor, name, textcolor, image, imageStyle } = p
  return (
    <RnTouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.buttonIconBtn, { backgroundColor: bgcolor }]}
    >
      <Image source={image} style={[styles.btnLogo, imageStyle]}></Image>
      <RnText
        style={[styles.buttonIconName, !!textcolor && { color: textcolor }]}
      >
        {name}
      </RnText>
    </RnTouchableOpacity>
  )
}

export default CallActionButton
