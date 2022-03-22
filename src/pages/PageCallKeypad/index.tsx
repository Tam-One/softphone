import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import {
  NativeSyntheticEvent,
  ScrollView,
  TextInput,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native'

import ShowNumber from '@/components/CallDialledNumbers'
import KeyPad from '@/components/CallKeyPad'
import CustomLayout from '@/components/CustomLayout'
import styles from '@/pages/PageCallKeypad/Styles'
import { getAuthStore } from '@/stores/authStore'
import callStore from '@/stores/callStore'
import { intlDebug } from '@/stores/intl'
import RnAlert from '@/stores/RnAlert'
import RnKeyboard from '@/stores/RnKeyboard'

@observer
class PageCallKeypad extends React.Component {
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
  callVoice = () => {
    this.text = this.text.trim()
    if (!this.text) {
      RnAlert.error({
        message: intlDebug`No target to call`,
      })
      return
    }
    const { pbxUsername } = getAuthStore().currentProfile || {}

    if (this.text === pbxUsername) {
      RnAlert.dismiss()
      RnAlert.error({
        message: intlDebug`Self dial is not allowed`,
      })
      return
    }
    callStore.startCall(this.text)
    setTimeout(() => {
      this.onNumberPress('-1')
    }, 100)
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
    const { end, start } = this.textSelection
    let min = Math.min(start, end)
    let max = Math.max(start, end)
    const isDelete = val === ''
    if (isDelete && start === end && start) {
      min = min - 1
    }
    if (val === '-1') {
      min = 0
      this.text = ''
    } else {
      // Update text to trigger render
      this.text = this.text.substring(0, min) + val + this.text.substring(max)
      //
    }
    const textSelection = min + (isDelete ? 0 : 1)
    this.textSelection.start = textSelection
    this.textSelection.end = textSelection
  }

  render() {
    return (
      <CustomLayout menu='keys' subMenu='keypad'>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewContainer}
        >
          <ShowNumber
            refInput={this.textRef}
            selectionChange={this.onSelectionChange}
            setTarget={(val: string) => {
              this.text = val
            }}
            value={this.text}
          />
          <View style={styles.keyPadContainer}>
            {!RnKeyboard.isKeyboardShowing && (
              <KeyPad
                callVoice={this.callVoice}
                onPressNumber={this.onNumberPress}
                showKeyboard={this.showKeyboard}
              />
            )}
          </View>
        </ScrollView>
      </CustomLayout>
    )
  }
}

export default PageCallKeypad
