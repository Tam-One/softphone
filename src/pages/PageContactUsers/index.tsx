import { mdiMagnify, mdiPhone } from '@mdi/js'
import UserItem from 'components/ContactUserItem'
import CustomLayout from 'components/CustomLayout'
import { RnIcon } from 'components/Rn'
import RnText from 'components/RnText'
import RnTextInput from 'components/RnTextInput'
import orderBy from 'lodash/orderBy'
import uniq from 'lodash/uniq'
import { observer } from 'mobx-react'
import styles from 'pages/PageContactUsers/Styles'
import React from 'react'
import { FlatList, ScrollView, View } from 'react-native'
import { getAuthStore } from 'stores/authStore'
import callStore from 'stores/callStore'
import chatStore, { ChatMessage } from 'stores/chatStore'
import contactStore from 'stores/contactStore'
import CustomColors from 'utils/CustomColors'
import DelayFlag from 'utils/DelayFlag'
import { filterTextOnly } from 'utils/formatChatContent'

@observer
class PageContactUsers extends React.Component {
  displayOfflineUsers = new DelayFlag()

  componentDidMount() {
    this.componentDidUpdate()
  }
  componentDidUpdate() {
    if (
      this.displayOfflineUsers.enabled !==
      getAuthStore().currentProfile.displayOfflineUsers
    ) {
      this.displayOfflineUsers.setEnabled(
        getAuthStore().currentProfile.displayOfflineUsers,
      )
    }
  }

  getMatchUserIds() {
    const userIds = uniq([
      ...contactStore.pbxUsers.map(u => u.id),
      ...contactStore.ucUsers.map(u => u.id),
    ])
    return userIds.filter(this.isMatchUser)
  }
  resolveUser = (id: string) => {
    const pbxUser = contactStore.getPBXUser(id) || {}
    const ucUser = contactStore.getUCUser(id) || {}
    const u = {
      ...pbxUser,
      ...ucUser,
    }
    return u
  }
  isMatchUser = (id: string) => {
    if (!id) {
      return false
    }
    let userId = id
    let pbxUserName: string
    const pbxUser = contactStore.getPBXUser(id)
    if (pbxUser) {
      pbxUserName = pbxUser.name
    } else {
      pbxUserName = ''
    }
    let ucUserName: string
    const ucUser = contactStore.getUCUser(id)
    if (ucUser) {
      ucUserName = ucUser.name
    } else {
      ucUserName = ''
    }
    //
    userId = userId.toLowerCase()
    pbxUserName = pbxUserName.toLowerCase()
    ucUserName = ucUserName.toLowerCase()
    const txt = contactStore.usersSearchTerm.toLowerCase()
    return (
      userId.includes(txt) ||
      pbxUserName.includes(txt) ||
      ucUserName.includes(txt)
    )
  }

  getLastMessageChat = (id: string) => {
    const chats = filterTextOnly(chatStore.messagesByThreadId[id])
    return chats.length !== 0 ? chats[chats.length - 1] : ({} as ChatMessage)
  }

  render() {
    const allUsers = this.getMatchUserIds().map(this.resolveUser)
    const onlineUsers = allUsers.filter(i => i.status && i.status !== 'offline')
    type User = typeof allUsers[0]

    const { ucEnabled } = getAuthStore().currentProfile
    const displayUsers =
      !this.displayOfflineUsers.enabled && ucEnabled ? onlineUsers : allUsers

    const map = {} as { [k: string]: User[] }
    displayUsers.forEach(u => {
      u.name = u.name || u.id || ''
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
      users: map[k],
    }))
    groups = orderBy(groups, 'key')
    groups.forEach(g => {
      g.users = orderBy(g.users, 'name')
    })

    return (
      <CustomLayout menu='contact' subMenu='users'>
        <ScrollView style={styles.scrollViewContainer}>
          <View style={styles.parkContainer}>
            <View>
              <RnText style={styles.ParksText}>{'Contacten'}</RnText>
              <RnText style={styles.noParksDesc}>{'Interne contacten'}</RnText>
            </View>
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
              value={contactStore.usersSearchTerm}
              onChangeText={(val: string) => {
                contactStore.usersSearchTerm = val
              }}
              placeholder={'Zoeken'}
            />
          </View>
          <View style={styles.listView}>
            {groups.map(group => {
              const { key, users } = group
              return (
                <React.Fragment key={key}>
                  <View style={styles.transferSeparator}>
                    <RnText style={styles.transferSeparatorText}>{key}</RnText>
                  </View>
                  <FlatList
                    data={users}
                    renderItem={({ item, index }) => {
                      const { id } = item
                      return (
                        <UserItem
                          showNewAvatar={true}
                          iconFuncs={[() => callStore.startCall(id)]}
                          icons={[mdiPhone]}
                          key={index}
                          {...item}
                          containerStyle={styles.userItem}
                        />
                      )
                    }}
                  />
                </React.Fragment>
              )
            })}
          </View>
        </ScrollView>
      </CustomLayout>
    )
  }
}

export default PageContactUsers
