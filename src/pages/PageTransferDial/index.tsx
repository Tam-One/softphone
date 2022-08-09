import { mdiAccount, mdiApps } from '@mdi/js'
import orderBy from 'lodash/orderBy'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import {
  FlatList,
  NativeSyntheticEvent,
  ScrollView,
  TextInput,
  TextInputSelectionChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native'

import ShowNumber from '@/components/CallDialledNumbers'
import KeyPad from '@/components/CallKeyPad'
import UserItem from '@/components/ContactUserItem'
import CustomGradient from '@/components/CustomGradient'
import CustomHeader from '@/components/CustomHeader'
import PoweredBy from '@/components/PoweredBy'
import { RnIcon } from '@/components/Rn'
import RnText from '@/components/RnText'
import styles from '@/pages/PageTransferDial/Styles'
import { getAuthStore } from '@/stores/authStore'
import callStore from '@/stores/callStore'
import contactStore from '@/stores/contactStore'
import { intlDebug } from '@/stores/intl'
import Nav from '@/stores/Nav'
import RnAlert from '@/stores/RnAlert'
import RnKeyboard from '@/stores/RnKeyboard'
import CustomColors from '@/utils/CustomColors'
import { TransferCallIcon } from '@/utils/SvgComponent'

@observer
class PageTransferDial extends React.Component {
  prevId?: string
  @observable text = ''

  constructor(props: any) {
    super(props)
    this.state = {
      selectedTab: 'contact',
    }
  }

  textRef = React.createRef<TextInput>()
  textSelection = { start: 0, end: 0 }

  showKeyboard = () => {
    const {
      current: { focus },
    }: any = this.textRef

    if (focus) {
      focus()
    }
  }

  onSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => {
    if (RnKeyboard.isKeyboardShowing) {
      return
    }
    const {
      nativeEvent: {
        selection: { start, end },
      },
    } = event

    Object.assign(this.textSelection, {
      start: start,
      end: end,
    })
  }

  onNumberPress = val => {
    const { end, start } = this.textSelection
    let min = Math.min(start, end)
    let max = Math.max(start, end)
    const isDelete = val === ''
    if (isDelete && start === end && start) {
      min = min - 1
    }
    if (val === '-1') {
      min = 0
      this.text = ''
    } else {
      // Update text to trigger render
      this.text = this.text.substring(0, min) + val + this.text.substring(max)
      //
    }
    const textSelection = min + (isDelete ? 0 : 1)
    this.textSelection.start = textSelection
    this.textSelection.end = textSelection
  }

  componentDidUpdate() {
    const { currentCall = {} }: any = callStore
    const { id } = currentCall
    if (this.prevId && this.prevId !== id) {
      Nav().backToPageCallManage()
    }
    this.prevId = id
  }

  resolveMatch = (id: string, isPhoneBook?: boolean) => {
    const { getPhonebook, getPBXUser, getUCUser } = contactStore
    let match: any = {}
    if (isPhoneBook) {
      match = getPhonebook(id) || {}
    } else {
      match = getPBXUser(id) || {}
    }
    var ucUser = getUCUser(id) || {}
    const { name, talkers } = match
    const { avatar } = ucUser
    return {
      name: name,
      avatar: avatar,
      number: id,
      calling: !!talkers?.filter(t => t.status === 'calling').length,
      ringing: !!talkers?.filter(t => t.status === 'ringing').length,
      talking: !!talkers?.filter(t => t.status === 'talking').length,
      holding: !!talkers?.filter(t => t.status === 'holding').length,
    }
  }

  contactsComponent = (groups, transferAttended, transferBlind) => {
    return (
      <ScrollView>
        <View style={{ paddingBottom: 40 }}>
          {groups.map((group, groupIndex) => {
            const { key, contacts } = group
            return (
              <React.Fragment key={key}>
                <View style={styles.transferSeparator}>
                  <RnText style={styles.transferSeparatorText}>{key}</RnText>
                </View>
                <View>
                  <FlatList
                    data={contacts}
                    scrollEnabled={false}
                    renderItem={({ item, index }) => {
                      const { number, name } = item
                      return (
                        <UserItem
                          showNewAvatar={true}
                          iconFuncs={[() => transferAttended(number, name)]}
                          SvgIcons={[TransferCallIcon]}
                          key={index}
                          {...item}
                          number={number}
                          containerStyle={{
                            borderBottomWidth:
                              index === contacts.length - 1 ? 0 : 1,
                          }}
                        />
                      )
                    }}
                  />
                </View>
              </React.Fragment>
            )
          })}
        </View>
      </ScrollView>
    )
  }

  keysComponent = (transferAttended, transferBlind) => {
    const onTransferPress = () => {
      this.text = this.text.trim()
      if (!this.text) {
        RnAlert.error({
          message: intlDebug`Enter a phone number before you can press transfer conference`,
        })
        return
      }
      const { pbxUsername } = getAuthStore().currentProfile || {}

      if (this.text === pbxUsername) {
        RnAlert.dismiss()
        RnAlert.error({
          message: intlDebug`Self transfer is not allowed`,
        })
        return
      }
      transferAttended(this.text, '')
    }
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewContainer}
      >
        <View style={styles.transferSeparator}>
          <RnText style={styles.transferSeparatorText}></RnText>
        </View>
        <ShowNumber
          refInput={this.textRef}
          selectionChange={this.onSelectionChange}
          setTarget={(val: string) => {
            this.text = val
          }}
          value={this.text}
          customStyle={styles.transferKeysPlaceholder}
        />
        <View style={styles.keyPadContainer}>
          {!RnKeyboard.isKeyboardShowing && (
            <KeyPad
              callVoice={onTransferPress}
              onPressNumber={this.onNumberPress}
              showKeyboard={this.showKeyboard}
              fromTransfer={true}
            />
          )}
        </View>
        <PoweredBy></PoweredBy>
      </ScrollView>
    )
  }

  render() {
    const { pbxUsers, phoneBooks } = contactStore
    const users = pbxUsers
      .map(user => user.id)
      .map(user => this.resolveMatch(user, false))
    const phonbookContacts = phoneBooks
      .map(user => user.id)
      .map(user => this.resolveMatch(user, true))
    type User = typeof users[0]
    const contacts = [...users, ...phonbookContacts]

    const map = {} as { [k: string]: User[] }
    contacts.forEach(user => {
      const { name, number } = user
      user.name = name || number || ''
      let firstChar = user.name.charAt(0).toUpperCase()
      if (!/[A-Z]/.test(firstChar)) {
        firstChar = '#'
      }
      if (!map[firstChar]) {
        map[firstChar] = []
      }
      map[firstChar].push(user)
    })

    let groups = Object.keys(map).map(key => ({
      key: key,
      contacts: map[key],
    }))
    groups = orderBy(groups, 'key')
    groups.forEach(group => {
      let { contacts }: any = group
      contacts = orderBy(contacts, 'name')
    })

    const currentCall: any = callStore.currentCall || {}
    const { transferAttended, transferBlind } = currentCall || {}
    const { selectedTab }: any = this.state
    return (
      <CustomGradient>
        <CustomHeader
          onBack={Nav().backToPageCallManage}
          containerStyle={{ backgroundColor: CustomColors.AppBackground }}
          title={'Transfer'}
        />
        <View style={styles.tabView}>
          <TouchableOpacity
            style={[
              styles.tabContainer,
              selectedTab === 'contact' && styles.activeTab,
            ]}
            onPress={() => this.setState({ selectedTab: 'contact' })}
          >
            <RnIcon
              color={
                selectedTab === 'contact'
                  ? CustomColors.DodgerBlue
                  : CustomColors.DarkAsh
              }
              path={mdiAccount}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabContainer,
              selectedTab === 'keys' && styles.activeTab,
            ]}
            onPress={() => this.setState({ selectedTab: 'keys' })}
          >
            <RnIcon
              color={
                selectedTab === 'keys'
                  ? CustomColors.DodgerBlue
                  : CustomColors.DarkAsh
              }
              path={mdiApps}
              size={30}
            />
          </TouchableOpacity>
        </View>
        {selectedTab === 'contact' &&
          this.contactsComponent(groups, transferAttended, transferBlind)}

        {selectedTab === 'keys' &&
          this.keysComponent(transferAttended, transferBlind)}
      </CustomGradient>
    )
  }
}

export default PageTransferDial
