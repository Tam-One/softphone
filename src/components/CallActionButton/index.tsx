import React, { FC } from 'react'
import { Image, ImageProps, ImageSourcePropType, View } from 'react-native'
import { SvgXml } from 'react-native-svg'

import styles from '@/components/CallActionButton/Styles'
import { RnText, RnTouchableOpacity } from '@/components/Rn'
import CustomColors from '@/utils/CustomColors'

const CallActionButton: FC<{
  disabled?: boolean
  onPress?(): void
  bgcolor?: string
  name?: string
  textcolor?: string
  image: string
  imageStyle?: ImageProps['style']
  hideShadow?: boolean
}> = ({
  disabled,
  onPress,
  bgcolor,
  name,
  textcolor,
  image,
  imageStyle,
  hideShadow,
}) => {
  return (
    <RnTouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.buttonIconBtn,
        { backgroundColor: bgcolor },
        !hideShadow && styles.shadowEffect,
      ]}
    >
      <SvgXml
        width='25'
        height='25'
        xml={image}
        fill={textcolor || CustomColors.DarkBlue}
        fillOpacity={1}
        style={[styles.btnLogo, imageStyle]}
      />
      <RnText
        style={[
          styles.buttonIconName,
          { color: textcolor || CustomColors.DarkBlue },
        ]}
      >
        {name}
      </RnText>
    </RnTouchableOpacity>
  )
}

export default CallActionButton
