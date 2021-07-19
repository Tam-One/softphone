import { mdiAccount, mdiApps, mdiPhone, mdiPhoneOutgoing } from '@mdi/js'
import ShowNumber from 'components/CallDialledNumbers'
import KeyPad from 'components/CallKeyPad'
import UserItem from 'components/ContactUserItem'
import CustomGradient from 'components/CustomGradient'
import CustomHeader from 'components/CustomHeader'
import { RnIcon } from 'components/Rn'
import RnText from 'components/RnText'
import orderBy from 'lodash/orderBy'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import styles from 'pages/PageTransferDial/Styles'
import React from 'react'
import {
  NativeSyntheticEvent,
  ScrollView,
  TextInput,
  TextInputSelectionChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native'
import callStore from 'stores/callStore'
import contactStore from 'stores/contactStore'
import Nav from 'stores/Nav'
import RnKeyboard from 'stores/RnKeyboard'
import CustomColors from 'utils/CustomColors'

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
    // Update text to trigger render
    this.text = this.text.substring(0, min) + val + this.text.substring(max)
    //
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
        {groups.map(group => {
          const { key, contacts } = group
          return (
            <React.Fragment key={key}>
              <View style={styles.transferSeparator}>
                <RnText style={styles.transferSeparatorText}>{key}</RnText>
              </View>
              <View>
                {contacts.map((contact, index) => {
                  const { number, name } = contact
                  return (
                    <UserItem
                      showNewAvatar={true}
                      iconFuncs={[
                        () => transferAttended(number, name),
                        () => transferBlind(number),
                      ]}
                      icons={[mdiPhoneOutgoing, mdiPhone]}
                      key={index}
                      {...contact}
                      number={number}
                      containerStyle={{
                        borderBottomWidth:
                          index === contacts.length - 1 ? 0 : 1,
                      }}
                    />
                  )
                })}
              </View>
            </React.Fragment>
          )
        })}
      </ScrollView>
    )
  }

  keysComponent = (transferAttended, transferBlind) => {
    const onTransferPress = () => {
      if (!this.text) {
        return
      }
      transferAttended(this.text, '')
    }
    const onTransferBlindPress = () => {
      if (!this.text) {
        return
      }
      transferBlind(this.text)
    }
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewContainer}
      >
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
              conference={onTransferPress}
              callVoice={onTransferBlindPress}
              onPressNumber={this.onNumberPress}
              showKeyboard={this.showKeyboard}
              fromTransfer={true}
            />
          )}
        </View>
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
          description={'Select target to start transfer'}
          title={'Transfer'}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={[
              { height: 48, flex: 0.5 },
              selectedTab === 'contact' && {
                borderBottomColor: CustomColors.DodgerBlue,
                borderBottomWidth: 2,
              },
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
              { height: 48, flex: 0.5 },
              selectedTab === 'keys' && {
                borderBottomColor: CustomColors.DodgerBlue,
                borderBottomWidth: 2,
              },
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
