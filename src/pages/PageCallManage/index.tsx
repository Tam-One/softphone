import CallActionButton from 'components/CallActionButton'
import CallButtons from 'components/CallButtons'
import CallerInfo from 'components/CallerInfo'
import CustomGradient from 'components/CustomGradient'
import CustomHeader from 'components/CustomHeader'
import FieldButton from 'components/FieldButton'
import PoweredBy from 'components/PoweredBy'
import RnText from 'components/RnText'
import VideoPlayer from 'components/VideoPlayer'
import { toInteger } from 'lodash'
import { observer } from 'mobx-react'
import styles from 'pages/PageCallManage/Styles'
import PageTransferAttend from 'pages/PageTransferAttend'
import React from 'react'
import { Platform, View } from 'react-native'
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
  intervalID = 0
  state = {
    curTime: 0,
  }

  startCallTimer = answeredAt => {
    clearInterval(this.intervalID)
    this.intervalID = setInterval(() => {
      const date = new Date()
      const diffInMs = date.getTime() - answeredAt
      this.setState({
        curTime: diffInMs / 1000,
      })
    }, 1000)
  }

  getActionsButtonList = (currentCall: any) => {
    const activeColor = CustomColors.IconActiveBlue
    const nonActiveColor = CustomColors.White
    const textActiveColor = CustomColors.Black
    const {
      muted,
      toggleMuted,
      holding,
      toggleHold,
      localVideoEnabled,
      disableVideo,
      enableVideo,
      recording,
      toggleRecording,
    } = currentCall

    const { isLoudSpeakerEnabled, toggleLoudSpeaker } = callStore

    const buttonList = {
      mute: (
        <CallActionButton
          bgcolor={muted ? activeColor : nonActiveColor}
          name={muted ? intl`Unmute` : intl`Mute`}
          onPress={() => toggleMuted()}
          textcolor={muted ? nonActiveColor : textActiveColor}
          image={muted ? CustomImages.MicrophoneOff : CustomImages.Microphone}
          imageStyle={styles.actionBtnImage}
        />
      ),
      hold: (
        <CallActionButton
          bgcolor={holding ? activeColor : nonActiveColor}
          name={holding ? intl`Unhold` : intl`Hold`}
          onPress={() => toggleHold()}
          textcolor={holding ? nonActiveColor : textActiveColor}
          image={holding ? CustomImages.Unhold : CustomImages.Pause}
          imageStyle={styles.actionBtnImage}
        />
      ),
      video: (
        <CallActionButton
          bgcolor={localVideoEnabled ? activeColor : nonActiveColor}
          name={intl`Video`}
          onPress={localVideoEnabled ? disableVideo : enableVideo}
          textcolor={localVideoEnabled ? nonActiveColor : textActiveColor}
          image={localVideoEnabled ? CustomImages.Video : CustomImages.VideoOff}
          imageStyle={styles.actionBtnImage}
        />
      ),
      speaker: (
        <CallActionButton
          bgcolor={isLoudSpeakerEnabled ? activeColor : nonActiveColor}
          name={intl`Speaker`}
          onPress={toggleLoudSpeaker}
          textcolor={isLoudSpeakerEnabled ? nonActiveColor : textActiveColor}
          image={
            isLoudSpeakerEnabled
              ? CustomImages.VolumeHigh
              : CustomImages.VolumeMedium
          }
          imageStyle={styles.actionBtnImage}
        />
      ),
      record: (
        <CallActionButton
          bgcolor={recording ? activeColor : nonActiveColor}
          name={intl`Record`}
          onPress={toggleRecording}
          textcolor={recording ? nonActiveColor : textActiveColor}
          image={recording ? CustomImages.RecordWhite : CustomImages.Record}
        />
      ),
      park: (
        <CallActionButton
          bgcolor={nonActiveColor}
          name={intl`Park`}
          onPress={Nav().goToPageCallParks2}
          textcolor={textActiveColor}
          image={CustomImages.Park}
        />
      ),
      keys: (
        <CallActionButton
          bgcolor={nonActiveColor}
          name={intl`Keys`}
          onPress={Nav().goToPageDtmfKeypad}
          textcolor={textActiveColor}
          image={CustomImages.Keys}
        />
      ),
      transfer: (
        <CallActionButton
          bgcolor={nonActiveColor}
          name={intl`Transfer`}
          onPress={Nav().goToPageTransferDial}
          textcolor={textActiveColor}
          image={CustomImages.Transfer}
        />
      ),
    }

    return buttonList
  }

  componentDidUpdate() {
    const { currentCall, backgroundCalls } = callStore
    const { answered, answeredAt }: any = currentCall || {}
    const { curTime } = this.state
    if (!currentCall && !backgroundCalls.length) {
      Nav().backToPageCallRecents()
    }
    if (answered && !curTime) {
      this.startCallTimer(answeredAt)
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalID)
  }

  renderCallTime = (isVideoEnabled?: boolean) => {
    const timeInSec = this.state.curTime
    const isSecs = toInteger(timeInSec % 60)
    const secs = isSecs < 10 ? '0' + isSecs : isSecs
    const isMins = toInteger(timeInSec / 60)
    const mins = isMins < 10 ? '0' + isMins : isMins
    const isHours = toInteger(timeInSec / 3600)
    const hours = isHours ? isHours + ':' : null

    return (
      <View
        style={[
          styles.timerContainer,
          isVideoEnabled && styles.videoTimerDisplayBox,
        ]}
      >
        <View style={styles.timerDisplayBox}>
          <RnText style={{ color: CustomColors.White }}>
            {hours}
            {mins}:{secs}
          </RnText>
        </View>
      </View>
    )
  }

  renderCall = (currentCall?: any, isVideoEnabled?: boolean) => {
    const { transferring, partyNumber, getCallerName, answered } = currentCall
    if (!currentCall) {
      return
    }
    if (currentCall && transferring) {
      return <PageTransferAttend />
    } else if (isVideoEnabled) {
      return this.renderVideoPage(currentCall)
    } else {
      return (
        <>
          <CustomHeader
            onBack={Nav().backToPageCallRecents}
            description={''}
            title={''}
            hideBackText={true}
            containerStyle={styles.customHeaderContainer}
            backContainerStyle={styles.backBtnContainer}
          ></CustomHeader>
          <View style={styles.container}>
            <CustomGradient>
              <CallerInfo
                isUserCalling={!partyNumber?.includes('+')}
                callerName={getCallerName}
                callerNumber={partyNumber}
                containerStyle={{ marginTop: getCallerName ? '15%' : '40%' }}
              />
              {answered && this.renderCallTime()}
              {this.renderBtns(currentCall)}
              {this.renderHangupBtn(currentCall)}
            </CustomGradient>
          </View>
        </>
      )
    }
  }

  renderVideoPage = (currentCall?: any) => {
    return (
      <View style={styles.videoPageContainer}>
        {this.renderVideo(currentCall)}
        {this.renderCallTime(true)}
        {this.renderVideoActionBtns(currentCall)}
      </View>
    )
  }

  renderVideo = (currentCall: Call) => {
    const { remoteVideoStreamObject, localVideoStreamObject } = currentCall
    return (
      <View style={styles.videoContainer}>
        <VideoPlayer
          sourceObject={remoteVideoStreamObject}
          style={styles.remoteVideo}
        />
        <VideoPlayer
          sourceObject={localVideoStreamObject}
          style={styles.localVideo}
        />
      </View>
    )
  }

  renderVideoActionBtns = (currentCall: Call) => {
    const { backgroundCalls } = callStore
    const backgrounCallsLength = backgroundCalls.length
    const actionButtonsList = this.getActionsButtonList(currentCall)
    const { hangup } = currentCall

    return (
      <View style={styles.btnsIsVideoEnabled}>
        <View style={styles.videoActionsContainer}>
          <View style={styles.btnsInnerView}>
            {actionButtonsList['mute']}
            {actionButtonsList['hold']}
            {actionButtonsList['video']}
          </View>
          <View style={[styles.btnsInnerView, styles.btnsSpace]}>
            {actionButtonsList['record']}
            {Platform.OS !== 'web' && actionButtonsList['speaker']}
            <CallButtons
              onPress={hangup}
              image={CustomImages.CallDeclinedLogo}
              lable={''}
              containerStyle={{ width: 80 }}
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
      </View>
    )
  }

  renderBtns = (currentCall: Call) => {
    const { backgroundCalls } = callStore
    const backgrounCallsLength = backgroundCalls.length
    const actionButtonsList = this.getActionsButtonList(currentCall)
    const { answered, localVideoEnabled } = currentCall
    if (!answered) {
      return
    }
    return (
      <View style={[styles.btns]}>
        <View>
          <View style={styles.btnsInnerView}>
            {actionButtonsList['mute']}
            {actionButtonsList['hold']}
            {console.log(localVideoEnabled, 'localVideoEnabled')}
            {actionButtonsList['video']}
            {Platform.OS !== 'web' && actionButtonsList['speaker']}
          </View>
          <View style={styles.btnsSpace} />
          <View style={styles.btnsInnerView}>
            {actionButtonsList['record']}
            {actionButtonsList['park']}
            {actionButtonsList['keys']}
            {actionButtonsList['transfer']}
          </View>
        </View>
        {backgrounCallsLength > 0 && (
          <FieldButton
            label={intl`BACKGROUND CALLS`}
            onCreateBtnPress={Nav().goToPageBackgroundCalls}
            value={intl`${backgrounCallsLength} other calls are in background`}
          />
        )}
      </View>
    )
  }

  renderHangupBtn = (currentCall: Call) => {
    const { hangup } = currentCall
    return (
      <View style={styles.footerContainer}>
        <View style={styles.actionBtnContainer}>
          <CallButtons
            onPress={hangup}
            image={CustomImages.CallDeclinedLogo}
            lable={''}
          />
        </View>
        <PoweredBy containerStyle={{ marginTop: 0 }} />
      </View>
    )
  }

  render() {
    const { currentCall }: any = callStore || {}
    const { remoteVideoEnabled, localVideoEnabled } = currentCall
    const isVideoEnabled = remoteVideoEnabled && localVideoEnabled
    return <>{this.renderCall(currentCall, isVideoEnabled)}</>
  }
}

export default PageCallManage
