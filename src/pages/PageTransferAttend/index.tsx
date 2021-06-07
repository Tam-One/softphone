import {
  mdiArrowRight,
  mdiPhoneForward,
  mdiPhoneHangup,
  mdiPhoneOff,
} from '@mdi/js'
import CustomGradient from 'components/CustomGradient'
import CustomHeader from 'components/CustomHeader'
import { RnIcon, RnText, RnTouchableOpacity } from 'components/Rn'
import { observer } from 'mobx-react'
import styles from 'pages/PageTransferAttend/Styles'
import React from 'react'
import { View } from 'react-native'
import UserAvatar from 'react-native-user-avatar'
import callStore from 'stores/callStore'
import intl from 'stores/intl'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

@observer
class PageTransferAttend extends React.Component {
  render() {
    const currentCall: any = callStore.currentCall || {}
    const {
      partyName,
      partyNumber,
      callerName,
      transferringName,
      transferring,
      stopTransferring,
      hangup,
      conferenceTransferring,
    }: any = currentCall

    if (!currentCall) {
      return null
    }
    var userAvatarName = callerName || partyName || partyNumber
    if (userAvatarName === partyNumber) {
      userAvatarName = userAvatarName?.split('').join(' ')
    }
    var transferingAvatarName = transferringName
    if (transferingAvatarName === transferring) {
      transferingAvatarName = transferingAvatarName?.split('').join(' ')
    }
    return (
      <CustomGradient>
        {/* <RnText center subTitle>{intl`Transferring`}</RnText> */}
        <CustomHeader
          onBack={stopTransferring}
          title={'Transfering'}
          description={'Choose option for transferring this contact'}
        />
        <View style={{ alignItems: 'center' }}>
          <View style={[styles.inner, styles.innerInfo]}>
            <View style={[styles.info, styles.infoFrom]}>
              <UserAvatar
                size={CustomFonts.LargeAvatarSize}
                name={userAvatarName}
                bgColor={CustomColors.DodgerBlue}
              />
              <RnText center singleLine small style={styles.callerName}>
                {callerName || partyName || partyNumber}
              </RnText>
            </View>
            <View style={styles.arrow}>
              <RnIcon
                path={mdiArrowRight}
                color={CustomColors.DarkBlue}
                size={CustomFonts.CallerName}
              />
            </View>
            <View style={[styles.info, styles.infoTo]}>
              <UserAvatar
                size={CustomFonts.LargeAvatarSize}
                name={transferingAvatarName}
                bgColor={CustomColors.DodgerBlue}
              />
              <RnText center singleLine small style={styles.callerName}>
                {transferringName || transferring}
              </RnText>
            </View>
          </View>
          <View style={styles.inner}>
            <View style={styles.btnOuter}>
              <RnTouchableOpacity
                onPress={stopTransferring}
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
                onPress={hangup}
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
                onPress={conferenceTransferring}
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
      </CustomGradient>
    )
  }
}

export default PageTransferAttend
