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
import PageDtmfKeypad from 'pages/PageDtmfKeypad'
import PageTransferAttend from 'pages/PageTransferAttend'
import React from 'react'
import { Platform, View } from 'react-native'
import Call from 'stores/Call'
import callStore from 'stores/callStore'
import intl from 'stores/intl'
import Nav from 'stores/Nav'
import CustomColors from 'utils/CustomColors'
import CustomImages from 'utils/CustomImages'
import formatDuration from 'utils/formatDuration'

import VideoPopup from './VideoPopup'

@observer
class PageCallManage extends React.Component<{
  isFromCallBar: boolean
}> {
  intervalID = 0
  videoRequestTimeout
  state = {
    showKeyPad: false,
    showVideoPopup: '',
    responseMessage: '',
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

    const onVideoPress = () => {
      this.setState({ showVideoPopup: 'REQUEST' })
    }

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
          onPress={localVideoEnabled ? () => disableVideo(true) : onVideoPress}
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
          onPress={() => this.setState({ showKeyPad: true })}
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
      this.setState({ responseMessage: 'No Response' })
      setTimeout(() => {
        this.setState({ responseMessage: '' })
      }, 3000)
    }, 500000)
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

    if (this.videoRequestTimeout && !localVideoEnabled) {
      clearTimeout(this.videoRequestTimeout)
      this.videoRequestTimeout = null
      this.setState({ responseMessage: 'Video request declined' })
      setTimeout(() => {
        this.setState({ responseMessage: '' })
      }, 3000)
    }
    const { showKeyPad, responseMessage } = this.state
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
          {this.state.showVideoPopup === 'REQUEST' ? (
            <VideoPopup
              header={'Switch to video call?'}
              showOk={true}
              onOkPress={() => this.onVideoCallSwitch(currentCall)}
              onCancel={() => this.setState({ showVideoPopup: '' })}
            ></VideoPopup>
          ) : (
            <></>
          )}

          {localVideoEnabled && !remoteVideoEnabled ? (
            <>
              <VideoPopup
                header={'Waiting for video call request'}
                showOk={false}
                onCancel={() => {
                  clearTimeout(this.videoRequestTimeout)
                  this.videoRequestTimeout = null
                  disableVideo()
                }}
              ></VideoPopup>
            </>
          ) : (
            <></>
          )}

          {!localVideoEnabled && remoteVideoEnabled ? (
            <>
              <VideoPopup
                header={'Request to switch to a video call'}
                showOk={true}
                onOkPress={() => {
                  enableVideo()
                }}
                onCancel={() => disableVideo(true)}
              ></VideoPopup>
            </>
          ) : (
            <></>
          )}

          {responseMessage ? (
            <>
              <VideoPopup
                header={responseMessage}
                showOk={false}
                onCancel={() => this.setState({ responseMessage: '' })}
              ></VideoPopup>
            </>
          ) : (
            <></>
          )}

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
                containerStyle={{
                  marginTop: getCallerName || showKeyPad ? '15%' : '25%',
                }}
              />
              {answered && this.renderCallTime()}
              {!showKeyPad ? (
                this.renderBtns(currentCall)
              ) : (
                <PageDtmfKeypad
                  callId={id}
                  partyName={partyName}
                  hangup={hangup}
                  onHidePress={() => this.setState({ showKeyPad: false })}
                ></PageDtmfKeypad>
              )}
              {this.renderHangupBtn(currentCall)}
            </CustomGradient>
          </View>
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
    const { showKeyPad } = this.state
    return (
      <View style={styles.footerContainer}>
        {!showKeyPad && (
          <View style={styles.actionBtnContainer}>
            <CallButtons
              onPress={hangup}
              image={CustomImages.CallDeclinedLogo}
              lable={''}
            />
          </View>
        )}
        <PoweredBy containerStyle={{ marginTop: 0 }} />
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
