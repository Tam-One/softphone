import { mdiCardsDiamond } from '@mdi/js'
import styles from 'components/FormInputBox/Styles'
import { RnIcon, RnText } from 'components/Rn'
import RnTextInput from 'components/RnTextInput'
import React, { FC, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SvgXml } from 'react-native-svg'
import CustomColors from 'utils/CustomColors'

const FormInputBox: FC<{
  label: string
  val: string
  onTextChange(text): void
  editable?: boolean
  required?: boolean
  showError?: boolean
  icon?: string
  containerStyle?: object
  iconStyle?: object
  secureEntry?: boolean
  rightIcon?: string
  rightIconOnClick?(): void
}> = ({
  label,
  val,
  onTextChange,
  editable = true,
  required,
  showError,
  icon,
  containerStyle,
  iconStyle,
  secureEntry,
  rightIcon,
  rightIconOnClick,
}) => {
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
    <View style={containerStyle}>
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
        <View style={{ paddingLeft: 12 }}>
          {icon ? (
            <SvgXml
              width='22'
              height='30'
              xml={icon}
              fill={CustomColors.SVGBlack}
              fillOpacity={1}
              style={iconStyle}
            />
          ) : (
            <></>
          )}
        </View>
        <RnTextInput
          style={[
            styles.fieldTextInput,
            val ? { fontFamily: 'Roboto-Bold' } : {},
          ]}
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
          secureTextEntry={secureEntry}
        />
        {rightIcon ? (
          <TouchableOpacity
            style={{ position: 'absolute', right: 0, marginRight: 13 }}
            onPress={rightIconOnClick}
          >
            <SvgXml
              width='22'
              height='30'
              xml={rightIcon}
              fill={CustomColors.SVGBlack}
              fillOpacity={1}
              style={iconStyle}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
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
