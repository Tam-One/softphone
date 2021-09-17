import { mdiPhoneIncoming, mdiPhoneMissed, mdiPhoneOutgoing } from '@mdi/js'
import Avatar from 'components/Avatar'
import styles from 'components/ContactUserItem/Styles'
import { RnIcon, RnText, RnTouchableOpacity } from 'components/Rn'
import globalVariables from 'components/variables'
import React, { FC } from 'react'
import { View } from 'react-native'
import UserAvatar from 'react-native-user-avatar'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const {
  colors: { danger, primary },
} = globalVariables

const getIconColor = (incoming, answered) => {
  if (!incoming) {
    return CustomColors.DarkAsh
  } else if (answered) {
    return primary
  } else {
    return danger
  }
}

const getIconPath = (incoming, answered) => {
  if (!incoming) {
    return mdiPhoneOutgoing
  } else if (answered) {
    return mdiPhoneIncoming
  } else {
    return mdiPhoneMissed
  }
}

const getTextColor = (incoming, answered) => {
  if (!incoming || answered) {
    return CustomColors.DarkBlue
  } else {
    return CustomColors.Red
  }
}

const isNumber = num => {
  return !isNaN(parseFloat(num)) && !isNaN(num - 0)
}

const UserItem: FC<
  Partial<{
    answered: boolean
    avatar: string
    created: string
    iconFuncs: Function[]
    icons: string[]
    id: string
    incoming: boolean
    isRecentCall: boolean
    isRecentChat: boolean
    lastMessage: string
    lastMessageDate: string
    name: string
    partyName: string
    partyNumber: string
    selected: boolean
    statusText: string
    showNewAvatar?: boolean
    hideAvatar?: boolean
    number?: string
    containerStyle?: object
    fromMissedCall?: boolean
    index?: number
    hideBorder?: boolean
    innerContainerStyle?: object
    iconsColor?: string
  }>
> = ({
  answered,
  avatar,
  created,
  iconFuncs,
  icons,
  id,
  incoming,
  isRecentCall,
  isRecentChat,
  lastMessage,
  lastMessageDate,
  name,
  partyName,
  partyNumber,
  selected,
  statusText,
  showNewAvatar,
  hideAvatar,
  number,
  containerStyle,
  fromMissedCall,
  index,
  hideBorder,
  innerContainerStyle,
  iconsColor,
}) => {
  let callerName = partyName || name || ''
  let callNumber = partyNumber || id || ''
  var userAvatarName = callerName
  if (isNumber(callerName)) {
    userAvatarName = userAvatarName?.split('').join(' ')
    callerName = ''
  }

  let callerDisplayText = ''

  if (callerName && callNumber) {
    callerDisplayText = `${callerName} (${callNumber})`
  } else {
    callerDisplayText = callerName || callNumber
  }

  const iconPath = getIconPath(incoming, answered)

  const iconColor = getIconColor(incoming, answered)

  const textColor = getTextColor(incoming, answered)
  return (
    <View
      style={[
        styles.outer,
        !hideBorder && styles.bottomBorder,
        containerStyle && containerStyle,
        index === 0 && styles.topBorder,
      ]}
    >
      <View
        style={[
          styles.inner,
          selected && styles.innerSelected,
          innerContainerStyle,
        ]}
      >
        {!hideAvatar ? (
          <View>
            {!showNewAvatar ? (
              <Avatar
                source={{ uri: avatar as string }}
                style={styles.withSpace}
              />
            ) : (
              <View style={styles.nameAvatarContainer}>
                <UserAvatar
                  style={styles.nameAvatar}
                  name={userAvatarName}
                  bgColor={CustomColors.DodgerBlue}
                />
              </View>
            )}
          </View>
        ) : (
          <></>
        )}
        <View style={[styles.text, styles.withSpace]}>
          <View style={styles.nameWithStatus}>
            <RnText black bold singleLine style={{ color: textColor }}>
              {callerDisplayText}
            </RnText>
            {statusText ? (
              <RnText normal singleLine small style={styles.status}>
                {statusText}
              </RnText>
            ) : (
              <></>
            )}
          </View>

          {!isRecentCall && lastMessage ? (
            <RnText normal singleLine small>
              {lastMessage}
            </RnText>
          ) : (
            <></>
          )}

          {!fromMissedCall && isRecentCall && !lastMessage ? (
            <View style={styles.detail}>
              <RnIcon
                color={iconColor}
                path={iconPath}
                size={CustomFonts.SmallIconFont}
                style={styles.callIcon}
              />
              <RnText normal small style={styles.callCreatedAt}>
                {created}
              </RnText>
            </View>
          ) : (
            <></>
          )}
        </View>

        {!isRecentCall && lastMessage && isRecentChat ? (
          <View style={styles.lastDate}>
            <RnText normal singleLine small>
              {lastMessageDate}
            </RnText>
          </View>
        ) : (
          <></>
        )}
        {fromMissedCall ? (
          <RnText
            normal
            small
            style={[styles.callCreatedAt, { marginRight: 11 }]}
          >
            {created}
          </RnText>
        ) : (
          <></>
        )}
        {icons?.map((icon, index) => (
          <RnTouchableOpacity key={index} onPress={() => iconFuncs?.[index]()}>
            <RnIcon path={icon} style={styles.buttonIcon} color={iconsColor} />
          </RnTouchableOpacity>
        ))}
      </View>
    </View>
  )
}
export default UserItem
