import { mdiCardsDiamond } from '@mdi/js'
import styles from 'components/FormInputBox/Styles'
import { RnIcon, RnText } from 'components/Rn'
import RnTextInput from 'components/RnTextInput'
import React, { FC, useEffect, useState } from 'react'
import { View } from 'react-native'
import CustomColors from 'utils/CustomColors'

const FormInputBox: FC<{
  label: string
  val: string
  onTextChange(text): void
  editable?: boolean
  required?: boolean
  showError?: boolean
}> = ({ label, val, onTextChange, editable = true, required, showError }) => {
  const [focus, setFocus] = useState(false)
  const [validationError, setValidationError] = useState(showError)

  useEffect(() => {
    setValidationError(showError)
  }, [showError])

  const onBlur = () => {
    if (required && !val) {
      setValidationError(true)
    }
    setFocus(false)
  }

  const onFocus = () => {
    setValidationError(false)
    setFocus(true)
  }

  return (
    <View>
      <View style={[styles.inputBox, focus && styles.activeView]}>
        {val ? (
          <RnText
            style={[
              styles.inputBoxLabel,
              focus && { backgroundColor: CustomColors.White },
            ]}
          >
            {label}
          </RnText>
        ) : (
          <></>
        )}
        <RnTextInput
          style={[styles.fieldTextInput, val ? { fontWeight: 'bold' } : {}]}
          value={val}
          onChangeText={(text: string) => {
            onTextChange(text)
          }}
          placeholder={label}
          placeholderTextColor={CustomColors.lightBlack}
          onFocus={onFocus}
          onBlur={onBlur}
          editable={editable}
          selectTextOnFocus={editable}
        />
      </View>
      {(validationError || showError) && (
        <View style={styles.fieldError}>
          <View style={styles.fieldErrorInner}>
            <RnIcon
              color={CustomColors.ErrorRed}
              path={mdiCardsDiamond}
              style={styles.fieldErrorIcon}
            />
            <RnText small style={styles.fieldErrorLabel}>
              {'This field is required'}
            </RnText>
          </View>
        </View>
      )}
    </View>
  )
}

export default FormInputBox
