import { mdiPhone } from '@mdi/js'
import { observer } from 'mobx-react'
import moment from 'moment'
import React from 'react'
import { FlatList, ScrollView, View } from 'react-native'

import UserItem from '@/components/ContactUserItem'
import CustomLayout from '@/components/CustomLayout'
import RnText from '@/components/RnText'
import styles from '@/pages/PageCallRecents/Styles'
import { getAuthStore } from '@/stores/authStore'
import { AuthStore } from '@/stores/authStore2'
import callStore from '@/stores/callStore'
import contactStore from '@/stores/contactStore'

@observer
class MissedCalls extends React.Component {
  isMatchUser = (call: AuthStore['currentData']['recentCalls'][0]) => {
    if (call.partyNumber.includes(contactStore.callSearchRecents)) {
      return call.id
    }
    return ''
  }

  getAvatar = (id: string) => {
    const ucUser = contactStore.getUCUser(id) || {}
    return {
      id: id,
      avatar: ucUser.avatar,
    }
  }

  getMatchedCalls = () => {
    const {
      currentData: { recentCalls },
    } = getAuthStore()
    const calls = recentCalls.filter(this.isMatchUser)

    // Backward compatibility to remove invalid items from the previous versions
    const filteredCalls = calls.filter(call => {
      const { created } = call
      const createdLength = (created + '').length

      return (
        typeof created === 'string' &&
        // HH:mm - MMM D
        (createdLength === 13 || createdLength === 14)
      )
    })
    const today = moment().format('MMM D')
    // {"id":"589b497c-530b-44d8-aef7-38a2dd9b9342","incoming":false,"answered":false,"partyNumber":"100","duration":0,"created":"12:12 - Jun 21"}
    return filteredCalls.map(call => ({
      ...call,
      created: (call.created + '').replace(` - ${today}`, ''),
    }))
  }

  render() {
    const calls = this.getMatchedCalls()
    const missedCalls = calls.filter(call => {
      const { incoming, answered } = call
      return incoming && !answered
    })
    return (
      <CustomLayout menu='call' subMenu='missed'>
        <ScrollView>
          <View style={styles.parkContainer}>
            <RnText style={styles.ParksText}>{'Missed calls'}</RnText>
          </View>
          {missedCalls.length ? (
            <View style={styles.footerContainer}>
              <FlatList
                data={missedCalls}
                scrollEnabled={false}
                renderItem={({ item, index }) => {
                  const { partyNumber } = item
                  return (
                    <UserItem
                      iconFuncs={[() => callStore.startCall(partyNumber)]}
                      hideAvatar={true}
                      icons={[mdiPhone]}
                      isRecentCall
                      key={index}
                      index={index}
                      {...this.getAvatar(partyNumber)}
                      {...item}
                      fromMissedCall={true}
                    />
                  )
                }}
                style={{ marginBottom: 80 }}
              />
            </View>
          ) : (
            <></>
          )}
        </ScrollView>
      </CustomLayout>
    )
  }
}

export default MissedCalls
