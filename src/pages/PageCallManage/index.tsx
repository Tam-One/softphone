import svgImages from 'assets/svgImages'
import CallActionButton from 'components/CallActionButton'
import CallButtons from 'components/CallButtons'
import CallerInfo from 'components/CallerInfo'
import CustomGradient from 'components/CustomGradient'
import CustomHeader from 'components/CustomHeader'
import FieldButton from 'components/FieldButton'
import PoweredBy from 'components/PoweredBy'
import RnText from 'components/RnText'
import VideoPlayer from 'components/VideoPlayer'
import { observer } from 'mobx-react'
import styles from 'pages/PageCallManage/Styles'
import VideoPopup from 'pages/PageCallManage/VideoPopup'
import PageDtmfKeypad from 'pages/PageDtmfKeypad'
import PageTransferAttend from 'pages/PageTransferAttend'
import React from 'react'
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import Call from 'stores/Call'
import callStore from 'stores/callStore'
import intl from 'stores/intl'
import Nav from 'stores/Nav'
import CustomColors from 'utils/CustomColors'
import CustomImages from 'utils/CustomImages'
import CustomStrings from 'utils/CustomStrings'
import formatDuration from 'utils/formatDuration'

import VideoCallRequest from './VideoCallRequest'

@observer
class PageCallManage extends React.Component<{
  isFromCallBar: boolean
}> {
  intervalID = 0
  waitingTimer = 3000
  requestTimer = 20000
  recordAnimation = svgImages.recordCircleRed

  videoRequestTimeout
  state = {
    showKeyPad: false,
    showVideoPopup: '',
    responseMessage: '',
    hideVideoButtons: false,
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

    if (recording) {
      if (this.recordAnimation === svgImages.recordCircleRed) {
        this.recordAnimation = svgImages.recordCircleMaroon
      } else {
        this.recordAnimation = svgImages.recordCircleRed
      }
    }

    const { isLoudSpeakerEnabled, toggleLoudSpeaker } = callStore

    const onVideoPress = () => {
      this.setState({ showVideoPopup: CustomStrings.Request })
    }

    const buttonList = {
      mute: (
        <CallActionButton
          bgcolor={muted ? activeColor : nonActiveColor}
          name={muted ? intl`Unmute` : intl`Mute`}
          onPress={() => toggleMuted()}
          textcolor={muted ? nonActiveColor : textActiveColor}
          image={muted ? svgImages.microphoneOff : svgImages.microphoneOn}
          imageStyle={styles.actionBtnImage}
          hideShadow={localVideoEnabled}
        />
      ),
      hold: (
        <CallActionButton
          bgcolor={holding ? activeColor : nonActiveColor}
          name={holding ? intl`Unhold` : intl`Hold`}
          onPress={() => toggleHold()}
          textcolor={holding ? nonActiveColor : textActiveColor}
          image={holding ? svgImages.play : svgImages.pause}
          imageStyle={styles.actionBtnImage}
          hideShadow={localVideoEnabled}
        />
      ),
      video: (
        <CallActionButton
          bgcolor={localVideoEnabled ? activeColor : nonActiveColor}
          name={intl`Video`}
          onPress={localVideoEnabled ? () => disableVideo(true) : onVideoPress}
          textcolor={localVideoEnabled ? nonActiveColor : textActiveColor}
          image={localVideoEnabled ? svgImages.videoOn : svgImages.videoOff}
          imageStyle={styles.actionBtnImage}
          hideShadow={localVideoEnabled}
        />
      ),
      speaker: (
        <CallActionButton
          bgcolor={isLoudSpeakerEnabled ? activeColor : nonActiveColor}
          name={intl`Speaker`}
          onPress={toggleLoudSpeaker}
          textcolor={isLoudSpeakerEnabled ? nonActiveColor : textActiveColor}
          image={
            isLoudSpeakerEnabled ? svgImages.volumeHigh : svgImages.volumeMedium
          }
          imageStyle={styles.actionBtnImage}
          hideShadow={localVideoEnabled}
        />
      ),
      record: (
        <CallActionButton
          bgcolor={recording ? activeColor : nonActiveColor}
          name={intl`Record`}
          onPress={toggleRecording}
          textcolor={recording ? nonActiveColor : textActiveColor}
          image={recording ? this.recordAnimation : svgImages.record}
          hideShadow={localVideoEnabled}
        />
      ),
      park: (
        <CallActionButton
          bgcolor={nonActiveColor}
          name={intl`Park`}
          onPress={Nav().goToPageCallParks2}
          textcolor={textActiveColor}
          image={svgImages.park}
          hideShadow={localVideoEnabled}
        />
      ),
      keys: (
        <CallActionButton
          bgcolor={nonActiveColor}
          name={intl`Keys`}
          onPress={() => this.setState({ showKeyPad: true })}
          textcolor={textActiveColor}
          image={svgImages.keys}
          hideShadow={localVideoEnabled}
        />
      ),
      transfer: (
        <CallActionButton
          bgcolor={nonActiveColor}
          name={intl`Transfer`}
          onPress={Nav().goToPageTransferDial}
          textcolor={textActiveColor}
          image={svgImages.transfer}
          hideShadow={localVideoEnabled}
        />
      ),
    }

    return buttonList
  }

  componentDidUpdate() {
    const { currentCall, backgroundCalls } = callStore
    if (!currentCall && !backgroundCalls.length) {
      Nav().backToPageCallRecents()
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalID)
  }

  renderCallTime = (isVideoEnabled?: boolean) => {
    const currentCall = callStore.currentCall
    return (
      <View
        style={[
          styles.timerContainer,
          isVideoEnabled && styles.videoTimerDisplayBox,
        ]}
      >
        <View style={styles.timerDisplayBox}>
          <RnText style={{ color: CustomColors.White }}>
            {currentCall && currentCall.duration > 0
              ? formatDuration(currentCall.duration)
              : '00:00'}
          </RnText>
        </View>
      </View>
    )
  }

  onVideoCallSwitch = currentCall => {
    const { enableVideo, disableVideo } = currentCall
    enableVideo()
    this.setState({ showVideoPopup: '' })
    this.videoRequestTimeout = setTimeout(() => {
      disableVideo()
      this.setState({ responseMessage: CustomStrings.NoResponse })
      setTimeout(() => {
        this.setState({ responseMessage: '' })
      }, this.waitingTimer)
    }, this.requestTimer)
  }

  renderCall = (currentCall?: any, isVideoEnabled?: boolean) => {
    const {
      transferring,
      partyNumber,
      getCallerName,
      answered,
      id,
      partyName,
      hangup,
      enableVideo,
      localVideoEnabled,
      remoteVideoEnabled,
      disableVideo,
      remoteVideoStreamObject,
      remoteStreamObject,
    } = currentCall

    const callerName = getCallerName || partyName

    if (this.videoRequestTimeout && !localVideoEnabled) {
      clearTimeout(this.videoRequestTimeout)
      this.videoRequestTimeout = null
      this.setState({ responseMessage: CustomStrings.RequestDeclined })
      setTimeout(() => {
        this.setState({ responseMessage: '' })
      }, this.waitingTimer)
    }
    const { showKeyPad, responseMessage, showVideoPopup } = this.state
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
          <VideoCallRequest
            showVideo={showVideoPopup}
            setShowVideo={res => this.setState({ showVideoPopup: res })}
          ></VideoCallRequest>
          <CustomHeader
            onBack={
              showKeyPad
                ? () => this.setState({ showKeyPad: false })
                : Nav().backToPageCallRecents
            }
            description={''}
            title={''}
            containerStyle={styles.customHeaderContainer}
            backContainerStyle={styles.backBtnContainer}
            touchableView={true}
            backText={!showKeyPad ? callerName || partyNumber : 'Back'}
            customBackStyle={{ color: CustomColors.Black }}
          ></CustomHeader>
          <ScrollView>
            <View style={styles.container}>
              <CustomGradient>
                <CallerInfo
                  isUserCalling={!partyNumber?.includes('+')}
                  callerName={callerName}
                  callerNumber={partyNumber}
                  containerStyle={{
                    marginTop: callerName || showKeyPad ? '15%' : '25%',
                  }}
                />
                {answered && this.renderCallTime()}
                {!showKeyPad ? (
                  <View style={{ marginTop: 40 }}>
                    {this.renderBtns(currentCall)}
                  </View>
                ) : (
                  <PageDtmfKeypad
                    callId={id}
                    partyName={callerName}
                    hangup={hangup}
                    onHidePress={() => this.setState({ showKeyPad: false })}
                  ></PageDtmfKeypad>
                )}
                {this.renderHangupBtn(currentCall)}
              </CustomGradient>
            </View>
          </ScrollView>
        </>
      )
    }
  }

  renderVideoPage = (currentCall?: any) => {
    clearTimeout(this.videoRequestTimeout)
    this.videoRequestTimeout = null
    return (
      <View style={styles.videoPageContainer}>
        {this.renderVideo(currentCall)}
        {this.renderCallTime(true)}
        {!this.state.hideVideoButtons &&
          this.renderVideoActionBtns(currentCall)}
      </View>
    )
  }

  renderVideo = (currentCall: Call) => {
    const { remoteVideoStreamObject, localVideoStreamObject } = currentCall
    const { hideVideoButtons } = this.state

    return (
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={() => {
          this.setState({ hideVideoButtons: !hideVideoButtons })
        }}
      >
        <VideoPlayer
          sourceObject={remoteVideoStreamObject}
          style={styles.remoteVideo}
        />
        <VideoPlayer
          sourceObject={localVideoStreamObject}
          style={styles.localVideo}
        />
      </TouchableOpacity>
    )
  }

  renderVideoActionBtns = (currentCall: Call) => {
    const { backgroundCalls } = callStore
    const backgrounCallsLength = backgroundCalls.length
    const { hideVideoButtons } = this.state

    return (
      <TouchableOpacity
        style={styles.btnsIsVideoEnabled}
        onPress={() => {
          this.setState({ hideVideoButtons: !hideVideoButtons })
        }}
      >
        {this.callEndButton(currentCall, styles.videoCallEndButton)}
        {this.renderBtns(currentCall)}
        {backgrounCallsLength > 0 && (
          <FieldButton
            label={intl`BACKGROUND CALLS`}
            onCreateBtnPress={Nav().goToPageBackgroundCalls}
            value={intl`${backgrounCallsLength} other calls are in background`}
          />
        )}
      </TouchableOpacity>
    )
  }

  renderBtns = (currentCall: Call) => {
    const { backgroundCalls } = callStore
    const backgrounCallsLength = backgroundCalls.length
    const actionButtonsList = this.getActionsButtonList(currentCall)
    const { answered, localVideoEnabled } = currentCall
    let backgroundCallText = `other call${
      backgrounCallsLength > 1 ? 's are' : ' is'
    } in background`
    if (!answered) {
      return
    }
    return (
      <View style={[styles.btns]}>
        <View>
          <View style={styles.btnsInnerView}>
            {actionButtonsList['mute']}
            {actionButtonsList['hold']}
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
            value={intl`${backgrounCallsLength} ${backgroundCallText}`}
          />
        )}
      </View>
    )
  }

  renderHangupBtn = (currentCall: Call) => {
    const { showKeyPad } = this.state
    return (
      <View style={styles.footerContainer}>
        {!showKeyPad && (
          <>
            {this.callEndButton(currentCall)}
            <PoweredBy containerStyle={styles.poweredByView} />
          </>
        )}
      </View>
    )
  }

  callEndButton = (currentCall: Call, customStyles?: object) => {
    const { hangup } = currentCall
    return (
      <View style={customStyles ? customStyles : styles.actionBtnContainer}>
        <CallButtons
          onPress={hangup}
          image={CustomImages.CallDeclinedLogo}
          lable={''}
        />
      </View>
    )
  }

  render() {
    const currentCall: any = callStore.currentCall || {}
    const { remoteVideoEnabled, localVideoEnabled } = currentCall
    const isVideoEnabled = remoteVideoEnabled && localVideoEnabled
    return <>{this.renderCall(currentCall, isVideoEnabled)}</>
  }
}

export default PageCallManage
