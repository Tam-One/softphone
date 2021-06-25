import styles from 'components/CallDialledNumbers/Styles'
import { RnTextInput } from 'components/Rn'
import React, { FC, RefObject } from 'react'
import {
  Keyboard,
  NativeSyntheticEvent,
  TextInput,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native'
import intl from 'stores/intl'

const ShowNumber: FC<{
  setTarget(val: string): void
  selectionChange?(
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ): void
  refInput: RefObject<TextInput>
  value: string
}> = ({ setTarget, refInput, value, selectionChange }) => (
  <View style={styles.showNumbers}>
    <RnTextInput
      blurOnSubmit
      keyboardType='default'
      multiline
      onChangeText={setTarget}
      onEndEditing={() => {
        Keyboard.dismiss()
      }}
      onSelectionChange={selectionChange}
      placeholder={intl`Enter your number`}
      ref={refInput}
      style={styles.showNumbersDisplayText}
      value={value}
    />
  </View>
)

export default ShowNumber
