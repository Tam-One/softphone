import React, { FC, useEffect, useState } from 'react'
import {
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from 'react-native'
import { SvgXml } from 'react-native-svg'

import styles from '@/components/CallButtons/Styles'
import { RnText } from '@/components/Rn'

const CallButtons: FC<{
  onPress(): void
  image?: ImageSourcePropType
  icon?: string
  lable?: string
  showAnimation?: boolean
  containerStyle?: object
  imageStyle?: object
}> = ({
  onPress,
  image,
  lable,
  showAnimation,
  containerStyle,
  imageStyle,
  icon,
}) => {
  const [animationTrigger, setAnimationTrigger] = useState(showAnimation)
  const animationTime = 1000

  useEffect(() => {
    let timer: any = null
    if (showAnimation) {
      timer = setInterval(() => {
        setAnimationTrigger(prevAnimationTrigger => !prevAnimationTrigger)
      }, animationTime)
    }
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <View style={[styles.actionBtnContainer, containerStyle && containerStyle]}>
      <TouchableOpacity
        onPress={onPress}
        style={animationTrigger && styles.animationContainer}
      >
        {image ? (
          <Image
            source={image}
            style={[
              styles.actionBtn,
              imageStyle && imageStyle,
              animationTrigger && styles.animationImage,
            ]}
          ></Image>
        ) : (
          <></>
        )}
        {icon ? <SvgXml width='55' height='55' xml={icon} /> : <></>}
      </TouchableOpacity>
      <RnText style={styles.actionBtnText}>{lable}</RnText>
    </View>
  )
}

export default CallButtons
