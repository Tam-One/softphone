import sip from 'api/sip'
import ShowNumber from 'components/CallDialledNumbers'
import KeyPad from 'components/CallKeyPad'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputSelectionChangeEventData,
} from 'react-native'
import { getAuthStore } from 'stores/authStore'
import callStore from 'stores/callStore'
import intl, { intlDebug } from 'stores/intl'
import Nav from 'stores/Nav'
import RnAlert from 'stores/RnAlert'
import RnKeyboard from 'stores/RnKeyboard'

@observer
class PageDtmfKeypad extends React.Component<{
  callId: string
  partyName: string
  hangup(): void
  onHidePress(): void
}> {
  @observable text = ''
  textRef = React.createRef<TextInput>()
  textSelection = { start: 0, end: 0 }

  showKeyboard = () => {
    const {
      current: { focus },
    }: any = this.textRef

    if (focus) {
      focus()
    }
  }

  sendKey = (key: string) => {
    const { calls } = callStore
    const { callId } = this.props
    const call = calls.find(call => call.id === callId)
    const { pbxTenant, pbxTalkerId, partyNumber }: any = call || {}
    const { currentProfile } = getAuthStore() || {}
    sip.sendDTMF({
      signal: key,
      sessionId: callId,
      tenant: pbxTenant || currentProfile?.pbxTenant,
      talkerId: pbxTalkerId || partyNumber || partyNumber || '',
    })
  }

  callVoice = () => {
    this.text = this.text.trim()
    if (!this.text) {
      RnAlert.error({
        message: intlDebug`No target`,
      })
      return
    }
    sip.createSession(this.text, {
      videoEnabled: false,
    })
    Nav().goToPageCallManage()
  }

  onSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => {
    if (RnKeyboard.isKeyboardShowing) {
      return
    }
    const {
      nativeEvent: {
        selection: { start, end },
      },
    } = event

    Object.assign(this.textSelection, {
      start: start,
      end: end,
    })
  }

  onNumberPress = val => {
    this.sendKey(val)
    const { end, start } = this.textSelection
    let min = Math.min(start, end)
    let max = Math.max(start, end)
    const isDelete = val === ''
    if (isDelete) {
      if (start === end && start) {
        min = min - 1
      }
    }
    // Update text to trigger render
    this.text = this.text.substring(0, min) + val + this.text.substring(max)
    //
    const textSelection = min + (isDelete ? 0 : 1)
    this.textSelection.start = textSelection
    this.textSelection.end = textSelection
  }

  render() {
    const { partyName, hangup, onHidePress } = this.props
    return (
      <>
        <ShowNumber
          refInput={this.textRef}
          selectionChange={this.onSelectionChange}
          setTarget={(val: string) => {
            this.text = val
          }}
          value={this.text}
          hidePlaceholder={true}
        />
        {!RnKeyboard.isKeyboardShowing ? (
          <KeyPad
            callVoice={this.callVoice}
            onPressNumber={this.onNumberPress}
            showKeyboard={this.showKeyboard}
            duringCall={true}
            hangup={hangup}
            onHidePress={onHidePress}
          />
        ) : (
          <> </>
        )}
      </>
    )
  }
}

export default PageDtmfKeypad
