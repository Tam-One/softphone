import { mdiMagnify, mdiPhone, mdiVoicemail } from '@mdi/js'
import UserItem from 'components/ContactUserItem'
import CustomLayout from 'components/CustomLayout'
import { RnIcon } from 'components/Rn'
import RnText from 'components/RnText'
import RnTextInput from 'components/RnTextInput'
import { observer } from 'mobx-react'
import moment from 'moment'
import styles from 'pages/PageCallRecents/Styles'
import React from 'react'
import { FlatList, ScrollView, View } from 'react-native'
import { getAuthStore } from 'stores/authStore'
import { AuthStore } from 'stores/authStore2'
import callStore from 'stores/callStore'
import contactStore from 'stores/contactStore'
import CustomColors from 'utils/CustomColors'

@observer
class PageCallRecents extends React.Component {
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
    return (
      <CustomLayout menu='call' subMenu='recents'>
        <ScrollView>
          <View style={styles.parkContainer}>
            <View>
              <RnText style={styles.ParksText}>{'Recents'}</RnText>
              <RnText style={styles.noParksDesc}>
                {'Recent voicemails and calls'}
              </RnText>
            </View>

            <View>
              <RnIcon
                path={mdiVoicemail}
                pointerEvents='none'
                style={styles.voiceMailIcon}
                size={31}
                color={CustomColors.DarkBlue}
              />
              {callStore.newVoicemailCount ? (
                <View style={styles.voiceMailCount}>
                  <RnText style={styles.voiceMailText}>
                    {callStore.newVoicemailCount}
                  </RnText>
                </View>
              ) : (
                <></>
              )}
            </View>
          </View>
          <View style={styles.searchBox}>
            <RnIcon
              path={mdiMagnify}
              pointerEvents='none'
              style={styles.fieldIcon}
              size={17}
              color={CustomColors.DarkAsh}
            />
            <RnTextInput
              disabled
              style={styles.fieldTextInput}
              value={contactStore.callSearchRecents}
              onChangeText={(val: string) => {
                contactStore.callSearchRecents = val
              }}
              placeholder={'Search'}
            />
          </View>
          <View style={styles.noParksContainer}>
            <RnText
              style={styles.noParksText}
            >{`Recent calls (${calls.length})`}</RnText>
          </View>
          <View style={styles.footerContainer}>
            <FlatList
              data={calls}
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
                    {...this.getAvatar(partyNumber)}
                    {...item}
                  />
                )
              }}
              style={{ marginBottom: 80 }}
            />
          </View>
        </ScrollView>
      </CustomLayout>
    )
  }
}

export default PageCallRecents
