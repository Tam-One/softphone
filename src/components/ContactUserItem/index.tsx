import { mdiPhoneIncoming, mdiPhoneMissed, mdiPhoneOutgoing } from '@mdi/js'
import Avatar from 'components/Avatar'
import styles from 'components/ContactUserItem/Styles'
import { RnIcon, RnText, RnTouchableOpacity } from 'components/Rn'
import g from 'components/variables'
import React, { FC } from 'react'
import { View } from 'react-native'
import UserAvatar from 'react-native-user-avatar'
import intl from 'stores/intl'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

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
    number?: string
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
  number,
}) => {
  var userAvatarName = name

  if (name === number) {
    userAvatarName = userAvatarName?.split('').join(' ')
  }
  const iconPath =
    incoming && !answered
      ? mdiPhoneMissed
      : incoming && answered
      ? mdiPhoneIncoming
      : mdiPhoneOutgoing

  const iconColor =
    incoming && !answered
      ? g.colors.danger
      : incoming && answered
      ? g.colors.primary
      : g.colors.warning

  return (
    <View style={styles.outer}>
      <View style={[styles.inner, selected && styles.innerSelected]}>
        {!showNewAvatar && (
          <Avatar source={{ uri: avatar as string }} style={styles.withSpace} />
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
        <View style={[styles.text, styles.withSpace]}>
          <View style={styles.nameWithStatus}>
            <RnText black bold singleLine>
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
          {isRecentCall && !lastMessage && (
            <View style={styles.detail}>
              <RnIcon
                color={iconColor}
                path={iconPath}
                size={CustomFonts.SmallIconFont}
                style={styles.callIcon}
              />
              <RnText normal small style={styles.callCreatedAt}>
                {intl`at`} {created}
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
        {icons?.map((v, i) => (
          <RnTouchableOpacity key={i} onPress={() => iconFuncs?.[i]()}>
            <RnIcon path={v} style={styles.buttonIcon} />
          </RnTouchableOpacity>
        ))}
      </View>
    </View>
  )
}
export default UserItem
