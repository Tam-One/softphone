import {
  mdiCardsDiamond,
  mdiClose,
  mdiPlus,
  mdiUnfoldMoreHorizontal,
} from '@mdi/js'
import flow from 'lodash/flow'
import omit from 'lodash/omit'
import { observer } from 'mobx-react'
import { ReactElementLike } from 'prop-types'
import React, { FC, useRef } from 'react'
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInputProps,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native'

import styles from '@/components/Field/Styles'
import {
  RnIcon,
  RnSwitch,
  RnText,
  RnTextInput,
  RnTouchableOpacity,
} from '@/components/Rn'
import globalVariables from '@/components/variables'
import intl from '@/stores/intl'
import RnPicker from '@/stores/RnPicker'
import useStore from '@/utils/useStore'

const noop = () => {}
const {
  colors: { primary, danger },
} = globalVariables

const Field: FC<
  Partial<{
    isGroup: boolean
    hasMargin: boolean
    label: string
    onCreateBtnPress(): void
    onValueChange: Function
    createBtnStyle: TouchableOpacityProps['style']
    createBtnIcon: string
    createBtnIconStyle: ViewProps['style']
    removeBtnStyle: TouchableOpacityProps['style']
    removeBtnIcon: string
    removeBtnIconStyle: ViewProps['style']
    onRemoveBtnPress(): void
    type: 'Switch' | 'RnPicker'
    valueRender: Function
    value: string | boolean
    options: {
      key: string
      label: string
    }[]
    icon: string
    onBlur(): void
    onFocus(): void
    onSubmitEditing(): void
    style: TextInputProps['style']
    disabled: boolean
    inputElement: ReactElementLike | null
    onTouchPress(): void
    transparent: boolean
    secureTextEntry: boolean
    iconRender: Function
    error: string
  }>
> = observer(({ ...props }) => {
  if (props.isGroup) {
    return (
      <View
        style={[
          styles.field,
          styles.fieldGroup,
          props.hasMargin && styles.fieldGroupMargin,
        ]}
      >
        <RnText small style={styles.fieldLabelTextGroup}>
          {props.label}
        </RnText>
      </View>
    )
  }
  const $0 = useStore(() => ({
    observable: {
      isFocusing: false,
    },
  }))
  const $ = $0 as typeof $0 & {
    isFocusing: boolean
  }
  const inputRef = useRef<HTMLInputElement>()
  if (!inputRef.current && $.isFocusing) {
    $.set('isFocusing', false)
  }
  if (props.onCreateBtnPress) {
    Object.assign(props, {
      iconRender: () => (
        <RnTouchableOpacity
          onPress={props.onCreateBtnPress}
          style={[styles.fieldBtn, styles.fieldBtnCreate, props.createBtnStyle]}
        >
          <RnIcon
            color={primary}
            path={props.createBtnIcon || mdiPlus}
            size={18}
            style={props.createBtnIconStyle}
          />
        </RnTouchableOpacity>
      ),
    })
  }
  if (props.onRemoveBtnPress) {
    Object.assign(props, {
      iconRender: () => (
        <RnTouchableOpacity
          onPress={props.onRemoveBtnPress}
          style={[styles.fieldBtn, styles.fieldBtnRemove, props.removeBtnStyle]}
        >
          <RnIcon
            color={danger}
            path={props.removeBtnIcon || mdiClose}
            size={15}
            style={props.removeBtnIconStyle}
          />
        </RnTouchableOpacity>
      ),
    })
  }
  if (props.onValueChange) {
    if (props.type === 'Switch') {
      Object.assign(props, {
        valueRender:
          props.valueRender ||
          ((v: boolean) => (v ? intl`Enabled` : intl`Disabled`)),
        iconRender: (v: boolean) => (
          <RnSwitch enabled={v} style={styles.fieldSwitch} />
        ),
        onTouchPress: () => {
          props.onValueChange?.(!props.value)
          Keyboard.dismiss()
        },
      })
    } else if (props.type === 'RnPicker') {
      Object.assign(props, {
        valueRender: (v: string) =>
          props.options?.find(o => o.key === v)?.label || v,
        onTouchPress: () => {
          RnPicker.open({
            options: props.options || [],
            selectedKey: props.value as string,
            onSelect: props.onValueChange as Function,
          })
          Keyboard.dismiss()
        },
        icon: props.icon || mdiUnfoldMoreHorizontal,
      })
    } else {
      Object.assign(props, {
        inputElement: (
          <RnTextInput
            ref={inputRef}
            {...omit(props, [
              'type',
              'label',
              'valueRender',
              'icon',
              'iconRender',
              'onValueChange',
              'onCreateBtnPress',
              'createBtnIcon',
              'onRemoveBtnPress',
              'removeBtnIcon',
              'disabled',
              'error',
            ])}
            onBlur={flow([
              () => $.set('isFocusing', false),
              props.onBlur || noop,
            ])}
            onChangeText={v => props.onValueChange?.(v)}
            onFocus={flow([
              () => $.set('isFocusing', true),
              props.onFocus || noop,
            ])}
            onSubmitEditing={flow([
              props.onCreateBtnPress || noop,
              props.onSubmitEditing || noop,
            ])}
            style={[styles.fieldTextInput, props.style]}
            value={props.value as string}
          />
        ),
        onTouchPress: () => inputRef.current?.focus(),
      })
    }
  }
  if (props.disabled) {
    props.inputElement = null
    props.onTouchPress = undefined
  }
  const Container = props.onTouchPress ? RnTouchableOpacity : View
  const label = (
    <View pointerEvents='none' style={styles.fieldLabel}>
      <RnText small style={styles.fieldLabelText}>
        {props.label}
      </RnText>
    </View>
  )
  return (
    <>
      <Container
        accessible={!props.inputElement}
        onPress={props.onTouchPress}
        style={[
          styles.field,
          $.isFocusing && styles.fieldFocusing,
          props.disabled && styles.fieldDisabled,
          props.transparent && styles.fieldTransparent,
        ]}
      >
        {/* Fix form auto fill style on web */}
        {Platform.OS !== 'web' && label}
        <View pointerEvents={($.isFocusing ? null : 'none') as any}>
          {props.inputElement || (
            <RnTextInput
              secureTextEntry={!!(props.secureTextEntry && props.value)}
              style={styles.fieldTextInput}
              value={
                (props.valueRender && props.valueRender(props.value)) ||
                props.value ||
                '\u200a'
              }
            />
          )}
          {!$.isFocusing && <View style={StyleSheet.absoluteFill} />}
        </View>
        {/* Fix form auto fill style on web */}
        {Platform.OS === 'web' && label}
        {(props.iconRender && props.iconRender(props.value)) ||
          (props.icon && (
            <RnIcon
              path={props.icon}
              pointerEvents='none'
              style={styles.fieldIcon}
            />
          ))}
      </Container>
      {props.error && (
        <RnTouchableOpacity
          onPress={() => inputRef.current?.focus()}
          style={styles.fieldError}
        >
          <View style={styles.fieldErrorInner}>
            <RnIcon
              color={danger}
              path={mdiCardsDiamond}
              style={styles.fieldErrorIcon}
            />
            <RnText small style={styles.fieldErrorLabel}>
              {props.error}
            </RnText>
          </View>
        </RnTouchableOpacity>
      )}
    </>
  )
})

export default Field
