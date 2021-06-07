import { mdiPhone, mdiPhoneOutgoing } from '@mdi/js'
import UserItem from 'components/ContactUserItem'
import CustomGradient from 'components/CustomGradient'
import CustomHeader from 'components/CustomHeader'
import RnText from 'components/RnText'
import orderBy from 'lodash/orderBy'
import { observer } from 'mobx-react'
import styles from 'pages/PageTransferDial/Styles'
import React from 'react'
import { ScrollView, View } from 'react-native'
import callStore from 'stores/callStore'
import contactStore from 'stores/contactStore'
import Nav from 'stores/Nav'

@observer
class PageTransferDial extends React.Component {
  prevId?: string

  componentDidMount() {
    this.componentDidUpdate()
  }

  componentDidUpdate() {
    const { currentCall }: any = callStore || {}
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
      let { name, number } = user
      name = name || number || ''
      let firstChar = name.charAt(0).toUpperCase()
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

    const { currentCall }: any = callStore || {}
    const { transferAttended, transferBlind } = currentCall || {}

    return (
      <CustomGradient>
        <CustomHeader
          onBack={Nav().backToPageCallManage}
          description={'Select target to start transfer'}
          title={'Transfer'}
        />
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
      </CustomGradient>
    )
  }
}

export default PageTransferDial
