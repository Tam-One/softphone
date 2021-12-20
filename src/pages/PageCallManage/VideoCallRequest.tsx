import React, { FC, useEffect, useState } from 'react'
import { View } from 'react-native'

import styles from '@/pages/PageCallManage/Styles'
import callStore from '@/stores/callStore'
import CustomStrings from '@/utils/CustomStrings'

import VideoPopup from './VideoPopup'

const VideoCallRequest: FC<{
  showVideo?: string
  setShowVideo?(key: any): void
  videoCallOn?(): void
  onVideoCallSwitch?(): void
  responseMessage?: string
  setResponseMessage?(msg: string): void
}> = ({
  showVideo,
  setShowVideo,
  videoCallOn,
  onVideoCallSwitch,
  responseMessage,
  setResponseMessage,
}) => {
  const waitingTimer = 3000
  const requestTimer = 20000
  let videoRequestTimeout
  const [showVideoPopup, setShowVideoPopup] = useState(showVideo)

  useEffect(() => {
    setShowVideoPopup(showVideo)
  }, [showVideo])

  useEffect(() => {
    if (setShowVideo) {
      setShowVideo(showVideoPopup)
    }
  }, [showVideoPopup])

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

  if (!answered) {
    return null
  }

  return (
    <>
      {showVideoPopup === CustomStrings.Request ? (
        <View style={styles.videoCallPopupContainer}>
          <VideoPopup
            header={CustomStrings.SwitchToVideo}
            showOk={true}
            onOkPress={() => (onVideoCallSwitch ? onVideoCallSwitch() : null)}
            onCancel={() => setShowVideoPopup('')}
          ></VideoPopup>
        </View>
      ) : (
        <></>
      )}

      {localVideoEnabled && !remoteVideoEnabled ? (
        <View style={styles.videoCallPopupContainer}>
          <VideoPopup
            header={CustomStrings.WaitingForRequest}
            showOk={false}
            onCancel={() => {
              clearTimeout(videoRequestTimeout)
              videoRequestTimeout = null
              disableVideo()
            }}
          ></VideoPopup>
        </View>
      ) : (
        <></>
      )}

      {!localVideoEnabled && remoteVideoEnabled ? (
        <View style={styles.videoCallPopupContainer}>
          <VideoPopup
            header={CustomStrings.RequestToSwitchVideo}
            showOk={true}
            onOkPress={() => {
              if (videoCallOn) {
                videoCallOn()
              }
              enableVideo()
            }}
            onCancel={() => disableVideo(true)}
          ></VideoPopup>
        </View>
      ) : (
        <></>
      )}

      {responseMessage ? (
        <View style={styles.videoCallPopupContainer}>
          <VideoPopup
            header={responseMessage}
            showOk={false}
            onCancel={() =>
              setResponseMessage ? setResponseMessage('') : null
            }
          ></VideoPopup>
        </View>
      ) : (
        <></>
      )}
    </>
  )
}

export default VideoCallRequest
