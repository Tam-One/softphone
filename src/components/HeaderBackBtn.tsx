import { mdiChevronLeft } from '@mdi/js'
import React, { FC } from 'react'
import { Animated, StyleSheet } from 'react-native'

import { useAnimation } from '../utils/animation'
import { RnIcon, RnTouchableOpacity } from './Rn'

const css = StyleSheet.create({
  BackBtn: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'white',
    width: '100%',
    shadowColor: 'lightgrey',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  Inner: {
    width: 50,
    height: 70,
    paddingHorizontal: 0,
    paddingVertical: 20,
    borderRadius: 0,
  },
})

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
    <RnTouchableOpacity onPress={onPress} style={css.BackBtn}>
      <Animated.View style={[css.Inner, cssInnerA]}>
        <RnIcon path={mdiChevronLeft} size={35} />
      </Animated.View>
    </RnTouchableOpacity>
  )
}

export default BackBtn
