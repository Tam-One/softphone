import React, { FC } from 'react'
import {
  Dimensions,
  Platform,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

import CallButtons from '@/components/CallButtons'
import styles from '@/components/CallKeyPad/Styles'
import { RnText, RnTouchableOpacity } from '@/components/Rn'
import CustomColors from '@/utils/CustomColors'
import {
  AcceptButton,
  DeclineButton,
  TransferCallIcon,
} from '@/utils/SvgComponent'

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
}) => {
  const screenHeight = Dimensions.get('window').height
  const keyButtonSize = screenHeight * 0.097

  const onNumberPress = key => {
    if (Platform.OS === 'ios') {
      const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      }
      ReactNativeHapticFeedback.trigger('impactHeavy', options)
    } else {
      Vibration.vibrate(20)
    }
    onPressNumber(key)
  }

  const handlerLongClick = () => {
    if (Platform.OS === 'ios') {
      const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      }
      ReactNativeHapticFeedback.trigger('impactHeavy', options)
    } else {
      Vibration.vibrate(20)
    }
    onPressNumber('-1')
  }

  return (
    <View>
      {keys.map((row, index) => (
        <View key={index} style={styles.keyPadNumber}>
          {row.map(ele => {
            const { key, subText } = ele
            return (
              <TouchableHighlight
                underlayColor={CustomColors.KeyHighlightBlue}
                key={key}
                onPress={() => onNumberPress(key)}
                style={styles.KeyPadNumberButton}
              >
                <>
                  <Text
                    style={[
                      styles.KeyPadNumberText,
                      key === '*' && {
                        height: 25,
                        fontFamily: 'Roboto-Regular',
                        fontSize: 40,
                        lineHeight: 40,
                        width: '100%',
                        textAlign: 'center',
                      },
                    ]}
                  >
                    {key}
                  </Text>
                  {subText ? (
                    <Text style={styles.keyPadSubText}>{subText}</Text>
                  ) : (
                    <></>
                  )}
                </>
              </TouchableHighlight>
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
        </View>
        <View style={styles.actionButtons}>
          {duringCall && hangup && !fromTransfer ? (
            <CallButtons
              onPress={hangup}
              containerStyle={styles.callButtonContainer}
              imageStyle={styles.callButtonImage}
              Icon={DeclineButton}
              width={keyButtonSize}
              height={keyButtonSize}
            />
          ) : (
            <></>
          )}
          {!duringCall && !fromTransfer && (
            <CallButtons
              onPress={callVoice}
              Icon={AcceptButton}
              containerStyle={styles.callButtonContainer}
              imageStyle={styles.callButtonImage}
              width={keyButtonSize}
              height={keyButtonSize}
            />
          )}
          {fromTransfer && callVoice ? (
            <View
              style={{
                alignItems: 'center',
              }}
            >
              <RnTouchableOpacity onPress={callVoice} style={[styles.btn]}>
                <TransferCallIcon color={'white'}></TransferCallIcon>
              </RnTouchableOpacity>
              <RnText style={styles.transferButtonText}>
                {'Transfer conference'}
              </RnText>
            </View>
          ) : (
            <></>
          )}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.removeTextButton}
            onPress={() => onPressNumber('')}
            onLongPress={handlerLongClick}
          >
            <>
              <View style={styles.triangle}></View>
              <View style={styles.rectangle}>
                <RnText style={styles.closeButtonText}>{'X'}</RnText>
              </View>
            </>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default KeyPad
