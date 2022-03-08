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
import { Animated, Platform, TouchableOpacity, View } from 'react-native'

import ButtonIcon from '@/components/ButtonIcon'
import styles from '@/components/CallBar/Styles'
import { RnText, RnTouchableOpacity } from '@/components/Rn'
import VideoCallRequest from '@/pages/PageCallManage/VideoCallRequest'
import callStore from '@/stores/callStore'
import intl from '@/stores/intl'
import Nav from '@/stores/Nav'
import RnStacker from '@/stores/RnStacker'
import CustomColors from '@/utils/CustomColors'
import formatDuration from '@/utils/formatDuration'
import { DeclineButton, GreenCallButton } from '@/utils/SvgComponent'

@observer
class CallBar extends React.Component {
  constructor(props: any) {
    super(props)
    if (!this.state.interval) {
      this.state.interval = setInterval(() => {
        this.startAnimation()
      }, 3000)
    }
  }

  componentWillUnmount() {
    this.state.interval && clearInterval(this.state.interval)
  }

  state = {
    animation: new Animated.Value(1),
    interval: 0,
  }

  startAnimation = () => {
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start()
    })
  }

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
      hangupWithUnhold,
    }: any = currentCall || {}
    if (!bVisible || !currentCall || (incoming && !answered)) {
      return null
    }

    const goToCallPage = () => {
      Nav().goToPageCallManage()
    }

    return (
      <>
        <View style={{ backgroundColor: 'black' }}>
          <Animated.View
            style={{
              backgroundColor: CustomColors.CallBarGreen,
              opacity: this.state.animation,
              width: '100%',
              height: 66,
            }}
          ></Animated.View>
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
                  color={holding ? CustomColors.White : CustomColors.Black}
                  onPress={() => toggleHold()}
                  path={holding ? mdiPlay : mdiPause}
                  size={30}
                  containerStyle={styles.actionButtonsContainer}
                  bgcolor={
                    holding ? CustomColors.IconActiveBlue : CustomColors.White
                  }
                />
                {answered && (
                  <>
                    <ButtonIcon
                      style={styles.actionButtons}
                      color={muted ? CustomColors.White : CustomColors.Black}
                      onPress={() => toggleMuted()}
                      path={muted ? mdiMicrophoneOff : mdiMicrophone}
                      size={30}
                      containerStyle={styles.actionButtonsContainer}
                      bgcolor={
                        muted ? CustomColors.IconActiveBlue : CustomColors.White
                      }
                    />
                    {Platform.OS !== 'web' && (
                      <ButtonIcon
                        style={styles.actionButtons}
                        color={
                          callStore.isLoudSpeakerEnabled
                            ? CustomColors.White
                            : CustomColors.Black
                        }
                        onPress={callStore.toggleLoudSpeaker}
                        path={
                          callStore.isLoudSpeakerEnabled
                            ? mdiVolumeHigh
                            : mdiVolumeMedium
                        }
                        size={27}
                        containerStyle={styles.actionButtonsContainer}
                        bgcolor={
                          callStore.isLoudSpeakerEnabled
                            ? CustomColors.IconActiveBlue
                            : CustomColors.White
                        }
                      />
                    )}
                  </>
                )}
                <TouchableOpacity onPress={hangupWithUnhold}>
                  <DeclineButton width={50} height={50}></DeclineButton>
                </TouchableOpacity>
              </View>
            </RnTouchableOpacity>
          </View>
        </View>
        <VideoCallRequest videoCallOn={() => goToCallPage()} />
      </>
    )
  }
}

export default CallBar
