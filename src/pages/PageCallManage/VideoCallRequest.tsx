import styles from 'pages/PageCallManage/Styles'
import React, { FC, useEffect, useState } from 'react'
import { View } from 'react-native'
import callStore from 'stores/callStore'
import CustomStrings from 'utils/CustomStrings'

import VideoPopup from './VideoPopup'

const VideoCallRequest: FC<{
  showVideo?: string
  setShowVideo?(key: any): void
  videoCallOn?(): void
}> = ({ showVideo, setShowVideo, videoCallOn }) => {
  const waitingTimer = 300000
  const requestTimer = 2000000
  let videoRequestTimeout
  const [showVideoPopup, setShowVideoPopup] = useState(showVideo)
  const [responseMessage, setResponseMessage] = useState('')

  useEffect(() => {
    setShowVideoPopup(showVideo)
  }, [showVideo])

  useEffect(() => {
    if (setShowVideo) {
      setShowVideo(showVideoPopup)
    }
  }, [showVideoPopup])

  const onVideoCallSwitch = currentCall => {
    if (videoCallOn) {
      videoCallOn()
    }
    const { enableVideo, disableVideo } = currentCall
    enableVideo()
    setShowVideoPopup('')
    videoRequestTimeout = setTimeout(() => {
      disableVideo()
      setResponseMessage(CustomStrings.NoResponse)
      setTimeout(() => {
        setResponseMessage('')
      }, waitingTimer)
    }, requestTimer)
  }

  const currentCall: any = callStore.currentCall || {}
  const {
    enableVideo,
    localVideoEnabled,
    remoteVideoEnabled,
    disableVideo,
    bVisible,
    incoming,
    answered,
  } = currentCall

  if (videoRequestTimeout && !localVideoEnabled) {
    clearTimeout(videoRequestTimeout)
    videoRequestTimeout = null
    setResponseMessage(CustomStrings.RequestDeclined)
    setTimeout(() => {
      setResponseMessage('')
    }, waitingTimer)
  }

  if (!answered) {
    return null
  }

  return (
    <View style={styles.videoCallPopupContainer}>
      {showVideoPopup === CustomStrings.Request ? (
        <VideoPopup
          header={CustomStrings.SwitchToVideo}
          showOk={true}
          onOkPress={() => onVideoCallSwitch(currentCall)}
          onCancel={() => setShowVideoPopup('')}
        ></VideoPopup>
      ) : (
        <></>
      )}

      {localVideoEnabled && !remoteVideoEnabled ? (
        <>
          <VideoPopup
            header={CustomStrings.WaitingForRequest}
            showOk={false}
            onCancel={() => {
              clearTimeout(videoRequestTimeout)
              videoRequestTimeout = null
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
            header={CustomStrings.RequestToSwitchVideo}
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
            onCancel={() => setResponseMessage('')}
          ></VideoPopup>
        </>
      ) : (
        <></>
      )}
    </View>
  )
}

export default VideoCallRequest
