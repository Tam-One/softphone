import { mdiKeyboardBackspace } from '@mdi/js'
import Field from 'components/Field'
import styles from 'components/FieldButton/Styles'
import { RnTouchableOpacity } from 'components/Rn'
import React, { FC } from 'react'
import { TouchableOpacityProps, View } from 'react-native'

const FieldButton: FC<
  Partial<{
    style: TouchableOpacityProps['style']
    onCreateBtnPress(): void
    label: string
    value: string
  }>
> = ({ ...props }) => {
  const { style, onCreateBtnPress } = props
  return (
    <RnTouchableOpacity
      onPress={onCreateBtnPress}
      style={[styles.fieldButton, style]}
    >
      <View style={styles.inner}>
        <Field
          {...props}
          createBtnIcon={mdiKeyboardBackspace}
          createBtnIconStyle={styles.createBtnIcon}
          createBtnStyle={styles.createBtn}
          transparent
        />
      </View>
    </RnTouchableOpacity>
  )
}

export default FieldButton
