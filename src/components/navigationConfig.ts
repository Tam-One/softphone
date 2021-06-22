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
          label: intl`RECENTS`,
          navFnKey: 'goToPageCallRecents',
        },
        {
          key: 'missed',
          label: intl`Missed`,
          navFnKey: 'goToPageCallRecents',
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
          label: intl`PHONEBOOK`,
          navFnKey: 'goToPageContactPhonebook',
        },
        {
          key: 'users',
          label: intl`USERS`,
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
          label: intl`CURRENT ACCOUNT`,
          navFnKey: 'goToPageSettingsProfile',
        },
      ],
      defaultSubMenuKey: 'profile',
    },
  ] as Menu[]
  //
  arr.forEach((menu, index) => {
    let { subMenusMap, subMenus, defaultSubMenu, defaultSubMenuKey } = menu
    subMenusMap = arrToMap(
      subMenus,
      (sub: SubMenu) => sub.key,
      (sub: SubMenu) => sub,
    ) as Menu['subMenusMap']
    defaultSubMenu = subMenusMap?.[defaultSubMenuKey]
    subMenus.forEach(sub => {
      let { navFn, ucRequired, navFnKey, key } = sub
      const {
        currentProfile: { ucEnabled },
      } = getAuthStore()
      navFn = () => {
        if (ucRequired && !ucEnabled) {
          defaultSubMenu.navFn()
          return
        }
        Nav()[navFnKey]()
        saveNavigation(index, key)
      }
    })
    menu.navFn = () => {
      const {
        currentProfile: { navSubMenus },
      } = getAuthStore()
      let key = navSubMenus?.[index]
      if (!(key in subMenusMap)) {
        key = defaultSubMenuKey
      }
      subMenusMap[key].navFn()
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

const saveNavigation = (index: number, keyVal: string) => {
  const arr = menus()
  let menu = arr[index]
  const { subMenusMap, defaultSubMenuKey, key } = menu
  const { currentProfile } = getAuthStore()
  let { navIndex, navSubMenus } = currentProfile
  if (!menu || !currentProfile) {
    return
  }
  if (!(keyVal in subMenusMap)) {
    keyVal = defaultSubMenuKey
  }
  normalizeSavedNavigation()
  if (key !== 'settings') {
    navIndex = index
  }
  navSubMenus[index] = keyVal
  profileStore.saveProfilesToLocalStorage()
}

export const normalizeSavedNavigation = () => {
  const arr = menus()
  const { currentProfile } = getAuthStore()
  let { navIndex, navSubMenus } = currentProfile

  if (!arr[navIndex]) {
    navIndex = 0
  }
  if (navSubMenus?.length !== arr.length) {
    navSubMenus = arr.map(() => '')
  }
  arr.forEach((ele, index) => {
    const { subMenusMap, defaultSubMenuKey } = ele
    if (!(navSubMenus[index] in subMenusMap)) {
      navSubMenus[index] = defaultSubMenuKey
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
  const { subMenus } = currentMenu
  const {
    currentProfile: { ucEnabled },
  } = getAuthStore()
  return subMenus.filter(ele => !(ele.ucRequired && !ucEnabled))
}
