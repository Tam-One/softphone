import styles from 'components/CallerInfo/Styles'
import { RnText } from 'components/Rn'
import React, { FC } from 'react'
import { Image, TouchableOpacityProps, View } from 'react-native'
import UserAvatar from 'react-native-user-avatar'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'
import CustomImages from 'utils/CustomImages'

const CallerInfo: FC<{
  isUserCalling: boolean
  callerName: string
  callerNumber: string
  containerStyle?: TouchableOpacityProps['style']
}> = ({ isUserCalling, callerName, callerNumber, containerStyle }) => {
  let userAvatarName = callerName
  if (callerName === callerNumber) {
    userAvatarName = userAvatarName?.split('').join(' ')
  }
  return (
    <View style={[styles.notifyInfo, containerStyle]}>
      {!!callerName && (
        <>
          <UserAvatar
            size={CustomFonts.AvatarSize}
            name={userAvatarName}
            bgColor={CustomColors.DodgerBlue}
          />
          {callerName !== callerNumber && (
            <RnText style={styles.callerName}>{callerName}</RnText>
          )}
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
