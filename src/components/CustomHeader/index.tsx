import { mdiChevronLeft } from '@mdi/js'
import styles from 'components/CustomHeader/Styles'
import { RnIcon } from 'components/Rn'
import RnText from 'components/RnText'
import RnTouchableOpacity from 'components/RnTouchableOpacity'
import React, { FC } from 'react'
import { View } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const CustomHeader: FC<
  Partial<{
    description: string
    onBack(): void
    title: string
  }>
> = ({ description, onBack, title }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <RnTouchableOpacity onPress={onBack} style={styles.backBtnRow}>
          <RnIcon
            path={mdiChevronLeft}
            style={styles.buttonIcon}
            color={CustomColors.DodgerBlue}
            size={CustomFonts.BackButton}
          />
          <RnText style={styles.backText}>{'Back'}</RnText>
        </RnTouchableOpacity>
        <RnText style={styles.headerText}>{title}</RnText>
      </View>
      {!!description && <RnText style={styles.subText}>{description}</RnText>}
    </View>
  )
}

export default CustomHeader
