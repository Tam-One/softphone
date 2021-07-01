import CustomGradient from 'components/CustomGradient'
import styles from 'components/CustomLayout/Styles'
import Footer from 'components/Footer'
import SubMenu from 'components/SubMenu'
import React, { FC } from 'react'
import { View } from 'react-native'

const CustomLayout: FC<
  Partial<{
    menu: string
    noScroll: boolean
    subMenu: string
    hideSubMenu?: boolean
  }>
> = props => {
  const { menu, hideSubMenu } = props
  return (
    <>
      <View style={styles.scroller}>
        <CustomGradient>
          {!hideSubMenu && (
            <>
              <SubMenu {...props} />
              <View style={styles.childStyle} />
            </>
          )}
          {props.children}
        </CustomGradient>
      </View>
      <Footer {...props} menu={menu as string} />
    </>
  )
}

export default CustomLayout
