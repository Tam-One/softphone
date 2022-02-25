import { mdiCardsDiamond } from '@mdi/js'
import React, { Component, FC, useEffect, useState } from 'react'
import { Platform, TouchableOpacity, View } from 'react-native'
import { Path, Svg, SvgXml, Text } from 'react-native-svg'

import styles from '@/components/FormInputBox/Styles'
import { RnIcon, RnText } from '@/components/Rn'
import RnTextInput from '@/components/RnTextInput'
import CustomColors from '@/utils/CustomColors'

const FormInputBox: FC<{
  label: string
  val: string
  onTextChange(text): void
  editable?: boolean
  required?: boolean
  showError?: boolean
  Icon?: any
  mdIcon?: any
  containerStyle?: object
  iconStyle?: object
  secureEntry?: boolean
  RightIcon?: any
  rightIconOnClick?(): void
  errorStyles?: any
  iconColor?: any
}> = ({
  label,
  val,
  onTextChange,
  editable = true,
  required,
  showError,
  Icon,
  mdIcon,
  containerStyle,
  iconStyle,
  secureEntry,
  RightIcon,
  rightIconOnClick,
  errorStyles,
  iconColor,
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
          {Icon ? (
            <Icon
              fill={CustomColors.SVGBlack}
              fillOpacity={1}
              style={iconStyle}
              tabIndex={-1}
            ></Icon>
          ) : (
            <></>
          )}
          {mdIcon ? (
            <View>
              <RnIcon
                path={mdIcon}
                color={iconColor || CustomColors.Black}
                size={24}
                tabIndex={-1}
              />
            </View>
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
        {RightIcon ? (
          <TouchableOpacity
            style={styles.rightIconView}
            onPress={rightIconOnClick}
          >
            <RightIcon
              tabIndex={-1}
              fill={CustomColors.SVGBlack}
              fillOpacity={1}
              style={iconStyle}
            ></RightIcon>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      {(validationError || showError) && (
        <View style={[styles.fieldError, errorStyles]}>
          <View style={styles.fieldErrorInner}>
            <RnIcon
              color={CustomColors.ErrorRed}
              path={mdiCardsDiamond}
              style={styles.fieldErrorIcon}
              tabIndex={-1}
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
