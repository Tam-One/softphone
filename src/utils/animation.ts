import { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'

import { mapToMap } from './toMap'

export const animationOption = {
  duration: 200,
}

type AnimationProps = {
  [k: string]: any // []
}

export function useAnimation<T extends AnimationProps>(
  enabled: boolean,
  props: T,
  options?: Animated.TimingAnimationConfig,
  callback?: () => void,
) {
  const r = useRef<Animated.Value>()
  if (!r.current) {
    r.current = new Animated.Value(0)
  }
  const v = r.current
  useEffect(() => {
    const t = Animated.timing(v, {
      ...animationOption,
      ...options,
      toValue: enabled && !callback ? 1 : 0,
      useNativeDriver: false,
    })
    t.start(e => {
      if (e.finished && callback) {
        callback()
      }
    })
    return () => t.stop()
  }, [enabled, options, v, callback])

  return mapToMap(props, undefined, (k: string) =>
    v.interpolate({
      inputRange: [0, 1],
      outputRange: props[k],
    }),
  ) as {
    [k in keyof T]: T[k][0]
  }
}

export const useAnimationOnDidMount = <T extends AnimationProps>(
  props: T,
  callback?,
) => {
  const [didMount, setDidMount] = useState(false)
  useEffect(() => setDidMount(true), [])
  return useAnimation(didMount, props, undefined, callback)
}
