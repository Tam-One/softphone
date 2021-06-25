import styles from 'components/HeaderNavigation/Styles'
import { getSubMenus } from 'components/navigationConfig'
import { RnText, RnTouchableOpacity } from 'components/Rn'
import React, { FC } from 'react'
import { View } from 'react-native'
import chatStore from 'stores/chatStore'

const Navigation: FC<{
  menu: string
  subMenu: string
}> = ({ menu, subMenu }) => {
  return (
    <View style={styles.navigation}>
      {getSubMenus(menu).map(submenu => {
        const { key, navFn, label } = submenu
        const active = key === subMenu
        const { unreadCount } = chatStore
        return (
          <RnTouchableOpacity
            key={key}
            onPress={active ? undefined : navFn}
            style={[styles.button, active && styles.buttonActive]}
          >
            <RnText small style={active && styles.textActive}>
              {label}
            </RnText>
            {key === 'chat' && !!unreadCount && (
              <View style={styles.unreadOuter}>
                <View style={[styles.unread]}>
                  <RnText style={styles.unreadText} bold white center>
                    {unreadCount}
                  </RnText>
                </View>
              </View>
            )}
          </RnTouchableOpacity>
        )
      })}
    </View>
  )
}

export default Navigation
