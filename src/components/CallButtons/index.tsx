import React, { FC, useEffect, useState } from 'react'
import {
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from 'react-native'

import styles from '@/components/CallButtons/Styles'
import { RnText } from '@/components/Rn'
import CustomValues from '@/utils/CustomValues'

const CallButtons: FC<{
  onPress(): void
  image?: ImageSourcePropType
  Icon?: any
  lable?: string
  showAnimation?: boolean
  containerStyle?: object
  imageStyle?: any
  width?: number
  height?: number
}> = ({
  onPress,
  image,
  lable,
  showAnimation,
  containerStyle,
  imageStyle,
  Icon,
  width,
  height,
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
        {Icon ? (
          <View
            style={[
              { marginBottom: 10 },
              animationTrigger && styles.animationImage,
            ]}
          >
            <Icon
              width={width || CustomValues.callButtons}
              height={height || CustomValues.callButtons}
            ></Icon>
          </View>
        ) : (
          <></>
        )}
      </TouchableOpacity>
      <RnText style={styles.actionBtnText}>{lable}</RnText>
    </View>
  )
}

export default CallButtons
