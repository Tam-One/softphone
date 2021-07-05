import styles from 'components/FormInputBox/Styles'
import { RnText } from 'components/Rn'
import RnTextInput from 'components/RnTextInput'
import React, { FC, useState } from 'react'
import { View } from 'react-native'
import CustomColors from 'utils/CustomColors'

const FormInputBox: FC<{
  label: string
  val: string
  onTextChange(text): void
  editable?: boolean
}> = ({ label, val, onTextChange, editable = true }) => {
  const [focus, setFocus] = useState(false)
  return (
    <View style={[styles.inputBox, focus && styles.activeView]}>
      {!!val && (
        <RnText
          style={[
            styles.inputBoxLabel,
            focus && { backgroundColor: CustomColors.White },
          ]}
        >
          {label}
        </RnText>
      )}
      <RnTextInput
        style={[styles.fieldTextInput, !!val && { fontWeight: '600' }]}
        value={val}
        onChangeText={(text: string) => {
          onTextChange(text)
        }}
        placeholder={label}
        placeholderTextColor={CustomColors.lightBlack}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        editable={editable}
        selectTextOnFocus={editable}
      />
    </View>
  )
}

export default FormInputBox
