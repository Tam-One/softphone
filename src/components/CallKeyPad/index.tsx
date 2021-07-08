import CallButtons from 'components/CallButtons'
import styles from 'components/CallKeyPad/Styles'
import { RnText, RnTouchableOpacity } from 'components/Rn'
import React, { FC } from 'react'
import { View } from 'react-native'
import CustomImages from 'utils/CustomImages'

const keys = [
  [
    { key: '1', subText: '' },
    { key: '2', subText: 'ABC' },
    { key: '3', subText: 'DEF' },
  ],
  [
    { key: '4', subText: 'GHI' },
    { key: '5', subText: 'JKL' },
    { key: '6', subText: 'MNO' },
  ],
  [
    { key: '7', subText: 'PQRS' },
    { key: '8', subText: 'TUV' },
    { key: '9', subText: 'WXYZ' },
  ],
  [
    { key: '*', subText: '' },
    { key: '0', subText: '+' },
    { key: '#', subText: '' },
  ],
]

const KeyPad: FC<{
  onPressNumber(key: string): void
  showKeyboard(): void
  callVoice(): void
  duringCall?: boolean
  hangup?(): void
  onHidePress?(): void
}> = ({
  onPressNumber,
  showKeyboard,
  callVoice,
  duringCall,
  hangup,
  onHidePress,
}) => (
  <View>
    {keys.map((row, index) => (
      <View key={index} style={styles.keyPadNumber}>
        {row.map(ele => {
          const { key, subText } = ele
          return (
            <RnTouchableOpacity
              key={key}
              onPress={() => onPressNumber(key)}
              style={styles.KeyPadNumberButton}
            >
              <RnText
                style={[
                  styles.KeyPadNumberText,
                  key === '*' && styles.symbolText,
                ]}
              >
                {key}
              </RnText>
              {!!subText && (
                <RnText style={styles.keyPadSubText}>{subText}</RnText>
              )}
            </RnTouchableOpacity>
          )
        })}
      </View>
    ))}

    <View style={[styles.keyPadNumber, styles.footerButtons]}>
      <RnTouchableOpacity style={styles.wrapper} onPress={onHidePress}>
        <RnText style={styles.hideWrapper}>{'Hide'}</RnText>
      </RnTouchableOpacity>
      {!duringCall ? (
        <CallButtons
          onPress={callVoice}
          image={CustomImages.CallAcceptedLogo}
          containerStyle={styles.callButtonContainer}
          imageStyle={styles.callButtonImage}
        />
      ) : (
        <></>
      )}
      {duringCall && hangup ? (
        <CallButtons
          onPress={hangup}
          image={CustomImages.CallDeclinedLogo}
          containerStyle={styles.callButtonContainer}
          imageStyle={styles.callButtonImage}
        />
      ) : (
        <></>
      )}
      <RnTouchableOpacity
        style={styles.wrapper}
        onPress={() => onPressNumber('')}
      >
        <View style={styles.triangle}></View>
        <View style={styles.rectangle}>
          <RnText style={styles.closeButtonText}>{'X'}</RnText>
        </View>
      </RnTouchableOpacity>
    </View>
  </View>
)

export default KeyPad
