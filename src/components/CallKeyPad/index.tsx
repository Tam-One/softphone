import CallButtons from 'components/CallButtons'
import styles from 'components/CallKeyPad/Styles'
import { RnText, RnTouchableOpacity } from 'components/Rn'
import React, { FC } from 'react'
import { TouchableOpacity, View } from 'react-native'
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
  conference?(): void
  fromTransfer?: boolean
}> = ({
  onPressNumber,
  showKeyboard,
  callVoice,
  duringCall,
  hangup,
  onHidePress,
  conference,
  fromTransfer,
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

    <View style={styles.keyPadNumber}>
      <View style={styles.actionButtons}>
        {duringCall && (
          <TouchableOpacity onPress={onHidePress}>
            <RnText style={styles.hideWrapper}>{'Hide'}</RnText>
          </TouchableOpacity>
        )}
        {fromTransfer && conference ? (
          <>
            <CallButtons
              onPress={conference}
              image={CustomImages.CallAcceptedLogo}
              containerStyle={{ width: 55, height: 55, marginTop: 0 }}
              imageStyle={{ height: 55, width: 55 }}
            />
            <RnText style={styles.transferButtonText}>{'Conference'}</RnText>
          </>
        ) : (
          <></>
        )}
      </View>
      <View style={styles.actionButtons}>
        {duringCall && hangup && !fromTransfer ? (
          <CallButtons
            onPress={hangup}
            image={CustomImages.CallDeclinedLogo}
            containerStyle={styles.callButtonContainer}
            imageStyle={styles.callButtonImage}
          />
        ) : (
          <></>
        )}
        {!duringCall && !fromTransfer && (
          <CallButtons
            onPress={callVoice}
            image={CustomImages.CallAcceptedLogo}
            containerStyle={styles.callButtonContainer}
            imageStyle={styles.callButtonImage}
          />
        )}
        {fromTransfer && callVoice ? (
          <>
            <CallButtons
              onPress={callVoice}
              image={CustomImages.CallDeclinedLogo}
              containerStyle={{
                width: 55,
                height: 55,
                marginTop: 0,
              }}
              imageStyle={{ height: 55, width: 55 }}
            />
            <RnText style={styles.transferButtonText}>{'Transfer'}</RnText>
          </>
        ) : (
          <></>
        )}
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.removeTextButton}
          onPress={() => onPressNumber('')}
        >
          <View style={styles.triangle}></View>
          <View style={styles.rectangle}>
            <RnText style={styles.closeButtonText}>{'X'}</RnText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)

export default KeyPad
