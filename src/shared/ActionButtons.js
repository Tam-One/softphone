import { mdiCached, mdiKeyboardBackspace } from '@mdi/js';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import v from '../variables';
import Icon from './Icon';

const s = StyleSheet.create({
  ActionButtons: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: v.borderRadius,
    overflow: 'hidden',
  },
  ActionButtons_Btn: {
    paddingVertical: 8,
    borderRadius: 0,
    width: '25%',
  },
  ActionButtons_Btn__back: {
    backgroundColor: v.fn.transparentize(0.9, v.brekekeRed),
  },
  ActionButtons_Btn__reset: {
    backgroundColor: v.brekekeShade0,
  },
  ActionButtons_Btn__save: {
    width: '50%',
    backgroundColor: v.brekekeGreenBtn,
  },
  ActionButtons_BtnTxt: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    fontSize: v.fontSizeSmall,
    lineHeight: 24, // Icon height
  },
});

const ActionButtons = p => (
  <View style={s.ActionButtons}>
    <TouchableOpacity
      style={[s.ActionButtons_Btn, s.ActionButtons_Btn__back]}
      onPress={p.onBackBtnPress}
    >
      <Icon path={p.backIcon || mdiKeyboardBackspace} color={v.brekekeRed} />
    </TouchableOpacity>
    <TouchableOpacity
      style={[s.ActionButtons_Btn, s.ActionButtons_Btn__reset]}
      onPress={p.onResetBtnPress}
    >
      <Icon path={p.resetIcon || mdiCached} />
    </TouchableOpacity>
    <TouchableOpacity
      style={[s.ActionButtons_Btn, s.ActionButtons_Btn__save]}
      onPress={p.onSaveBtnPress}
    >
      <Text style={s.ActionButtons_BtnTxt}>{p.saveText || 'SAVE'}</Text>
    </TouchableOpacity>
  </View>
);

export default ActionButtons;
