import { mdiKeyboardBackspace } from '@mdi/js'
import Field from 'components/Field/Field'
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
> = p0 => {
  const { style, ...p } = p0
  return (
    <RnTouchableOpacity
      onPress={p.onCreateBtnPress}
      style={[styles.fieldButton, style]}
    >
      <View style={styles.inner}>
        <Field
          {...p}
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
