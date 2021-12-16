import React, { forwardRef } from 'react'
import { Platform, StyleSheet, TextInput, TextInputProps } from 'react-native'

import CustomColors from '@/utils/CustomColors'

import v from './variables'

const css = StyleSheet.create({
  RnTextInput: {
    position: 'relative',
    fontSize: v.fontSize,
    color: v.color,
  },
})

export type RnTextInputProps = TextInputProps & {
  disabled?: boolean
}

const RnTextInput = forwardRef(
  ({ keyboardType, style, ...props }: RnTextInputProps, ref) => {
    let inputStyles: any = [css.RnTextInput, style]
    if (Platform.OS === 'web') {
      inputStyles.push({ outlineStyle: 'none' })
    }

    return (
      <TextInput
        autoCapitalize='none'
        ref={ref as (instance: unknown) => void}
        {...props}
        keyboardType={
          (Platform.OS === 'web'
            ? null
            : keyboardType) as TextInputProps['keyboardType']
        }
        style={inputStyles}
        placeholderTextColor={CustomColors.DarkAsh}
      />
    )
  },
)

export default RnTextInput
