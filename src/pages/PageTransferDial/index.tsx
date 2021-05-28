import { mdiPhone, mdiPhoneOutgoing } from '@mdi/js'
import UserItem from 'components/ContactUserItem'
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
import CustomColors from 'utils/CustomColors'

@observer
class PageTransferDial extends React.Component {
  prevId?: string
  componentDidMount() {
    this.componentDidUpdate()
  }
  componentDidUpdate() {
    if (this.prevId && this.prevId !== callStore.currentCall?.id) {
      Nav().backToPageCallManage()
    }
    this.prevId = callStore.currentCall?.id
  }

  resolveMatch = (id: string, isPhoneBook?: boolean) => {
    let match: any = {}
    if (isPhoneBook) {
      match = contactStore.getPhonebook(id) || {}
    } else {
      match = contactStore.getPBXUser(id) || {}
    }
    var ucUser = contactStore.getUCUser(id) || {}

    return {
      name: match.name,
      avatar: ucUser.avatar,
      number: id,
      calling: !!match.talkers?.filter(t => t.status === 'calling').length,
      ringing: !!match.talkers?.filter(t => t.status === 'ringing').length,
      talking: !!match.talkers?.filter(t => t.status === 'talking').length,
      holding: !!match.talkers?.filter(t => t.status === 'holding').length,
    }
  }

  render() {
    const users = contactStore.pbxUsers
      .map(u => u.id)
      .map(u => this.resolveMatch(u, false))
    const phonbookContacts = contactStore.phoneBooks
      .map(u => u.id)
      .map(u => this.resolveMatch(u, true))
    type User = typeof users[0]
    const contacts = [...users, ...phonbookContacts]

    const map = {} as { [k: string]: User[] }
    contacts.forEach(u => {
      u.name = u.name || u.number || ''
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
      contacts: map[k],
    }))
    groups = orderBy(groups, 'key')
    groups.forEach(g => {
      g.contacts = orderBy(g.contacts, 'name')
    })

    return (
      <View style={{ backgroundColor: CustomColors.AliceBlue, flex: 1 }}>
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
                {contacts.map((contact, index) => {
                  const { number, name } = contact
                  return (
                    <UserItem
                      showNewAvatar={true}
                      iconFuncs={[
                        () =>
                          callStore.currentCall?.transferAttended(number, name),
                        () => callStore.currentCall?.transferBlind(number),
                      ]}
                      icons={[mdiPhoneOutgoing, mdiPhone]}
                      key={index}
                      {...contact}
                      number={number}
                    />
                  )
                })}
              </React.Fragment>
            )
          })}
        </ScrollView>
      </View>
    )
  }
}

export default PageTransferDial
