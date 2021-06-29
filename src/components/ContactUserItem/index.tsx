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
    partyNumber: string
    selected: boolean
    statusText: string
    showNewAvatar?: boolean
    hideAvatar?: boolean
    number?: string
    containerStyle?: object
    fromMissedCall?: boolean
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
  partyNumber,
  selected,
  statusText,
  showNewAvatar,
  hideAvatar,
  number,
  containerStyle,
  fromMissedCall,
}) => {
  var userAvatarName = name

  if (name === number) {
    userAvatarName = userAvatarName?.split('').join(' ')
  }
  const iconPath = getIconPath(incoming, answered)

  const iconColor = getIconColor(incoming, answered)

  const textColor = getTextColor(incoming, answered)

  return (
    <View style={[styles.outer, containerStyle && containerStyle]}>
      <View style={[styles.inner, selected && styles.innerSelected]}>
        {!hideAvatar && (
          <View>
            {!showNewAvatar && (
              <Avatar
                source={{ uri: avatar as string }}
                style={styles.withSpace}
              />
            )}
            {!!showNewAvatar && (
              <View style={styles.nameAvatarContainer}>
                <UserAvatar
                  style={styles.nameAvatar}
                  name={userAvatarName}
                  bgColor={CustomColors.DodgerBlue}
                />
              </View>
            )}
          </View>
        )}
        <View style={[styles.text, styles.withSpace]}>
          <View style={styles.nameWithStatus}>
            <RnText black bold singleLine style={{ color: textColor }}>
              {name || partyNumber || id}
            </RnText>
            {!!statusText && (
              <RnText normal singleLine small style={styles.status}>
                {statusText}
              </RnText>
            )}
          </View>
          {!isRecentCall && !!lastMessage && (
            <RnText normal singleLine small>
              {lastMessage}
            </RnText>
          )}
          {!fromMissedCall && isRecentCall && !lastMessage && (
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
          )}
        </View>
        {!isRecentCall && !!lastMessage && isRecentChat && (
          <View style={styles.lastDate}>
            <RnText normal singleLine small>
              {lastMessageDate}
            </RnText>
          </View>
        )}
        {!!fromMissedCall && (
          <RnText
            normal
            small
            style={[styles.callCreatedAt, { marginRight: 11 }]}
          >
            {created}
          </RnText>
        )}
        {icons?.map((icon, index) => (
          <RnTouchableOpacity key={index} onPress={() => iconFuncs?.[index]()}>
            <RnIcon path={icon} style={styles.buttonIcon} />
          </RnTouchableOpacity>
        ))}
      </View>
    </View>
  )
}
export default UserItem
