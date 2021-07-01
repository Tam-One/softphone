import svgImages from 'assets/svgImages'
import { getAuthStore } from 'stores/authStore'
import intl from 'stores/intl'
import intlStore from 'stores/intlStore'
import Nav from 'stores/Nav'
import profileStore from 'stores/profileStore'
import RnAlert from 'stores/RnAlert'
import { arrToMap } from 'utils/toMap'

interface Menu {
  key: string
  label: string
  icon: string
  subMenus: SubMenu[]
  defaultSubMenuKey: string
  defaultSubMenu: SubMenu
  subMenusMap: { [key: string]: SubMenu }
  navFn(): void
}
interface SubMenu {
  key: string
  label: string
  navFnKey: keyof ReturnType<typeof Nav>
  ucRequired?: boolean
  navFn(): void
}

const genMenus = () => {
  const arr = [
    {
      key: 'keys',
      label: 'Keys',
      icon: svgImages.dialpad,
      subMenus: [
        {
          key: 'keypad',
          label: intl`Keys`,
          navFnKey: 'goToPageCallKeypad',
        },
        {
          key: 'parks',
          label: intl`Parks`,
          navFnKey: 'goToPageCallParks',
        },
      ],
      defaultSubMenuKey: 'keypad',
    },
    {
      key: 'call',
      label: 'Calls',
      icon: svgImages.history,
      subMenus: [
        {
          key: 'recents',
          label: intl`Recents`,
          navFnKey: 'goToPageCallRecents',
        },
        {
          key: 'missed',
          label: intl`Missed`,
          navFnKey: 'goToMissedCalls',
        },
      ],
      defaultSubMenuKey: 'recents',
    },
    {
      key: 'contact',
      label: 'Q-Book',
      icon: svgImages.person,
      subMenus: [
        {
          key: 'phonebook',
          label: intl`Phonebook`,
          navFnKey: 'goToPageContactPhonebook',
        },
        {
          key: 'users',
          label: intl`Users`,
          navFnKey: 'goToPageContactUsers',
        },
      ],
      defaultSubMenuKey: 'users',
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: svgImages.cog,
      subMenus: [
        {
          key: 'profile',
          label: intl`Settings`,
          navFnKey: 'goToPageSettingsProfile',
        },
      ],
      defaultSubMenuKey: 'profile',
    },
  ] as Menu[]
  //
  arr.forEach((menu, index) => {
    menu.subMenusMap = arrToMap(
      menu.subMenus,
      (sub: SubMenu) => sub.key,
      (sub: SubMenu) => sub,
    ) as Menu['subMenusMap']
    menu.defaultSubMenu = menu.subMenusMap?.[menu.defaultSubMenuKey]
    menu.subMenus.forEach(ele => {
      ele.navFn = () => {
        if (ele.ucRequired && !getAuthStore().currentProfile.ucEnabled) {
          menu.defaultSubMenu.navFn()
          return
        }
        Nav()[ele.navFnKey]()
        saveNavigation(index, ele.key)
      }
    })
    menu.navFn = () => {
      let key = getAuthStore().currentProfile.navSubMenus?.[index]
      if (!(key in menu.subMenusMap)) {
        key = menu.defaultSubMenuKey
      }
      menu.subMenusMap[key].navFn()
    }
  })
  return arr
}

let lastLocale = intlStore.locale
let lastMenus = genMenus()
export const menus = () => {
  if (lastLocale !== intlStore.locale) {
    lastLocale = intlStore.locale
    lastMenus = genMenus()
  }
  return lastMenus
}

const saveNavigation = (index: number, key: string) => {
  const arr = menus()
  const menu = arr[index]
  const profile = getAuthStore().currentProfile
  if (!menu || !profile) {
    return
  }
  if (!(key in menu.subMenusMap)) {
    key = menu.defaultSubMenuKey
  }
  normalizeSavedNavigation()
  if (menu.key !== 'settings') {
    profile.navIndex = index
  }
  profile.navSubMenus[index] = key
  profileStore.saveProfilesToLocalStorage()
}
export const normalizeSavedNavigation = () => {
  const arr = menus()
  const profile = getAuthStore().currentProfile
  if (!arr[profile.navIndex]) {
    profile.navIndex = 0
  }
  if (profile.navSubMenus?.length !== arr.length) {
    profile.navSubMenus = arr.map(() => '')
  }
  arr.forEach((menu, index) => {
    if (!(profile.navSubMenus[index] in menu.subMenusMap)) {
      profile.navSubMenus[index] = menu.defaultSubMenuKey
    }
  })
}

export const getSubMenus = (menu: string) => {
  const arr = menus()
  const currentMenu = arr.find(ele => ele.key === menu)
  if (!currentMenu) {
    RnAlert.error({
      unexpectedErr: new Error(`Can not find sub menus for ${menu}`),
    })
    return []
  }
  return currentMenu.subMenus.filter(
    ele => !(ele.ucRequired && !getAuthStore().currentProfile.ucEnabled),
  )
}
