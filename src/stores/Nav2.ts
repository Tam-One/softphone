import { menus, normalizeSavedNavigation } from 'components/navigationConfig'
import PageBackgroundCalls from 'pages/PageBackgroundCalls'
import PageCallKeypad from 'pages/PageCallKeypad'
import PageCallManage from 'pages/PageCallManage'
import PageCallParks from 'pages/PageCallParks'
import PageCallParks2 from 'pages/PageCallParks2'
import PageCallRecents from 'pages/PageCallRecents'
import MissedCalls from 'pages/PageCallRecents/MissedCalls'
import PageChatDetail from 'pages/PageChatDetail'
import PageChatGroupCreate from 'pages/PageChatGroupCreate'
import PageChatGroupDetail from 'pages/PageChatGroupDetail'
import PageChatGroupInvite from 'pages/PageChatGroupInvite'
import PageChatRecents from 'pages/PageChatRecents'
import PageContactPhonebook from 'pages/PageContactPhonebook'
import PageContactUsers from 'pages/PageContactUsers'
import PageDtmfKeypad from 'pages/PageDtmfKeypad'
import PagePhonebookCreate from 'pages/PagePhonebookCreate'
import PagePhonebookUpdate from 'pages/PagePhonebookUpdate'
import PageProfileCreate from 'pages/PageProfileCreate'
import PageProfileSignIn from 'pages/PageProfileSingIn'
import EditAccount from 'pages/PageProfileSingIn/EditAccount'
import PageProfileUpdate from 'pages/PageProfileUpdate'
import PageSettingsDebug from 'pages/PageSettingDebug'
import PageSettingsOther from 'pages/PageSettingsOther'
import PageSettingsProfile from 'pages/PageSettingsProfile'
import PageTransferDial from 'pages/PageTransferDial'
import PageViewContact from 'pages/PageViewContact'
import { getAuthStore } from 'stores/authStore'
import { setNav } from 'stores/Nav'
import RnStacker from 'stores/RnStacker'

const go = RnStacker.createGoTo
const back = RnStacker.createBackTo

export class Nav {
  goToPageProfileSignIn = go({ PageProfileSignIn }, true)
  backToPageProfileSignIn = back({ PageProfileSignIn }, true)
  goToPageViewContact = go({ PageViewContact }, true)
  backToPageViewContact = back({ PageViewContact }, true)
  goToEditAccount = go({ EditAccount }, true)
  backToEditAccount = back({ EditAccount }, true)
  goToPageChatRecents = go({ PageChatRecents }, true)
  backToPageChatRecents = back({ PageChatRecents }, true)
  goToPageContactPhonebook = go({ PageContactPhonebook }, true)
  backToPageContactPhonebook = back({ PageContactPhonebook }, true)
  goToPageContactUsers = go({ PageContactUsers }, true)
  backToPageContactUsers = back({ PageContactUsers }, true)
  goToPageCallKeypad = go({ PageCallKeypad }, true)
  backToPageCallKeypad = back({ PageCallKeypad }, true)
  goToPageCallRecents = go({ PageCallRecents }, true)
  backToPageCallRecents = back({ PageCallRecents }, true)
  goToMissedCalls = go({ MissedCalls }, true)
  backToMissedCalls = back({ MissedCalls }, true)
  goToPageSettingsOther = go({ PageSettingsOther }, true)
  backToPageSettingsOther = back({ PageSettingsOther }, true)
  goToPageCallParks = go({ PageCallParks }, true)
  backToPageCallParks = back({ PageCallParks }, true)
  goToPageSettingsProfile = go({ PageSettingsProfile }, true)
  backToPageSettingsProfile = back({ PageSettingsProfile }, true)

  goToPageProfileCreate = go({ PageProfileCreate })
  backToPageProfileCreate = back({ PageProfileCreate })
  goToPageProfileUpdate = go({ PageProfileUpdate })
  backToPageProfileUpdate = back({ PageProfileUpdate })
  goToPagePhonebookCreate = go({ PagePhonebookCreate })
  backToPagePhonebookCreate = back({ PagePhonebookCreate })
  goToPagePhonebookUpdate = go({ PagePhonebookUpdate })
  backToPagePhonebookUpdate = back({ PagePhonebookUpdate })
  goToPageCallManage = go({ PageCallManage })
  backToPageCallManage = back({ PageCallManage })
  goToPageBackgroundCalls = go({ PageBackgroundCalls })
  backToPageBackgroundCalls = back({ PageBackgroundCalls })
  goToPageTransferDial = go({ PageTransferDial })
  backToPageTransferDial = back({ PageTransferDial })
  goToPageDtmfKeypad = go({ PageDtmfKeypad })
  backToPageDtmfKeypad = back({ PageDtmfKeypad })
  goToPageChatDetail = go({ PageChatDetail })
  backToPageChatDetail = back({ PageChatDetail })
  goToPageChatGroupCreate = go({ PageChatGroupCreate })
  backToPageChatGroupCreate = back({ PageChatGroupCreate })
  goToPageChatGroupInvite = go({ PageChatGroupInvite })
  backToPageChatGroupInvite = back({ PageChatGroupInvite })
  goToPageChatGroupDetail = go({ PageChatGroupDetail })
  backToPageChatGroupDetail = back({ PageChatGroupDetail })
  goToPageSettingsDebug = go({ PageSettingsDebug })
  backToPageSettingsDebug = back({ PageSettingsDebug })
  goToPageCallParks2 = go({ PageCallParks2 })
  backToPageCallParks2 = back({ PageCallParks2 })

  goToPageIndex = () => {
    if (!getAuthStore().currentProfile) {
      this.goToPageProfileSignIn()
      return
    }
    const arr = menus()
    normalizeSavedNavigation()
    const p = getAuthStore().currentProfile
    // const i = p.navIndex
    // const k = p.navSubMenus?.[i]
    const i = 0
    const k = 'keypad'
    arr[i].subMenusMap[k].navFn()
  }
}

setNav(new Nav())
