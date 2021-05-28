import Footer from 'components/Footer'
import Header from 'components/Header'
import { HeaderDropdownItem } from 'components/HeaderDropdown'
import styles from 'components/Layout/Styles'
import { observer } from 'mobx-react'
import React, { FC, useState } from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import RnKeyboard from 'stores/RnKeyboard'
import { toLowerCaseFirstChar } from 'utils/string'

const Layout: FC<
  Partial<{
    compact: boolean
    containerOnContentSizeChange: Function
    containerOnScroll: Function
    containerRef: Function
    description: string
    dropdown: HeaderDropdownItem[]
    fabOnBack(): void
    fabOnNext(): void
    fabOnNextText: string
    fabRender(): void
    menu: string
    noScroll: boolean
    onBack(): void
    onCreate(): void
    subMenu: string
    title: string
    transparent: boolean
  }>
> = observer(props => {
  const [headerOverflow, setHeaderOverflow] = useState(false)

  props = { ...props } // Clone so it can be mutated

  const Container = props.noScroll ? View : ScrollView
  const containerProps = Object.entries(props).reduce((m, [k, v]) => {
    type K = keyof typeof props
    if (k.startsWith('container')) {
      delete props[k as K]
      k = k.replace('container', '')
      k = toLowerCaseFirstChar(k)
      m[k] = v as typeof props[K]
    }
    return m
  }, {} as { [k: string]: unknown })

  Object.assign(containerProps, {
    style: [styles.layout, props.transparent && styles.layoutTransparent],
  })

  if (!props.noScroll) {
    Object.assign(containerProps, {
      contentContainerStyle: [styles.scroller],
      keyboardShouldPersistTaps: 'always',
      onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) =>
        // eslint-disable-next-line no-mixed-operators
        e.nativeEvent.contentOffset.y > 60 !== headerOverflow &&
        setHeaderOverflow(!headerOverflow),
      scrollEventThrottle: 170,
      showsVerticalScrollIndicator: false,
    })
  }

  if (props.compact) {
    // Fix android header transparent box shadow
    props.transparent = false
  }

  // TODO put more document here
  let headerSpace = 86 + 15
  if (props.menu) {
    headerSpace += 35
  }
  if (props.compact) {
    headerSpace -= 46
  }
  // TODO put more document here
  let footerSpace = getBottomSpace()
  if (props.fabRender) {
    footerSpace += 40
  } else if (!RnKeyboard.isKeyboardShowing) {
    if (props.menu) {
      footerSpace += 48
    }
    if (props.fabOnNext) {
      footerSpace += 56
    }
  }

  return (
    <>
      <Container {...containerProps}>
        <View style={{ height: headerSpace }} />
        {props.children}
        <View style={styles.footerSpaceInsideScroller} />
      </Container>
      <View style={{ height: footerSpace }} />
      <Footer {...props} menu={props.menu as string} />
      <Header {...props} compact={props.compact || headerOverflow} />
    </>
  )
})

export default Layout
