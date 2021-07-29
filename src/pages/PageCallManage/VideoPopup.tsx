import RnText from 'components/RnText'
import styles from 'pages/PageCallManage/Styles'
import React, { FC } from 'react'
import { TouchableOpacity, View } from 'react-native'
import CustomStrings from 'utils/CustomStrings'

const VideoPopup: FC<{
  header: string
  onOkPress?(): void
  showOk: boolean
  hideCancel?: boolean
  onCancel?(): void
  okText?: string
  title?: string
}> = ({ header, onOkPress, showOk, onCancel, okText, hideCancel, title }) => {
  return (
    <View style={styles.videoPopupContainer}>
      <View style={styles.videoPopupView}>
        {title ? <RnText style={styles.title}>{title}</RnText> : <></>}
        <RnText style={styles.videoPopupHeading}>{header}</RnText>
        <View style={styles.videoPopupFooter}>
          {!hideCancel && (
            <TouchableOpacity onPress={onCancel}>
              <RnText style={styles.videoPopupCancel}>
                {CustomStrings.Cancel}
              </RnText>
            </TouchableOpacity>
          )}
          {showOk && (
            <TouchableOpacity onPress={onOkPress}>
              <RnText style={styles.videoPopupSwitch}>
                {okText || CustomStrings.Switch}
              </RnText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

export default VideoPopup
