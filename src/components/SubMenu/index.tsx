import React, { FC } from 'react'
import { View } from 'react-native'

import { getSubMenus } from '@/components/navigationConfig'
import { RnText, RnTouchableOpacity } from '@/components/Rn'
import styles from '@/components/SubMenu/Styles'

const SubMenu: FC<
  Partial<{
    menu: string
    onBack(): void
    onCreate(): void
    subMenu: string
  }>
> = ({ menu, onBack, onCreate, subMenu }) => {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.navigation}>
          {getSubMenus(menu || '').map(submenu => {
            const { key, navFn, label } = submenu
            const active = key === subMenu
            return (
              <RnTouchableOpacity
                key={key}
                onPress={active ? undefined : navFn}
                style={[styles.button, active && styles.buttonActive]}
              >
                <RnText
                  small
                  style={[styles.label, active && styles.textActive]}
                >
                  {label}
                </RnText>
              </RnTouchableOpacity>
            )
          })}
        </View>
      </View>
    </>
  )
}

export default SubMenu
