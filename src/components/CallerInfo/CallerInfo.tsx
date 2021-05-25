import styles from 'components/CallerInfo/Styles'
import { RnText } from 'components/Rn'
import React, { FC } from 'react'
import { Image, TouchableOpacityProps, View } from 'react-native'
import UserAvatar from 'react-native-user-avatar'
import CustomColors from 'utils/CustomColors'
import CustomImages from 'utils/CustomImages'

const CallerInfo: FC<{
  isUserCalling: boolean
  callerName: string
  callerNumber: string
  containerStyle?: TouchableOpacityProps['style']
}> = p => {
  const { isUserCalling, callerName, callerNumber, containerStyle } = p
  return (
    <View style={[styles.notifyInfo, containerStyle]}>
      {!!callerName && (
        <>
          <UserAvatar
            size={66}
            name={callerName}
            bgColor={CustomColors.DodgerBlue}
          />
          <RnText style={styles.callerName}>{callerName}</RnText>
        </>
      )}

      {!isUserCalling && !!callerNumber && (
        <View style={styles.notifyContainer}>
          <Image
            source={CustomImages.CountryFlagLogo}
            style={styles.flagLogo}
          />
          <RnText style={styles.mobileNumber}>{callerNumber}</RnText>
        </View>
      )}

      {!!isUserCalling && (
        <RnText style={styles.userNumber}>{callerNumber}</RnText>
      )}
      {/* Commented for future use */}
      {/* <RnText>
            {c.remoteVideoEnabled
              ? intl`Incoming video call`
              : intl`Incoming audio call`}
          </RnText> */}
    </View>
  )
}

export default CallerInfo
