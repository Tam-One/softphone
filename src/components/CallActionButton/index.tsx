import React, { FC } from 'react'
import { Image, ImageProps, ImageSourcePropType, View } from 'react-native'

//import { SvgXml } from 'react-native-svg'
import styles from '@/components/CallActionButton/Styles'
import { RnText, RnTouchableOpacity } from '@/components/Rn'
import CustomColors from '@/utils/CustomColors'

const CallActionButton: FC<{
  disabled?: boolean
  onPress?(): void
  bgcolor?: string
  name?: string
  textcolor?: string
  Icon: any
  imageStyle?: any
  hideShadow?: boolean
}> = ({
  disabled,
  onPress,
  bgcolor,
  name,
  textcolor,
  Icon,
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
        disabled && { backgroundColor: '#e5e5e5' },
      ]}
    >
      <Icon
        fill={textcolor || CustomColors.DarkBlue}
        fillOpacity={1}
        style={{ ...styles.btnLogo, ...imageStyle }}
      ></Icon>

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
