import styles from 'components/Header/Styles'
import BackBtn from 'components/HeaderBackBtn/HeaderBackBtn'
import CreateBtn from 'components/HeaderCreateBtn'
import Dropdown, {
  DropdownBtn,
  HeaderDropdownItem,
} from 'components/HeaderDropdown'
import Navigation from 'components/HeaderNavigation'
import Title from 'components/HeaderTitle'
import React, { FC, useState } from 'react'
import { View } from 'react-native'

const Header: FC<
  Partial<{
    compact: boolean
    description: string
    dropdown: HeaderDropdownItem[]
    menu: string
    onBack(): void
    onCreate(): void
    subMenu: string
    title: string
    transparent: boolean
  }>
> = p => {
  const {
    compact,
    description,
    dropdown,
    menu,
    onBack,
    onCreate,
    subMenu,
    title,
    transparent,
  } = p
  const [dropdownActive, setDropdownActive] = useState(false)
  return (
    <>
      <View style={styles.header}>
        <View
          style={[
            styles.outer,
            compact && styles.outerCompact,
            transparent && styles.outerTransparent,
          ]}
        >
          <View style={onBack && styles.innerHasBackBtn}>
            <Title
              compact={compact as boolean}
              description={description}
              title={title as string}
            />
            {onBack && (
              <BackBtn compact={compact as boolean} onPress={onBack} />
            )}
            {dropdown && (
              <DropdownBtn onPress={() => setDropdownActive(true)} />
            )}
          </View>
          {menu && <Navigation menu={menu} subMenu={subMenu as string} />}
        </View>
      </View>
      {dropdown && dropdownActive && (
        <Dropdown
          close={() => setDropdownActive(false)}
          compact={compact as boolean}
          dropdown={dropdown}
        />
      )}
      {
        /* No compact mode, should only use in the noScroll layout (such as the account list page)
       Can not use together with dropdown */
        !dropdown && onCreate && (
          <CreateBtn onPress={onCreate} white={transparent as boolean} />
        )
      }
    </>
  )
}

export default Header
