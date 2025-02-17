import { computed } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native'
import EmojiSelector, { Categories } from 'react-native-emoji-selector'

import uc from '@/api/uc'
import { numberOfChatsPerLoad } from '@/components/chatConfig'
import MessageList from '@/components/ChatMessageList'
import ChatInput from '@/components/FooterChatInput'
import Layout from '@/components/Layout'
import { RnText, RnTouchableOpacity } from '@/components/Rn'
import styles from '@/pages/PageChatDetail/Styles'
import chatStore, { ChatMessage } from '@/stores/chatStore'
import contactStore from '@/stores/contactStore'
import intl, { intlDebug } from '@/stores/intl'
import Nav from '@/stores/Nav'
import RnAlert from '@/stores/RnAlert'
import pickFile from '@/utils/pickFile'
import saveBlob from '@/utils/saveBlob'
import { arrToMap } from '@/utils/toMap'

@observer
class PageChatDetail extends React.Component<{
  buddy: string
}> {
  @computed get chatIds() {
    return (chatStore.messagesByThreadId[this.props.buddy] || []).map(m => m.id)
  }
  @computed get chatById() {
    return arrToMap(
      chatStore.messagesByThreadId[this.props.buddy] || [],
      'id',
      (m: ChatMessage) => m,
    ) as { [k: string]: ChatMessage }
  }
  state = {
    loadingRecent: false,
    loadingMore: false,
    editingText: '',
    blobFile: {
      url: '',
      fileType: '',
    },
    emojiTurnOn: false,
  }
  numberOfChatsPerLoadMore = numberOfChatsPerLoad
  edittingTextEmoji = ''
  editingTextReplace = false

  componentDidMount() {
    const noChat = !this.chatIds.length
    if (noChat) {
      this.loadRecent()
    } else {
      window.setTimeout(this.onContentSizeChange, 170)
    }
    const { buddy: id } = this.props
    chatStore.updateThreadConfig(id, false, {
      isUnread: false,
    })
  }
  componentDidUpdate() {
    const { buddy: id } = this.props
    if (chatStore.getThreadConfig(id).isUnread) {
      chatStore.updateThreadConfig(id, false, {
        isUnread: false,
      })
    }
  }

  renderChatInput = () => {
    return (
      <ChatInput
        onEmojiTurnOn={() =>
          this.setState({ emojiTurnOn: !this.state.emojiTurnOn })
        }
        onSelectionChange={this.onSelectionChange}
        onTextChange={this.setEditingText}
        onTextSubmit={this.submitEditingText}
        openFileRnPicker={() => pickFile(this.sendFile)}
        text={this.state.editingText}
      />
    )
  }

  render() {
    const { buddy: id } = this.props
    const u = contactStore.getUCUser(id)
    const { allMessagesLoaded } = chatStore.getThreadConfig(id)
    const { loadingMore, loadingRecent } = this.state
    return (
      <Layout
        compact
        containerOnContentSizeChange={this.onContentSizeChange}
        containerOnScroll={this.onScroll}
        containerRef={this.setViewRef}
        fabRender={this.renderChatInput}
        onBack={Nav().backToPageChatRecents}
        title={u?.name}
      >
        {loadingRecent ? (
          <RnText style={styles.loadMore}>{intl`Loading...`}</RnText>
        ) : allMessagesLoaded ? (
          <RnText center style={[styles.loadMore, styles.loadMoreFinished]}>
            {this.chatIds.length === 0
              ? intl`There's currently no message in this thread`
              : intl`All messages in this thread have been loaded`}
          </RnText>
        ) : (
          <RnTouchableOpacity
            onPress={loadingMore ? undefined : () => this.loadMore()}
          >
            <RnText
              bold={!loadingMore}
              style={[styles.loadMore, !loadingMore && styles.loadMoreBtn]}
            >
              {loadingMore ? intl`Loading...` : intl`Load more messages`}
            </RnText>
          </RnTouchableOpacity>
        )}
        <MessageList
          acceptFile={this.acceptFile}
          list={chatStore.messagesByThreadId[this.props.buddy]}
          loadMore={this.loadMore}
          rejectFile={this.rejectFile}
          resolveChat={this.resolveChat}
        />
        {this.state.emojiTurnOn && (
          <View>
            <EmojiSelector
              category={Categories.emotion}
              columns={10}
              onEmojiSelected={emoji => this.emojiSelectFunc(emoji)}
              showHistory={true}
              showSearchBar={true}
              showSectionTitles={true}
              showTabs={true}
            />
          </View>
        )}
      </Layout>
    )
  }

  onSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => {
    const selection = event.nativeEvent.selection
    this.editingTextReplace = false
    if (selection.start !== selection.end) {
      this.edittingTextEmoji = this.state.editingText.substring(
        selection.start,
        selection.end,
      )
      this.editingTextReplace = true
    } else {
      this.edittingTextEmoji = this.state.editingText.substring(
        0,
        selection.start,
      )
    }
  }
  emojiSelectFunc = (emoji: string) => {
    let newText = this.edittingTextEmoji.concat(emoji)
    if (this.state.editingText === '') {
      this.setState({ editingText: emoji })
      this.edittingTextEmoji = emoji
    } else {
      if (!this.editingTextReplace) {
        this.setState({
          editingText: this.state.editingText.replace(
            this.edittingTextEmoji,
            newText,
          ),
        })
        this.edittingTextEmoji = this.edittingTextEmoji.concat(emoji)
      } else {
        this.setState({
          editingText: this.state.editingText.replace(
            this.edittingTextEmoji,
            emoji,
          ),
        })
        this.editingTextReplace = false
        this.edittingTextEmoji = emoji
      }
    }
  }

  view?: ScrollView
  setViewRef = (ref: ScrollView) => {
    this.view = ref
  }
  _justMounted = true
  _closeToBottom = true
  onContentSizeChange = () => {
    if (!this.view) {
      return
    }
    if (this._closeToBottom) {
      this.view?.scrollToEnd({
        animated: !this._justMounted,
      })
      if (this._justMounted) {
        this._justMounted = false
      }
    }
  }
  onScroll = (ev: NativeSyntheticEvent<NativeScrollEvent>) => {
    const layoutSize = ev.nativeEvent.layoutMeasurement
    const layoutHeight = layoutSize.height
    const contentOffset = ev.nativeEvent.contentOffset
    const contentSize = ev.nativeEvent.contentSize
    const contentHeight = contentSize.height
    const paddingToBottom = 20
    this._closeToBottom =
      layoutHeight + contentOffset.y >= contentHeight - paddingToBottom
  }
  resolveChat = (id: string) => {
    const chat = this.chatById[id] as ChatMessage
    const file = chatStore.filesMap[chat.file || '']
    const text = chat.text
    const creator = this.resolveCreator(chat.creator)
    return {
      id,
      creatorId: creator.id,
      creatorName: creator.name || creator.id,
      creatorAvatar: creator.avatar,
      text,
      type: chat.type,
      file,
      created: chat.created,
      createdByMe: creator.id === this.me.id,
    }
  }
  me = uc.me()
  resolveCreator = (creator: string) => {
    if (creator === this.me.id) {
      return this.me
    }
    return contactStore.getUCUser(creator) || {}
  }
  loadRecent = () => {
    this.setState({ loadingRecent: true })
    const { buddy: id } = this.props
    uc.getBuddyChats(id, {
      max: numberOfChatsPerLoad,
    })
      .then(chats => {
        chatStore.pushMessages(id, chats)
        window.setTimeout(this.onContentSizeChange, 170)
      })
      .catch((err: Error) => {
        RnAlert.error({
          message: intlDebug`Failed to get recent chats`,
          err,
        })
      })
      .then(() => {
        this.setState({ loadingRecent: false })
      })
  }

  loadMore = () => {
    this.setState({ loadingMore: true })
    this.numberOfChatsPerLoadMore =
      this.numberOfChatsPerLoadMore + numberOfChatsPerLoad
    const oldestChat = (this.chatById[this.chatIds[0]] || {}) as ChatMessage
    const oldestCreated = oldestChat.created || 0
    const max = this.numberOfChatsPerLoadMore
    const end = oldestCreated
    const query = { max, end }
    const { buddy: id } = this.props
    uc.getBuddyChats(id, query)
      .then(chats => {
        chatStore.pushMessages(id, chats)
      })
      .catch((err: Error) => {
        RnAlert.error({
          message: intlDebug`Failed to get more chats`,
          err,
        })
      })
      .then(() => {
        this.setState({ loadingMore: false })
      })
      .then(() => {
        const { buddy: id } = this.props
        const totalChatLoaded = chatStore.messagesByThreadId[id]?.length || 0
        if (totalChatLoaded < this.numberOfChatsPerLoadMore) {
          chatStore.updateThreadConfig(id, false, {
            allMessagesLoaded: true,
          })
        }
      })
  }

  setEditingText = (editingText: string) => {
    this.setState({ editingText })
  }
  submitting = false
  submitEditingText = () => {
    const txt = this.state.editingText.trim()
    if (!txt || this.submitting) {
      return
    }
    this.submitting = true
    //
    uc.sendBuddyChatText(this.props.buddy, txt)
      .then(this.onSubmitEditingTextSuccess)
      .catch(this.onSubmitEditingTextFailure)
      .then(() => {
        this.submitting = false
      })
  }
  onSubmitEditingTextSuccess = (chat: unknown) => {
    chatStore.pushMessages(this.props.buddy, chat as ChatMessage)
    this.setState({ editingText: '' })
  }
  onSubmitEditingTextFailure = (err: Error) => {
    RnAlert.error({
      message: intlDebug`Failed to send the message`,
      err,
    })
  }
  acceptFile = (file: { id: string; name: string }) => {
    uc.acceptFile(file.id)
      .then(blob => this.onAcceptFileSuccess(blob as Blob, file))
      .catch(this.onAcceptFileFailure)
  }

  onAcceptFileSuccess = (blob: Blob, file: { id: string; name: string }) => {
    const type = ['PNG', 'JPG', 'JPEG', 'GIF']
    const fileType = type.includes(
      file.name.split('.').pop()?.toUpperCase() || '',
    )
      ? 'image'
      : 'other'
    const reader = new FileReader()
    reader.onload = async event => {
      const url = event.target?.result
      Object.assign(chatStore.filesMap[file.id], {
        url: url,
        fileType: fileType,
      })
    }

    reader.readAsDataURL(blob)

    saveBlob(blob, file.name)
  }
  onAcceptFileFailure = (err: Error) => {
    RnAlert.error({
      message: intlDebug`Failed to accept file`,
      err,
    })
  }
  rejectFile = (file: object) => {
    uc.rejectFile(file).catch(this.onRejectFileFailure)
  }
  onRejectFileFailure = (err: Error) => {
    RnAlert.error({
      message: intlDebug`Failed to reject file`,
      err,
    })
  }

  readFile = (file: { type: string; name: string; uri: string }) => {
    if (Platform.OS === 'web') {
      const reader = new FileReader()

      const fileType = file.type ? file.type.split('/')[0] : ''
      reader.onload = async event => {
        const url = event.target?.result
        this.setState({ blobFile: { url: url, fileType: fileType } })
      }
      reader.readAsDataURL((file as unknown) as Blob)
    } else {
      const type = ['PNG', 'JPG', 'JPEG', 'GIF']
      const fileType = type.includes(
        file.name.split('.').pop()?.toUpperCase() || '',
      )
        ? 'image'
        : 'other'
      this.setState({ blobFile: { url: file.uri, fileType: fileType } })
    }
  }

  sendFile = (file: { type: string; name: string; uri: string }) => {
    this.readFile(file)
    const u = contactStore.getUCUser(this.props.buddy)
    uc.sendFile(u?.id, (file as unknown) as Blob)
      .then(res => {
        const buddyId = this.props.buddy
        Object.assign(res.file, this.state.blobFile)
        chatStore.upsertFile(res.file)
        chatStore.pushMessages(buddyId, res.chat)
      })
      .catch((err: Error) => {
        RnAlert.error({
          message: intlDebug`Failed to send file`,
          err,
        })
      })
  }
}

export default PageChatDetail
