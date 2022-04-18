import { observer } from 'mobx-react'
import React from 'react'
import {
  Dimensions,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Proximity from 'react-native-proximity'

import svgImages from '@/assets/svgImages'
import CallActionButton from '@/components/CallActionButton'
import CallButtons from '@/components/CallButtons'
import CallerInfo from '@/components/CallerInfo'
import CustomGradient from '@/components/CustomGradient'
import CustomHeader from '@/components/CustomHeader'
import FieldButton from '@/components/FieldButton'
import PoweredBy from '@/components/PoweredBy'
import RnText from '@/components/RnText'
import VideoPlayer from '@/components/VideoPlayer'
import styles from '@/pages/PageCallManage/Styles'
import VideoPopup from '@/pages/PageCallManage/VideoPopup'
import PageDtmfKeypad from '@/pages/PageDtmfKeypad'
import PageTransferAttend from '@/pages/PageTransferAttend'
import Call from '@/stores/Call'
import callStore from '@/stores/callStore'
import intl from '@/stores/intl'
import Nav from '@/stores/Nav'
import CustomColors from '@/utils/CustomColors'
import CustomImages from '@/utils/CustomImages'
import CustomStrings from '@/utils/CustomStrings'
import CustomValues from '@/utils/CustomValues'
import formatDuration from '@/utils/formatDuration'
import {
  DeclineButton,
  Keys,
  MicrophoneOff,
  MicrophoneOn,
  Park,
  Pause,
  Play,
  Record,
  RecordCircleMaroon,
  RecordCircleRed,
  Transfer,
  VideoOff,
  VideoOn,
  VolumeHigh,
  VolumeMedium,
} from '@/utils/SvgComponent'

import VideoCallRequest from './VideoCallRequest'

@observer
class PageCallManage extends React.Component<{
  propsNumber?: string
}> {
  intervalID = 0
  waitingTimer = 3000
  requestTimer = 20000
  recordAnimation = RecordCircleRed
  sipFailed = false

  videoRequestTimeout
  state = {
    showKeyPad: false,
    showVideoPopup: '',
    responseMessage: '',
    hideVideoButtons: false,
    speakedEnabled: false,
    proximity: false,
  }

  getActionsButtonList = (currentCall: any) => {
    const activeColor = CustomColors.IconActiveBlue
    const nonActiveColor = CustomColors.White
    const textActiveColor = CustomColors.DarkBlue
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
      if (this.recordAnimation === RecordCircleRed) {
        this.recordAnimation = RecordCircleMaroon
      } else {
        this.recordAnimation = RecordCircleRed
      }
    }

    const { isLoudSpeakerEnabled, toggleLoudSpeaker } = callStore

    const onVideoPress = () => {
      this.setState({ showVideoPopup: CustomStrings.Request })
    }

    const onHoldPress = () => {
      if (localVideoEnabled) {
        disableVideo(true)
      }
      toggleHold()
    }

    const buttonList = {
      mute: (
        <CallActionButton
          bgcolor={muted ? activeColor : nonActiveColor}
          name={muted ? intl`Unmute` : intl`Mute`}
          onPress={() => toggleMuted()}
          textcolor={muted ? nonActiveColor : textActiveColor}
          Icon={muted ? MicrophoneOff : MicrophoneOn}
          imageStyle={styles.actionBtnImage}
          hideShadow={localVideoEnabled}
        />
      ),
      hold: (
        <CallActionButton
          bgcolor={holding ? activeColor : nonActiveColor}
          name={holding ? intl`Unhold` : intl`Hold`}
          onPress={() => onHoldPress()}
          textcolor={holding ? nonActiveColor : textActiveColor}
          Icon={holding ? Play : Pause}
          imageStyle={styles.actionBtnImage}
          hideShadow={localVideoEnabled}
        />
      ),
      video: (
        <CallActionButton
          disabled={holding}
          bgcolor={localVideoEnabled ? activeColor : nonActiveColor}
          name={intl`Video`}
          onPress={localVideoEnabled ? () => disableVideo(true) : onVideoPress}
          textcolor={localVideoEnabled ? nonActiveColor : textActiveColor}
          Icon={localVideoEnabled ? VideoOn : VideoOff}
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
          Icon={isLoudSpeakerEnabled ? VolumeHigh : VolumeMedium}
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
          Icon={recording ? this.recordAnimation : Record}
          hideShadow={localVideoEnabled}
        />
      ),
      park: (
        <CallActionButton
          bgcolor={nonActiveColor}
          name={intl`Park`}
          onPress={Nav().goToPageCallParks2}
          textcolor={textActiveColor}
          Icon={Park}
          hideShadow={localVideoEnabled}
        />
      ),
      keys: (
        <CallActionButton
          bgcolor={nonActiveColor}
          name={intl`Keys`}
          onPress={() => this.setState({ showKeyPad: true })}
          textcolor={textActiveColor}
          Icon={Keys}
          hideShadow={localVideoEnabled}
        />
      ),
      transfer: (
        <CallActionButton
          bgcolor={nonActiveColor}
          name={intl`Transfer`}
          onPress={Nav().goToPageTransferDial}
          textcolor={textActiveColor}
          Icon={Transfer}
          hideShadow={localVideoEnabled}
        />
      ),
    }

    return buttonList
  }

  componentDidMount() {
    if (CustomValues.iosAndroid) {
      Proximity.addListener(this._proximityListener)
    }
  }

  componentDidUpdate() {
    const { currentCall, backgroundCalls } = callStore
    if (!currentCall && !backgroundCalls.length) {
      Nav().backToPageCallRecents()
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalID)
    if (CustomValues.iosAndroid) {
      Proximity.removeListener(this._proximityListener)
    }
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

  onVideoCallSwitch = () => {
    const currentCall: any = callStore.currentCall
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
      hangupWithUnhold,
      enableVideo,
      localVideoEnabled,
      remoteVideoEnabled,
      disableVideo,
      remoteVideoStreamObject,
      remoteStreamObject,
    } = currentCall
    const { showKeyPad, responseMessage, showVideoPopup } = this.state

    const callerName = getCallerName || partyName

    const showVideoCom =
      showVideoPopup ||
      localVideoEnabled ||
      remoteVideoEnabled ||
      responseMessage

    const { isLoudSpeakerEnabled, enableLoudSpeaker } = callStore

    if (Platform.OS === 'ios' && isLoudSpeakerEnabled && answered) {
      enableLoudSpeaker()
    }

    if (this.videoRequestTimeout && !localVideoEnabled) {
      clearTimeout(this.videoRequestTimeout)
      this.videoRequestTimeout = null
      this.setState({ responseMessage: CustomStrings.RequestDeclined })
      setTimeout(() => {
        this.setState({ responseMessage: '' })
      }, this.waitingTimer)
    }
    if (!currentCall) {
      return
    }
    if (currentCall && transferring) {
      return <PageTransferAttend />
    } else if (isVideoEnabled && !showKeyPad) {
      return this.renderVideoPage(currentCall)
    } else {
      return (
        <>
          {showVideoCom ? (
            <VideoCallRequest
              showVideo={showVideoPopup}
              setShowVideo={res => this.setState({ showVideoPopup: res })}
              onVideoCallSwitch={this.onVideoCallSwitch}
              responseMessage={responseMessage}
              setResponseMessage={msg =>
                this.setState({ responseMessage: msg })
              }
              clearTimer={() => {
                clearTimeout(this.videoRequestTimeout)
                this.videoRequestTimeout = null
              }}
            ></VideoCallRequest>
          ) : (
            <></>
          )}
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
          <View style={styles.container}>
            <CustomGradient customStyle={styles.gradientContainer}>
              {!showKeyPad ? (
                <CallerInfo
                  isUserCalling={!partyNumber?.includes('+')}
                  callerName={callerName}
                  callerNumber={partyNumber || this.props?.propsNumber}
                  containerStyle={{
                    marginTop: callerName || showKeyPad ? '15%' : '25%',
                  }}
                />
              ) : (
                <View style={styles.marginTop}></View>
              )}
              {answered && this.renderCallTime()}
              {!showKeyPad ? (
                <View style={styles.marginTop}>
                  {this.renderBtns(currentCall)}
                </View>
              ) : (
                <View>
                  <PageDtmfKeypad
                    callId={id}
                    partyName={callerName}
                    hangup={hangupWithUnhold}
                    onHidePress={() => this.setState({ showKeyPad: false })}
                  ></PageDtmfKeypad>
                </View>
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
          height={
            CustomValues.iosAndroid ? Dimensions.get('window').height : '716'
          }
        />
        <VideoPlayer
          sourceObject={localVideoStreamObject}
          style={styles.localVideo}
          height={'120'}
          width={'170'}
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

  renderCallingBtns = (currentCall: Call) => {
    const actionButtonsList = this.getActionsButtonList(currentCall)

    return (
      <View
        style={{
          marginBottom: 83,
        }}
      >
        <View style={styles.btnsInnerView}>
          {actionButtonsList['mute']}
          {/* {actionButtonsList['video']} */}
          {Platform.OS !== 'web' && actionButtonsList['speaker']}
        </View>
      </View>
    )
  }

  renderHangupBtn = (currentCall: Call) => {
    const { showKeyPad } = this.state
    const { answered } = currentCall
    return (
      <View
        style={[
          styles.footerContainer,
          !answered && styles.callingScreenButtons,
        ]}
      >
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
    const { hangupWithUnhold, answered } = currentCall
    return (
      <View style={customStyles ? customStyles : styles.actionBtnContainer}>
        {!answered && this.renderCallingBtns(currentCall)}

        <CallButtons
          onPress={() => {
            if (Object.keys(currentCall).length > 0) {
              hangupWithUnhold()
            } else {
              Nav().backToPageCallRecents()
            }
          }}
          lable={''}
          Icon={DeclineButton}
        />
      </View>
    )
  }

  _proximityListener = data => {
    if (data.proximity != this.state.proximity) {
      this.setState({
        proximity: data.proximity,
      })
    }
  }

  render() {
    const currentCall: any = callStore.currentCall || {}
    const { remoteVideoEnabled, localVideoEnabled, transferring } = currentCall
    const isVideoEnabled = remoteVideoEnabled && localVideoEnabled
    console.log(Platform.OS)
    console.log(currentCall)
    if (isVideoEnabled) {
      clearTimeout(this.videoRequestTimeout)
      this.videoRequestTimeout = null
    }
    const { isLoudSpeakerEnabled } = callStore

    // if (transferring && this.state.showVideoPopup) {
    //   // alert('Transferring...')
    //   const currentCall: any = callStore.currentCall || {}
    //   const { disableVideo } = currentCall
    //   disableVideo()
    //   this.setState({ showVideoPopup: '' })
    // }

    return (
      <>
        {this.state.proximity && !isLoudSpeakerEnabled && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              zIndex: 9999,
              opacity: 0.5,
              backgroundColor: 'black',
            }}
          ></View>
        )}
        {this.renderCall(currentCall, isVideoEnabled)}
      </>
    )
  }
}

export default PageCallManage
