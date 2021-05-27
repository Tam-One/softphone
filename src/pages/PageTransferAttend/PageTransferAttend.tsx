import {
  mdiArrowRight,
  mdiPhoneForward,
  mdiPhoneHangup,
  mdiPhoneOff,
} from '@mdi/js'
import CustomHeader from 'components/CustomHeader/CustomHeader'
import { RnIcon, RnText, RnTouchableOpacity } from 'components/Rn'
import { observer } from 'mobx-react'
import styles from 'pages/PageTransferAttend/Styles'
import React from 'react'
import { View } from 'react-native'
import UserAvatar from 'react-native-user-avatar'
import callStore from 'stores/callStore'
import intl from 'stores/intl'
import CustomColors from 'utils/CustomColors'

@observer
class PageTransferAttend extends React.Component {
  render() {
    const c = callStore.currentCall
    if (!c) {
      return null
    }
    var userAvatarName = c.callerName || c.partyName || c.partyNumber
    if (userAvatarName === c.partyNumber) {
      userAvatarName = userAvatarName?.split('').join(' ')
    }
    var transferingAvatarName = c.transferringName
    if (transferingAvatarName === c.transferring) {
      transferingAvatarName = transferingAvatarName?.split('').join(' ')
    }
    return (
      <View style={styles.outer}>
        {/* <RnText center subTitle>{intl`Transferring`}</RnText> */}
        <CustomHeader
          onBack={c.stopTransferring}
          title={'Transfering'}
          description={'Choose option for transferring this contact'}
        />
        <View style={{ alignItems: 'center' }}>
          <View style={[styles.inner, styles.innerInfo]}>
            <View style={[styles.info, styles.infoFrom]}>
              <UserAvatar
                size={80}
                name={userAvatarName}
                bgColor={CustomColors.DodgerBlue}
              />
              <RnText center singleLine small style={styles.callerName}>
                {c.callerName || c.partyName || c.partyNumber}
              </RnText>
            </View>
            <View style={styles.arrow}>
              <RnIcon
                path={mdiArrowRight}
                color={CustomColors.DarkBlue}
                size={26}
              />
            </View>
            <View style={[styles.info, styles.infoTo]}>
              <UserAvatar
                size={80}
                name={transferingAvatarName}
                bgColor={CustomColors.DodgerBlue}
              />
              <RnText center singleLine small style={styles.callerName}>
                {c.transferringName || c.transferring}
              </RnText>
            </View>
          </View>
          <View style={styles.inner}>
            <View style={styles.btnOuter}>
              <RnTouchableOpacity
                onPress={c.stopTransferring}
                style={[styles.btn, styles.btnStop]}
              >
                <RnIcon path={mdiPhoneOff} color={CustomColors.White} />
              </RnTouchableOpacity>
              <RnText center singleLine small style={styles.callerName}>
                {intl`CANCEL`}
              </RnText>
            </View>
            <View style={styles.btnOuter}>
              <RnTouchableOpacity
                onPress={c.hangup}
                style={[styles.btn, styles.btnHangup]}
              >
                <RnIcon path={mdiPhoneHangup} color={CustomColors.White} />
              </RnTouchableOpacity>
              <RnText center singleLine small style={styles.callerName}>
                {intl`TRANSFER`}
              </RnText>
            </View>
            <View style={styles.btnOuter}>
              <RnTouchableOpacity
                onPress={c.conferenceTransferring}
                style={[styles.btn, styles.btnConference]}
              >
                <RnIcon path={mdiPhoneForward} color={CustomColors.White} />
              </RnTouchableOpacity>
              <RnText center singleLine small style={styles.callerName}>
                {intl`CONFERENCE`}
              </RnText>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default PageTransferAttend
