import { mdiChevronLeft } from '@mdi/js'
import styles from 'components/HeaderBackBtn/Styles'
import { RnIcon, RnTouchableOpacity } from 'components/Rn'
import React, { FC } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { useAnimation } from 'utils/animation'

const BackBtn: FC<{
  compact: boolean
  onPress(): void
}> = p => {
  const { compact, onPress } = p
  const cssInnerA = useAnimation(compact, {
    height: [70, 40],
    paddingVertical: [20, 5],
  })
  return (
    <RnTouchableOpacity onPress={onPress} style={styles.BackBtn}>
      <Animated.View style={[styles.Inner, cssInnerA]}>
        <RnIcon path={mdiChevronLeft} size={35} />
      </Animated.View>
    </RnTouchableOpacity>
  )
}

export default BackBtn
