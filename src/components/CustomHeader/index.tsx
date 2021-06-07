import styles from 'components/CustomHeader/Styles'
import RnText from 'components/RnText'
import RnTouchableOpacity from 'components/RnTouchableOpacity'
import React, { FC } from 'react'
import { Image, View } from 'react-native'
import CustomImages from 'utils/CustomImages'

const CustomHeader: FC<
  Partial<{
    description: string
    onBack(): void
    title: string
    hideBackText?: boolean
    containerStyle?: object | {}
    backContainerStyle?: object | {}
  }>
> = ({
  description,
  onBack,
  title,
  hideBackText,
  containerStyle,
  backContainerStyle,
}) => {
  return (
    <View style={[styles.header, containerStyle]}>
      <View style={[styles.headerRow, backContainerStyle]}>
        <RnTouchableOpacity onPress={onBack} style={styles.backBtnRow}>
          <Image
            source={CustomImages.HeaderBackButton}
            style={styles.buttonIcon}
          ></Image>
          {!hideBackText && <RnText style={styles.backText}>{'Back'}</RnText>}
        </RnTouchableOpacity>
        <RnText style={styles.headerText}>{title}</RnText>
      </View>
      {!!description && <RnText style={styles.subText}>{description}</RnText>}
    </View>
  )
}

export default CustomHeader
