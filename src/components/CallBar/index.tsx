import {
  mdiMicrophone,
  mdiMicrophoneOff,
  mdiPause,
  mdiPlay,
  mdiVolumeHigh,
  mdiVolumeMedium,
} from '@mdi/js'
import { observer } from 'mobx-react'
import React from 'react'
import { Image, Platform, TouchableOpacity, View } from 'react-native'
import { SvgXml } from 'react-native-svg'

import svgImages from '@/assets/svgImages'
import ButtonIcon from '@/components/ButtonIcon'
import styles from '@/components/CallBar/Styles'
import { RnText, RnTouchableOpacity } from '@/components/Rn'
import VideoCallRequest from '@/pages/PageCallManage/VideoCallRequest'
import callStore from '@/stores/callStore'
import intl from '@/stores/intl'
import Nav from '@/stores/Nav'
import RnStacker from '@/stores/RnStacker'
import CustomColors from '@/utils/CustomColors'
import CustomImages from '@/utils/CustomImages'
import formatDuration from '@/utils/formatDuration'
import { DeclineButton, GreenCallButton } from '@/utils/SvgComponent'

@observer
class CallBar extends React.Component {
  render() {
    const bVisible =
      RnStacker.stacks.filter(stack => stack.name === 'PageCallManage')
        .length === 0
    const currentCall = callStore.currentCall
    const {
      incoming,
      answered,
      title,
      duration,
      holding,
      toggleHold,
      muted,
      toggleMuted,
      hangup,
    }: any = currentCall || {}
    if (!bVisible || !currentCall || (incoming && !answered)) {
      return null
    }

    const goToCallPage = () => {
      Nav().goToPageCallManage({ isFromCallBar: true })
    }

    return (
      <>
        <View style={styles.callBar}>
          <RnTouchableOpacity
            onPress={goToCallPage}
            style={styles.callBarOuter}
          >
            <View>
              <GreenCallButton
                fill={CustomColors.CallGreen}
                fillOpacity={1}
              ></GreenCallButton>
            </View>
            <View style={styles.callBarInfo}>
              {!!title && (
                <RnText style={styles.notifyInfoPartyName}>{title}</RnText>
              )}
              <RnText style={styles.duration}>
                {answered ? formatDuration(duration) : intl`Dialing...`}
              </RnText>
            </View>

            <View style={styles.callBarButtonCall}>
              <ButtonIcon
                style={styles.actionButtons}
                color={CustomColors.Black}
                onPress={() => toggleHold()}
                path={holding ? mdiPlay : mdiPause}
                size={30}
                containerStyle={styles.actionButtonsContainer}
              />
              {answered && (
                <>
                  <ButtonIcon
                    style={styles.actionButtons}
                    color={CustomColors.Black}
                    onPress={() => toggleMuted()}
                    path={muted ? mdiMicrophoneOff : mdiMicrophone}
                    size={30}
                    containerStyle={styles.actionButtonsContainer}
                  />
                  {Platform.OS !== 'web' && (
                    <ButtonIcon
                      style={styles.actionButtons}
                      color={CustomColors.Black}
                      onPress={callStore.toggleLoudSpeaker}
                      path={
                        callStore.isLoudSpeakerEnabled
                          ? mdiVolumeHigh
                          : mdiVolumeMedium
                      }
                      size={27}
                      containerStyle={styles.actionButtonsContainer}
                    />
                  )}
                </>
              )}
              <TouchableOpacity onPress={hangup}>
                <DeclineButton></DeclineButton>
              </TouchableOpacity>
            </View>
          </RnTouchableOpacity>
        </View>
        <VideoCallRequest videoCallOn={() => goToCallPage()} />
      </>
    )
  }
}

export default CallBar
