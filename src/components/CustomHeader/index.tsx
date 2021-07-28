import svgImages from 'assets/svgImages'
import styles from 'components/CustomHeader/Styles'
import RnText from 'components/RnText'
import RnTouchableOpacity from 'components/RnTouchableOpacity'
import React, { FC } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SvgXml } from 'react-native-svg'
import CustomColors from 'utils/CustomColors'

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
    touchableView?: boolean
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
  touchableView,
}) => {
  const Wrapper = touchableView ? RnTouchableOpacity : View

  return (
    <Wrapper style={[styles.header, containerStyle]} onPress={onBack}>
      <View style={[styles.headerRow, backContainerStyle]}>
        <View style={{ flex: 0.2 }}>
          {onBack ? (
            <TouchableOpacity onPress={onBack} style={styles.backBtnRow}>
              <SvgXml
                width='17'
                height='17'
                xml={svgImages.backButton}
                fill={CustomColors.BlueLabel}
                fillOpacity={1}
              />
              {!hideBackText && (
                <RnText style={styles.backText}>{backText || 'Back'}</RnText>
              )}
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>

        <View style={{ flex: 0.6 }}>
          <RnText style={[styles.headerText]}>{title}</RnText>
        </View>

        <View style={{ flex: 0.2 }}>
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
      </View>

      {description ? (
        <RnText style={styles.subText}>{description}</RnText>
      ) : (
        <></>
      )}
    </Wrapper>
  )
}

export default CustomHeader
