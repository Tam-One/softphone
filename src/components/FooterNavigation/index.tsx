import styles from 'components/FooterNavigation/Styles'
import { menus } from 'components/navigationConfig'
import { RnText, RnTouchableOpacity } from 'components/Rn'
import { observer } from 'mobx-react'
import React, { FC } from 'react'
import { View } from 'react-native'
import { SvgXml } from 'react-native-svg'
import CustomColors from 'utils/CustomColors'

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
            <SvgXml
              width='20'
              height='20'
              xml={icon}
              fill={color}
              fillOpacity={1}
            />
            <RnText style={{ color: color }}>{label}</RnText>
          </View>
        </RnTouchableOpacity>
      )
    })}
  </View>
)

export default observer(Navigation)
