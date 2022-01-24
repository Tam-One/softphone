import {
  mdiArrowRight,
  mdiPhoneForward,
  mdiPhoneHangup,
  mdiPhoneOff,
} from '@mdi/js'
import { observer } from 'mobx-react'
import React from 'react'
import { Text, View } from 'react-native'
import UserAvatar from 'react-native-user-avatar'

import CustomGradient from '@/components/CustomGradient'
import CustomHeader from '@/components/CustomHeader'
import PoweredBy from '@/components/PoweredBy'
import { RnIcon, RnText, RnTouchableOpacity } from '@/components/Rn'
import styles from '@/pages/PageTransferAttend/Styles'
import callStore from '@/stores/callStore'
import intl from '@/stores/intl'
import CustomColors from '@/utils/CustomColors'
import CustomFonts from '@/utils/CustomFonts'
import { CancelConference, TransferPageIcon } from '@/utils/SvgComponent'

@observer
class PageTransferAttend extends React.Component {
  render() {
    const { currentCall = {} } = callStore || {}

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
    let userAvatarName = callerName || partyName || partyNumber
    if (userAvatarName === partyNumber) {
      userAvatarName = userAvatarName?.split('').join(' ')
    }
    let transferingAvatarName = transferringName
    if (transferingAvatarName === transferring) {
      transferingAvatarName = transferingAvatarName?.split('').join(' ')
    }
    return (
      <CustomGradient>
        <CustomHeader
          onBack={stopTransferring}
          backText={'cancel'}
          title={'Conference'}
          containerStyle={{ backgroundColor: CustomColors.AppBackground }}
        />
        <View style={styles.transferSeparator}>
          <RnText style={styles.transferSeparatorText}></RnText>
        </View>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.innerInfo}>
            <Text style={styles.transferText} numberOfLines={2}>
              {'Transfer '}
              <Text style={styles.partyName}>{partyNumber}</Text>
              {' to '}
              <Text style={styles.partyName}>{transferring}</Text>
            </Text>
          </View>
          <View style={styles.inner}>
            <RnTouchableOpacity
              style={styles.btnOuter}
              onPress={stopTransferring}
            >
              <View style={[styles.btn, styles.btnCancel]}>
                <CancelConference></CancelConference>
              </View>
              <RnText
                style={styles.callerName}
              >{intl`Cancel Conference`}</RnText>
            </RnTouchableOpacity>
            <RnTouchableOpacity style={styles.btnOuter} onPress={hangup}>
              <View style={[styles.btn, styles.btnTransfer]}>
                <TransferPageIcon></TransferPageIcon>
              </View>
              <RnText style={styles.callerName}>{intl`Transfer`}</RnText>
            </RnTouchableOpacity>
          </View>
        </View>
        <PoweredBy containerStyle={styles.poweredBy}></PoweredBy>
      </CustomGradient>
    )
  }
}

export default PageTransferAttend
