import { mdiBriefcase, mdiCellphone, mdiHome, mdiMagnify } from '@mdi/js'
import pbx from 'api/pbx'
import UserItem from 'components/ContactUserItem'
import CustomLayout from 'components/CustomLayout'
import { RnIcon, RnText, RnTouchableOpacity } from 'components/Rn'
import RnTextInput from 'components/RnTextInput'
import orderBy from 'lodash/orderBy'
import { observer } from 'mobx-react'
import styles from 'pages/PageContactPhonebook/Styles'
import React from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { getAuthStore } from 'stores/authStore'
import callStore from 'stores/callStore'
import contactStore, { Phonebook2 } from 'stores/contactStore'
import intl, { intlDebug } from 'stores/intl'
import Nav from 'stores/Nav'
import RnAlert from 'stores/RnAlert'
import RnPicker from 'stores/RnPicker'
import { BackgroundTimer } from 'utils/BackgroundTimer'
import CustomColors from 'utils/CustomColors'

@observer
class PageContactPhonebook extends React.Component {
  componentDidMount() {
    const id = BackgroundTimer.setInterval(() => {
      if (!pbx.client) {
        return
      }
      contactStore.loadContactsFirstTime()
      BackgroundTimer.clearInterval(id)
    }, 1000)
  }

  update = (id: string) => {
    const contact = contactStore.getPhonebook(id)
    if (contact?.loaded) {
      Nav().goToPagePhonebookUpdate({
        contact: contact,
      })
    } else {
      this.loadContactDetail(id, (ct: Phonebook2) => {
        Nav().goToPagePhonebookUpdate({
          contact: ct,
        })
      })
    }
  }

  loadContactDetail = (id: string, cb: Function) => {
    pbx
      .getContact(id)
      .then(ct => {
        const x = {
          ...ct,
          loaded: true,
          name: ct.firstName + ' ' + ct.lastName,
          hidden: ct.hidden === 'true',
        }
        contactStore.upsertPhonebook(x)
        cb(x)
      })
      .catch((err: Error) => {
        RnAlert.error({
          message: intlDebug`Failed to load contact detail for ${id}`,
          err,
        })
      })
  }

  callRequest = (number: string, u: Phonebook2) => {
    if (number !== '') {
      callStore.startCall(number.replace(/\s+/g, ''))
    } else {
      this.update(u.id)
      RnAlert.error({
        message: intlDebug`This contact doesn't have any phone number`,
      })
    }
  }

  onIcon0 = (u: Phonebook2) => {
    if (!u) {
      return
    }
    if (u.loaded) {
      this._onIcon0(u)
      return
    }
    this.loadContactDetail(u.id, () => {
      this._onIcon0(u)
    })
  }
  _onIcon0 = (u: Phonebook2) => {
    if (!u) {
      return
    }

    if (!u.homeNumber && !u.workNumber && !u.cellNumber) {
      this.callRequest('', u)
      return
    }

    const numbers: {
      key: string
      value: string
      icon: string
    }[] = []
    if (u.workNumber !== '') {
      numbers.push({
        key: 'workNumber',
        value: u.workNumber,
        icon: mdiBriefcase,
      })
    }
    if (u.cellNumber !== '') {
      numbers.push({
        key: 'cellNumber',
        value: u.cellNumber,
        icon: mdiCellphone,
      })
    }
    if (u.homeNumber !== '') {
      numbers.push({
        key: 'homeNumber',
        value: u.homeNumber,
        icon: mdiHome,
      })
    }

    if (numbers.length === 1) {
      this.callRequest(numbers[0].value, u)
      return
    }
    RnPicker.open({
      options: numbers.map(i => ({
        key: i.value,
        label: i.value,
        icon: i.icon,
      })),
      onSelect: (e: string) => this.callRequest(e, u),
    })
  }

  isMatchUser = user => {
    const { name } = user
    const { contactSearchBook } = contactStore
    return name.toLowerCase().includes(contactSearchBook.toLowerCase())
  }

  render() {
    let phonebooks = contactStore.phoneBooks
    if (!getAuthStore().currentProfile.displaySharedContacts) {
      phonebooks = phonebooks.filter(i => i.shared !== true)
    }
    phonebooks = phonebooks.filter(this.isMatchUser)

    const map = {} as { [k: string]: Phonebook2[] }
    phonebooks.forEach(u => {
      let c0 = u.name.charAt(0).toUpperCase()
      if (!/[A-Z]/.test(c0)) {
        c0 = '#'
      }
      if (!map[c0]) {
        map[c0] = []
      }
      map[c0].push(u)
    })

    let groups = Object.keys(map).map(k => ({
      key: k,
      phonebooks: map[k],
    }))
    groups = orderBy(groups, 'key')
    groups.forEach(g => {
      g.phonebooks = orderBy(g.phonebooks, 'name')
    })
    return (
      <CustomLayout menu='contact' subMenu='phonebook'>
        <ScrollView style={styles.scrollViewContainer}>
          <View style={styles.parkContainer}>
            <View>
              <RnText style={styles.ParksText}>{'Contacts'}</RnText>
              <RnText style={styles.noParksDesc}>
                {'Phonebook externe contacten'}
              </RnText>
            </View>
            <TouchableOpacity style={styles.addButtonContainer}>
              <RnText style={styles.addButton}>+</RnText>
            </TouchableOpacity>
          </View>
          <View style={styles.searchBox}>
            <RnIcon
              path={mdiMagnify}
              pointerEvents='none'
              style={styles.fieldIcon}
              size={10}
              color={CustomColors.DarkAsh}
            />
            <RnTextInput
              disabled
              style={styles.fieldTextInput}
              value={contactStore.contactSearchBook}
              onChangeText={(val: string) => {
                contactStore.contactSearchBook = val
              }}
              placeholder={'Zoeken'}
            />
          </View>
          <View style={styles.listView}>
            {groups.map(group => {
              const { key, phonebooks } = group
              return (
                <React.Fragment key={key}>
                  <View style={styles.transferSeparator}>
                    <RnText style={styles.transferSeparatorText}>{key}</RnText>
                  </View>
                  {phonebooks.map((user, index) => {
                    const { name } = user
                    return (
                      <UserItem
                        showNewAvatar={true}
                        icons={[]}
                        key={index}
                        name={name}
                        containerStyle={styles.userItem}
                      />
                    )
                  })}
                </React.Fragment>
              )
            })}
          </View>
          {contactStore.loading ? (
            <RnText
              style={styles.loading}
              warning
              small
              normal
              center
            >{intl`Loading...`}</RnText>
          ) : contactStore.hasLoadmore ? (
            <RnTouchableOpacity onPress={contactStore.loadMoreContacts}>
              <RnText
                style={styles.loading}
                primary
                small
                normal
                center
              >{intl`Load more contacts`}</RnText>
            </RnTouchableOpacity>
          ) : null}
        </ScrollView>
      </CustomLayout>
    )
  }
}

export default PageContactPhonebook
