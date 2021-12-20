import { computed } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { View } from 'react-native'

import uc from '@/api/uc'
import UserItem from '@/components/ContactUserItem'
import Field from '@/components/Field'
import Layout from '@/components/Layout'
import { RnText, RnTouchableOpacity } from '@/components/Rn'
import styles from '@/pages/PageChatGroupInvite/Styles'
import chatStore from '@/stores/chatStore'
import contactStore from '@/stores/contactStore'
import intl, { intlDebug } from '@/stores/intl'
import Nav from '@/stores/Nav'
import RnAlert from '@/stores/RnAlert'

@observer
class PageChatGroupInvite extends React.Component<{
  groupId: string
}> {
  @computed get buddyIds() {
    return contactStore.ucUsers.map(u => u.id).filter(this.isNotMember)
  }
  state = {
    selectedBuddy: {} as { [k: string]: boolean },
  }

  render() {
    return (
      <Layout onBack={this.back} title={intl`Inviting Group Member`}>
        <View style={styles.pageChatGroupInviteOuter}>
          <RnText style={styles.pageChatGroupInviteGroupName}>
            {chatStore.getGroup(this.props.groupId).name}
          </RnText>
          <RnTouchableOpacity
            onPress={this.invite}
            style={styles.pageChatGroupInviteBtnSave}
          >
            <RnText
              style={styles.pageChatGroupInviteBtnText}
            >{intl`Invite`}</RnText>
          </RnTouchableOpacity>
          <RnText
            style={styles.pageChatGroupInviteText}
          >{intl`Members`}</RnText>
        </View>
        <Field isGroup />
        {this.buddyIds.map((id, i) => (
          <RnTouchableOpacity key={i} onPress={() => this.toggleBuddy(id)}>
            <UserItem
              key={id}
              {...this.resolveBuddy(id)}
              selected={this.state.selectedBuddy[id]}
            />
          </RnTouchableOpacity>
        ))}
      </Layout>
    )
  }

  isNotMember = (buddy: string) =>
    !chatStore.getGroup(this.props.groupId).members?.includes(buddy)
  resolveBuddy = (buddy: string) => contactStore.getUCUser(buddy)
  toggleBuddy = (buddy: string) => {
    let { selectedBuddy } = this.state
    selectedBuddy = {
      ...selectedBuddy,
      [buddy]: !selectedBuddy[buddy],
    }
    this.setState({
      selectedBuddy,
    })
  }

  invite = () => {
    const { selectedBuddy } = this.state
    const members = Object.keys(selectedBuddy)
    if (!members.length) {
      RnAlert.error({
        message: intlDebug`No buddy selected`,
      })
      return
    }
    uc.inviteChatGroupMembers(this.props.groupId, members)
      .catch(this.onInviteFailure)
      .then(this.back)
  }
  onInviteFailure = (err: Error) => {
    RnAlert.error({
      message: intlDebug`Failed to invite group chat`,
      err,
    })
  }
  back = () => {
    Nav().backToPageChatGroupDetail({ groupId: this.props.groupId })
  }
}

export default PageChatGroupInvite
