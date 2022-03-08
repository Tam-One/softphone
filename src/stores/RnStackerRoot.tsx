import { observer } from 'mobx-react'
import { ReactComponentLike } from 'prop-types'
import React, { FC } from 'react'
import { Animated, Dimensions, Platform, StyleSheet, View } from 'react-native'

import CustomValues from '@/utils/CustomValues'

import g from '../components/variables'
import { useAnimationOnDidMount } from '../utils/animation'
import RnStacker from './RnStacker'

const css = StyleSheet.create({
  Stack: {
    backgroundColor: g.bg,
  },
  Stack__hidden: {
    opacity: 0,
  },
})

var stacksCopy

const Stack: FC<{
  Component: ReactComponentLike
  isRoot?: boolean
  isBackgroundStack: boolean
  fromBack?: boolean
}> = ({ Component, ...p }) => {
  const anim = useAnimationOnDidMount(
    {
      translateX: p.fromBack
        ? [CustomValues.animationExitWidth, 0]
        : [CustomValues.animationWidth, 0],
    },
    p.fromBack
      ? () => {
          stacksCopy.pop()
          RnStacker.stacks = [...stacksCopy]
        }
      : undefined,
  )
  const OuterComponent = p.isRoot ? View : Animated.View
  return (
    <OuterComponent
      style={[
        StyleSheet.absoluteFill,
        css.Stack,
        p.isBackgroundStack && css.Stack__hidden,
        !p.isRoot && { transform: [anim] },
      ]}
    >
      <Component {...p} />
    </OuterComponent>
  )
}

const RnStackerRoot = observer(() => {
  const rn = [...RnStacker.stacks]

  if (
    !stacksCopy ||
    (stacksCopy.length <= rn.length &&
      rn[rn.length - 1] !== stacksCopy[stacksCopy.length - 1])
  ) {
    stacksCopy = rn
  }

  const stackArr = stacksCopy

  return (
    <>
      {stackArr.map((s, i) => {
        let stack = { ...s }
        if (
          stacksCopy.length > RnStacker.stacks.length &&
          i === stacksCopy.length - 1
        ) {
          stack.fromBack = true
        }
        return (
          <Stack
            isBackgroundStack={
              !(i + 1 === stackArr.length) &&
              !(i + 2 === stackArr.length && RnStacker.stackAnimating) &&
              !(
                stacksCopy.length > RnStacker.stacks.length &&
                i === stacksCopy.length - 2
              )
            }
            key={i}
            {...stack}
          />
        )
      })}
    </>
  )
})

export default RnStackerRoot
