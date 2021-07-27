import { mdiPhoneHangup } from '@mdi/js'
import UserItem from 'components/ContactUserItem'
import CustomGradient from 'components/CustomGradient'
import CustomHeader from 'components/CustomHeader'
import { RnTouchableOpacity } from 'components/Rn'
import RnText from 'components/RnText'
import { observer } from 'mobx-react'
import styles from 'pages/PageBackgroundCalls/Styles'
import React from 'react'
import { FlatList, ScrollView, View } from 'react-native'
import callStore from 'stores/callStore'
import intl from 'stores/intl'
import Nav from 'stores/Nav'
import CustomColors from 'utils/CustomColors'
import formatDuration from 'utils/formatDuration'

const PageBackgroundCalls = observer(() => {
  const { currentCall, backgroundCalls, selectBackgroundCall }: any = callStore

  return (
    <CustomGradient>
      <CustomHeader
        title={'Background calls'}
        onBack={Nav().backToPageCallManage}
        description={'Your pending calls'}
      ></CustomHeader>

      <ScrollView>
        <View style={[styles.callHeading, styles.currentCallHeading]}>
          <RnText style={styles.callHeadingText}>{'Current call'}</RnText>
        </View>

        <FlatList
          data={currentCall ? [currentCall] : []}
          scrollEnabled={false}
          renderItem={({ item, index }) => {
            const { id, answered, hangupWithUnhold, duration } = item
            return (
              <RnTouchableOpacity key={id} onPress={Nav().backToPageCallManage}>
                <UserItem
                  showNewAvatar={true}
                  iconFuncs={[hangupWithUnhold]}
                  icons={[mdiPhoneHangup]}
                  key={id}
                  lastMessage={
                    !answered ? intl`Dialing...` : formatDuration(duration)
                  }
                  selected
                  {...item}
                  containerStyle={styles.listContainerStyle}
                  innerContainerStyle={styles.listInnerContainer}
                  hideBorder={true}
                  iconsColor={CustomColors.RedOpacity}
                />
              </RnTouchableOpacity>
            )
          }}
        />

        <View style={[styles.callHeading, { marginTop: 32 }]}>
          <RnText style={styles.callHeadingText}>{'Background calls'}</RnText>
        </View>

        <FlatList
          data={backgroundCalls}
          scrollEnabled={false}
          renderItem={({ item, index }) => {
            const { id, answered, hangupWithUnhold, transferring } = item
            return (
              <RnTouchableOpacity
                key={id}
                onPress={() => selectBackgroundCall(item)}
              >
                <UserItem
                  showNewAvatar={true}
                  iconFuncs={[hangupWithUnhold]}
                  icons={[mdiPhoneHangup]}
                  key={id}
                  lastMessage={
                    !answered
                      ? intl`Dialing...`
                      : transferring
                      ? intl`Transferring`
                      : intl`On hold`
                  }
                  {...item}
                  containerStyle={{ marginLeft: 0 }}
                  innerContainerStyle={{ paddingLeft: 16.5 }}
                  iconsColor={CustomColors.RedOpacity}
                />
              </RnTouchableOpacity>
            )
          }}
        />
      </ScrollView>
    </CustomGradient>
  )
})

export default PageBackgroundCalls
