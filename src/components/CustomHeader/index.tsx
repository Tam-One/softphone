import styles from 'components/CustomHeader/Styles'
import RnText from 'components/RnText'
import RnTouchableOpacity from 'components/RnTouchableOpacity'
import React, { FC } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import CustomImages from 'utils/CustomImages'

const CustomHeader: FC<
  Partial<{
    description: string
    backText?: string
    rightButtonText?: string
    onBack?(): void
    onRightButtonPress?(): void
    title: string
    hideBackText?: boolean
    containerStyle?: object | {}
    backContainerStyle?: object | {}
    disableRightButton?: boolean
  }>
> = ({
  description,
  backText,
  rightButtonText,
  onBack,
  onRightButtonPress,
  title,
  hideBackText,
  containerStyle,
  backContainerStyle,
  disableRightButton,
}) => {
  return (
    <View style={[styles.header, containerStyle]}>
      <View style={[styles.headerRow, backContainerStyle]}>
        {onBack ? (
          <RnTouchableOpacity onPress={onBack} style={styles.backBtnRow}>
            <Image
              source={CustomImages.HeaderBackButton}
              style={styles.buttonIcon}
            ></Image>
            {!hideBackText && (
              <RnText style={styles.backText}>{backText || 'Back'}</RnText>
            )}
          </RnTouchableOpacity>
        ) : (
          <></>
        )}
        <RnText
          style={[styles.headerText, onRightButtonPress && styles.headerCenter]}
        >
          {title}
        </RnText>
        {onRightButtonPress ? (
          <TouchableOpacity
            onPress={onRightButtonPress}
            disabled={disableRightButton}
          >
            <RnText
              style={[
                styles.rightButtonText,
                disableRightButton && styles.disabledRightButton,
              ]}
            >
              {rightButtonText || 'Edit'}
            </RnText>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      {description ? (
        <RnText style={styles.subText}>{description}</RnText>
      ) : (
        <></>
      )}
    </View>
  )
}

export default CustomHeader
