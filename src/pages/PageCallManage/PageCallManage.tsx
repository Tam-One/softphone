import CallActionButton from 'components/CallActionButton/CallActionButton'
import CallButtons from 'components/CallButtons/CallButtons'
import CallerInfo from 'components/CallerInfo/CallerInfo'
import CustomGradient from 'components/CustomGradient/CustomGradient'
import FieldButton from 'components/FieldButton/FieldButton'
import Layout from 'components/Layout/Layout'
import PoweredBy from 'components/PoweredBy/PoweredBy'
import { RnTouchableOpacity } from 'components/Rn'
import RnText from 'components/RnText'
import VideoPlayer from 'components/VideoPlayer'
import { toInteger } from 'lodash'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import styles from 'pages/PageCallManage/Styles'
import PageTransferAttend from 'pages/PageTransferAttend/PageTransferAttend'
import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import Call from 'stores/Call'
import callStore from 'stores/callStore'
import intl from 'stores/intl'
import Nav from 'stores/Nav'
import CustomColors from 'utils/CustomColors'
import CustomImages from 'utils/CustomImages'

@observer
class PageCallManage extends React.Component<{
  isFromCallBar: boolean
}> {
  @observable showButtonsInVideoCall = true
  alreadySetShowButtonsInVideoCall = false
  intervalID = 0
  state = {
    curTime: 0,
  }

  componentDidMount() {
    this.hideButtonsIfVideo()
    this.intervalID = setInterval(() => {
      this.setState({
        curTime: this.state.curTime + 1,
      })
    }, 1000)
  }
  componentDidUpdate() {
    this.hideButtonsIfVideo()
    if (!callStore.currentCall && !callStore.backgroundCalls.length) {
      Nav().backToPageCallRecents()
    }
  }
  componentWillUnmount() {
    clearInterval(this.intervalID)
  }

  @action toggleButtons = () => {
    this.showButtonsInVideoCall = !this.showButtonsInVideoCall
  }
  @action hideButtonsIfVideo = () => {
    if (
      !this.props.isFromCallBar &&
      !this.alreadySetShowButtonsInVideoCall &&
      callStore.currentCall?.remoteVideoEnabled
    ) {
      this.showButtonsInVideoCall = false
      this.alreadySetShowButtonsInVideoCall = true
    }
  }

  renderCallTime = () => {
    const timeInSec = this.state.curTime
    const isSecs = toInteger(timeInSec % 60)
    const secs = isSecs < 10 ? '0' + isSecs : isSecs
    const isMins = toInteger(timeInSec / 60)
    const mins = isMins < 10 ? '0' + isMins : isMins
    const isHours = toInteger(timeInSec / 360)
    const hours = isHours ? isHours + ':' : null

    return (
      <View style={styles.timerContainer}>
        <View style={styles.timerDisplayBox}>
          <RnText style={{ color: CustomColors.White }}>
            {hours}
            {mins}:{secs}
          </RnText>
        </View>
      </View>
    )
  }

  renderCall = (c?: any, isVideoEnabled?: boolean) => {
    if (!c) {
      return
    }
    if (c && c.transferring) {
      return <PageTransferAttend />
    } else {
      return (
        <Layout
          compact
          dropdown={
            isVideoEnabled && !c?.tsransferring
              ? [
                  {
                    label: this.showButtonsInVideoCall
                      ? intl`Hide call menu buttons`
                      : intl`Show call menu buttons`,
                    onPress: this.toggleButtons,
                  },
                ]
              : undefined
          }
          noScroll
          onBack={Nav().backToPageCallRecents}
          title={c?.partyNumber || intl`Connection failed`}
          transparent={!c?.transferring}
        >
          <>
            {isVideoEnabled && this.renderVideo(c)}

            {!isVideoEnabled && (
              <CallerInfo
                isUserCalling={!c.partyNumber.includes('+')}
                callerName={c.getCallerName}
                callerNumber={c.partyNumber}
                containerStyle={{ marginTop: c.getCallerName ? '5%' : '20%' }}
              />
            )}
            {this.renderCallTime()}
            {this.renderBtns(c, isVideoEnabled)}
            {this.renderHangupBtn(c, isVideoEnabled)}
          </>
        </Layout>
      )
    }
  }

  renderVideo = (c: Call) => (
    <>
      <View style={styles.videoSpace} />
      <View style={styles.video}>
        <VideoPlayer sourceObject={c.remoteVideoStreamObject} />
      </View>
      <RnTouchableOpacity
        onPress={this.toggleButtons}
        style={StyleSheet.absoluteFill}
      />
    </>
  )

  renderBtns = (c: Call, isVideoEnabled?: boolean) => {
    if (isVideoEnabled && !this.showButtonsInVideoCall) {
      return null
    }
    const Container = isVideoEnabled ? RnTouchableOpacity : View
    const activeColor = CustomColors.IconActiveBlue
    const backgrounCallsLength = callStore.backgroundCalls.length
    const nonActiveColor = CustomColors.White
    const textActiveColor = CustomColors.Black
    return (
      <Container
        onPress={isVideoEnabled ? this.toggleButtons : undefined}
        style={[styles.btns, isVideoEnabled && styles.btnsIsVideoEnabled]}
      >
        <View style={styles.btnsVerticalMargin} />
        {/* TODO add Connecting... */}
        <View style={!c.answered && styles.btnsHidden}>
          <View style={styles.btnsInnerView}>
            <CallActionButton
              bgcolor={c.muted ? activeColor : nonActiveColor}
              name={c.muted ? intl`Unmute` : intl`Mute`}
              onPress={() => c.toggleMuted()}
              textcolor={c.muted ? nonActiveColor : textActiveColor}
              image={
                c.muted ? CustomImages.MicrophoneOff : CustomImages.Microphone
              }
              imageStyle={styles.actionBtnImage}
            />
            <CallActionButton
              bgcolor={c.holding ? activeColor : nonActiveColor}
              name={c.holding ? intl`Unhold` : intl`Hold`}
              onPress={() => c.toggleHold()}
              textcolor={c.holding ? nonActiveColor : textActiveColor}
              image={c.holding ? CustomImages.Unhold : CustomImages.Pause}
              imageStyle={styles.actionBtnImage}
            />
            <CallActionButton
              bgcolor={nonActiveColor}
              name={intl`Video`}
              onPress={c.localVideoEnabled ? c.disableVideo : c.enableVideo}
              textcolor={textActiveColor}
              image={CustomImages.Video}
              imageStyle={styles.actionBtnImage}
            />
            {Platform.OS !== 'web' && (
              <CallActionButton
                bgcolor={
                  callStore.isLoudSpeakerEnabled ? activeColor : nonActiveColor
                }
                name={intl`Speaker`}
                onPress={callStore.toggleLoudSpeaker}
                textcolor={
                  callStore.isLoudSpeakerEnabled
                    ? nonActiveColor
                    : textActiveColor
                }
                image={
                  callStore.isLoudSpeakerEnabled
                    ? CustomImages.VolumeHigh
                    : CustomImages.VolumeMedium
                }
                imageStyle={styles.actionBtnImage}
              />
            )}
          </View>
          <View style={styles.btnsSpace} />
          <View style={styles.btnsInnerView}>
            <CallActionButton
              bgcolor={c.recording ? activeColor : nonActiveColor}
              name={intl`Record`}
              onPress={c.toggleRecording}
              textcolor={c.recording ? nonActiveColor : textActiveColor}
              image={
                c.recording ? CustomImages.RecordWhite : CustomImages.Record
              }
            />
            <CallActionButton
              bgcolor={nonActiveColor}
              name={intl`Park`}
              onPress={Nav().goToPageCallParks2}
              textcolor={textActiveColor}
              image={CustomImages.Park}
            />
            <CallActionButton
              bgcolor={nonActiveColor}
              name={intl`Keys`}
              onPress={Nav().goToPageDtmfKeypad}
              textcolor={textActiveColor}
              image={CustomImages.Keys}
            />
            <CallActionButton
              bgcolor={nonActiveColor}
              name={intl`Transfer`}
              onPress={Nav().goToPageTransferDial}
              textcolor={textActiveColor}
              image={CustomImages.Transfer}
            />
          </View>
        </View>
        {backgrounCallsLength > 0 && (
          <FieldButton
            label={intl`BACKGROUND CALLS`}
            onCreateBtnPress={Nav().goToPageBackgroundCalls}
            value={intl`${backgrounCallsLength} other calls are in background`}
          />
        )}
        <View style={styles.btnsVerticalMargin} />
      </Container>
    )
  }

  renderHangupBtn = (c: Call, isVideoEnabled?: boolean) => (
    <View style={styles.footerContainer}>
      <View style={styles.actionBtnContainer}>
        <CallButtons
          onPress={c.hangup}
          image={CustomImages.CallDeclinedLogo}
          lable={''}
        />
      </View>
      {!isVideoEnabled && <PoweredBy containerStyle={{ marginTop: 30 }} />}
    </View>
  )

  render() {
    const c = callStore.currentCall
    const isVideoEnabled = c?.remoteVideoEnabled && c?.localVideoEnabled
    const Container = isVideoEnabled ? React.Fragment : CustomGradient
    return <Container>{this.renderCall(c, isVideoEnabled)}</Container>
  }
}

export default PageCallManage
