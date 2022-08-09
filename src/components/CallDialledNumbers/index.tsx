import React, { FC, RefObject, useState } from 'react'
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
  const placehold = !hidePlaceholder ? 'Enter phone number' : ''
  const [placeHolder, setPlaceHolder] = useState(placehold)
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
        onFocus={() => {
          setPlaceHolder('')
        }}
        onBlur={() => {
          setTimeout(() => {
            setPlaceHolder(placehold)
          }, 200)
        }}
      />
    </View>
  )
}

export default ShowNumber
