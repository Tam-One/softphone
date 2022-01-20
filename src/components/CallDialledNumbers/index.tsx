import React, { FC, RefObject } from 'react'
import {
  Keyboard,
  NativeSyntheticEvent,
  TextInput,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native'

import styles from '@/components/CallDialledNumbers/Styles'
import { RnTextInput } from '@/components/Rn'
import CustomValues from '@/utils/CustomValues'

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
  const placeHolder = !hidePlaceholder ? 'Enter phone number' : ''
  return (
    <View style={styles.showNumbers}>
      <RnTextInput
        blurOnSubmit
        editable={!CustomValues.iosAndroid}
        disabled={CustomValues.iosAndroid}
        keyboardType='default'
        multiline
        onChangeText={val => {
          setTarget(val)
        }}
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
