import { mdiChevronLeft } from '@mdi/js'
import React, { FC } from 'react'
import { Animated, StyleSheet } from 'react-native'

import styles from '@/components/HeaderBackBtn/Styles'
import { RnIcon, RnTouchableOpacity } from '@/components/Rn'
import { useAnimation } from '@/utils/animation'

const BackBtn: FC<{
  compact: boolean
  onPress(): void
}> = ({ compact, onPress }) => {
  const cssInnerA = useAnimation(compact, {
    height: [70, 40],
    paddingVertical: [20, 5],
  })
  return (
    <RnTouchableOpacity onPress={onPress} style={styles.backBtn}>
      <Animated.View style={[styles.inner, cssInnerA]}>
        <RnIcon path={mdiChevronLeft} size={35} />
      </Animated.View>
    </RnTouchableOpacity>
  )
}

export default BackBtn
