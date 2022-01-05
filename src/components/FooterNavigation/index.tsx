import { mdiAccountCircleOutline } from '@mdi/js'
import { observer } from 'mobx-react'
import React, { FC } from 'react'
import { View } from 'react-native'
import { SvgXml } from 'react-native-svg'

import styles from '@/components/FooterNavigation/Styles'
import { menus } from '@/components/navigationConfig'
import { RnIcon, RnText, RnTouchableOpacity } from '@/components/Rn'
import CustomColors from '@/utils/CustomColors'
import CustomStrings from '@/utils/CustomStrings'

const Navigation: FC<{
  menu: string
}> = ({ menu }) => (
  <View style={styles.navigation}>
    {menus().map(ele => {
      const { key, label, navFn, icon } = ele
      const active = key === menu
      const color = active ? CustomColors.ActiveBlue : CustomColors.LightAsh
      return (
        <RnTouchableOpacity
          key={key}
          onPress={active ? undefined : navFn}
          style={styles.button}
        >
          <View style={styles.buttonBackground}>
            {key === CustomStrings.Contact ? (
              <View style={{ height: 23, width: 23 }}>
                <RnIcon
                  path={mdiAccountCircleOutline}
                  color={color}
                  size={20}
                />
              </View>
            ) : (
              // <SvgXml width='20' height='20' xml={icon} fill={color} />
              <></>
            )}
            <RnText style={{ color: color }}>{label}</RnText>
          </View>
        </RnTouchableOpacity>
      )
    })}
  </View>
)

export default observer(Navigation)
