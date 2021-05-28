import { formatDateTimeSemantic } from 'components/chatConfig'
import styles from 'components/ChatListUsers/Styles'
import UserItem from 'components/ContactUserItem'
import { RnTouchableOpacity } from 'components/Rn'
import { observer } from 'mobx-react'
import React, { FC } from 'react'
import chatStore from 'stores/chatStore'

const ListUsers: FC<{
  recents: {
    id: string
    name: string
    group: boolean
    text: string
    unread: boolean
    created: string
  }[]
  onGroupSelect: Function
  onUserSelect: Function
  groupById: { [k: string]: object }
  userById: { [k: string]: object }
}> = ({ recents, onGroupSelect, onUserSelect, groupById, userById }) => (
  <>
    {recents.map(({ id, name, group, text, unread, created }) => (
      <RnTouchableOpacity
        key={id}
        onPress={() => (group ? onGroupSelect(id) : onUserSelect(id))} // TODO group
        style={
          (unread || chatStore.getThreadConfig(id).isUnread) && styles.unread
        }
      >
        <UserItem
          key={id}
          name={name}
          {...(group ? groupById : userById)[id]}
          lastMessage={text}
          isRecentChat
          lastMessageDate={formatDateTimeSemantic(created)}
        />
      </RnTouchableOpacity>
    ))}
  </>
)

export default observer(ListUsers)
