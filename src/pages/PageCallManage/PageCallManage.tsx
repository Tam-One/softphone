import { toInteger } from 'lodash'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import moment from 'moment'
import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import CallActionButton from '../../components/CallActionButton/CallActionButton'
import CallButtons from '../../components/CallButtons/CallButtons'
import CallerInfo from '../../components/CallerInfo/CallerInfo'
import CustomGradient from '../../components/CustomGradient/CustomGradient'
import FieldButton from '../../components/FieldButton'
import Layout from '../../components/Layout'
import PoweredBy from '../../components/PoweredBy/PoweredBy'
import { RnTouchableOpacity } from '../../components/Rn'
import RnText from '../../components/RnText'
import VideoPlayer from '../../components/VideoPlayer'
import Call from '../../stores/Call'
import callStore from '../../stores/callStore'
import intl from '../../stores/intl'
import Nav from '../../stores/Nav'
import CustomColors from '../../utils/CustomColors'
import CustomImages from '../../utils/CustomImages'
import PageTransferAttend from '../PageTransferAttend'
import styles from './Styles'

@observer
class PageCallManage extends React.Component<{
  isFromCallBar: boolean
}> {
  @observable showButtonsInVideoCall = true
  alreadySetShowButtonsInVideoCall = false
  intervalID = 0
  state = {
    startedTime: new Date().toLocaleString(),
    curTime: new Date().toLocaleString(),
  }

  componentDidMount() {
    this.hideButtonsIfVideo()
    this.intervalID = setInterval(() => {
      this.setState({
        curTime: new Date().toLocaleString(),
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
    const timeInSec =
      moment(this.state.curTime).diff(this.state.startedTime) / 1000
    const isSecs = toInteger(timeInSec % 6)
    const secs = isSecs < 10 ? '0' + isSecs : isSecs
    const isMins = toInteger(timeInSec / 6)
    const mins = isMins < 10 ? '0' + isMins : isMins
    const isHours = toInteger(timeInSec / 60)
    const hours = isHours ? isHours + ':' : null

    return (
      <View style={styles.timerContainer}>
        <View style={styles.timerDisplayBox}>
          <RnText style={{ color: 'white' }}>
            {hours}
            {mins}:{secs}
          </RnText>
        </View>
      </View>
    )
  }

  renderCall = (c?: Call, isVideoEnabled?: boolean) => (
    <Layout
      compact
      dropdown={
        isVideoEnabled && !c?.transferring
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
      title={c?.title || intl`Connection failed`}
      transparent={!c?.transferring}
    >
      {!c ? null : c.transferring ? (
        <PageTransferAttend />
      ) : (
        <>
          {isVideoEnabled && this.renderVideo(c)}

          {!isVideoEnabled && (
            <CallerInfo
              isUserCalling={false}
              callerName={''}
              callerNumber={c.title}
              containerStyle={{ marginTop: '25%' }}
            />
          )}
          {this.renderCallTime()}
          {this.renderBtns(c, isVideoEnabled)}
          {this.renderHangupBtn(c, isVideoEnabled)}
        </>
      )}
    </Layout>
  )

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
    const n = callStore.backgroundCalls.length
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
              bgcolor={c.muted ? activeColor : 'white'}
              name={c.muted ? intl`Unmute` : intl`Mute`}
              onPress={() => c.toggleMuted()}
              textcolor={c.muted ? 'white' : 'black'}
              image={
                c.muted ? CustomImages.MicrophoneOff : CustomImages.Microphone
              }
              imageStyle={styles.actionBtnImage}
            />
            <CallActionButton
              bgcolor={c.holding ? activeColor : 'white'}
              name={c.holding ? intl`Unhold` : intl`Hold`}
              onPress={() => c.toggleHold()}
              textcolor={c.holding ? 'white' : 'black'}
              image={c.holding ? CustomImages.Unhold : CustomImages.Pause}
              imageStyle={styles.actionBtnImage}
            />
            <CallActionButton
              bgcolor={'white'}
              name={intl`Video`}
              onPress={c.localVideoEnabled ? c.disableVideo : c.enableVideo}
              textcolor={'black'}
              image={CustomImages.Video}
              imageStyle={styles.actionBtnImage}
            />
            {Platform.OS !== 'web' && (
              <CallActionButton
                bgcolor={callStore.isLoudSpeakerEnabled ? activeColor : 'white'}
                name={intl`Speaker`}
                onPress={callStore.toggleLoudSpeaker}
                textcolor={callStore.isLoudSpeakerEnabled ? 'white' : 'black'}
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
              bgcolor={c.recording ? activeColor : 'white'}
              name={intl`Record`}
              onPress={c.toggleRecording}
              textcolor={c.recording ? 'white' : 'black'}
              image={
                c.recording ? CustomImages.RecordWhite : CustomImages.Record
              }
            />
            <CallActionButton
              bgcolor='white'
              name={intl`Park`}
              onPress={Nav().goToPageCallParks2}
              textcolor='black'
              image={CustomImages.Park}
            />
            <CallActionButton
              bgcolor='white'
              name={intl`Keys`}
              onPress={Nav().goToPageDtmfKeypad}
              textcolor='black'
              image={CustomImages.Keys}
            />
            <CallActionButton
              bgcolor='white'
              name={intl`Transfer`}
              onPress={Nav().goToPageTransferDial}
              textcolor='black'
              image={CustomImages.Transfer}
            />
          </View>
        </View>
        {n > 0 && (
          <FieldButton
            label={intl`BACKGROUND CALLS`}
            onCreateBtnPress={Nav().goToPageBackgroundCalls}
            value={intl`${n} other calls are in background`}
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
