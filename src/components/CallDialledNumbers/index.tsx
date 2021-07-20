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

const ShowNumber: FC<{
  setTarget(val: string): void
  selectionChange?(
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ): void
  refInput: RefObject<TextInput>
  value: string
  hidePlaceholder?: boolean
  customStyle?: object
}> = ({
  setTarget,
  refInput,
  value,
  selectionChange,
  hidePlaceholder,
  customStyle,
}) => {
  const placeHolder = !hidePlaceholder ? 'Enter your number' : ''
  return (
    <View style={styles.showNumbers}>
      <RnTextInput
        blurOnSubmit
        editable={false}
        disabled={true}
        keyboardType='default'
        multiline
        onChangeText={setTarget}
        onEndEditing={() => {
          Keyboard.dismiss()
        }}
        onSelectionChange={selectionChange}
        placeholder={placeHolder}
        ref={refInput}
        style={[styles.showNumbersDisplayText, customStyle]}
        value={value}
      />
    </View>
  )
}

export default ShowNumber
