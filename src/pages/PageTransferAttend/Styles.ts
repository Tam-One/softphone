import { StyleSheet } from 'react-native'

import CustomColors from '@/utils/CustomColors'
import CustomFonts from '@/utils/CustomFonts'

const styles = StyleSheet.create({
  transferText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  transferSeparatorText: {
    fontSize: CustomFonts.SmallLabel,
    color: CustomColors.DodgerBlue,
  },
  transferSeparator: {
    marginTop: 48,
    backgroundColor: CustomColors.LightBlue,
    paddingLeft: 17,
  },
  outer: {
    backgroundColor: CustomColors.AliceBlue,
    flex: 1,
  },
  inner: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  innerInfo: {
    marginBottom: 51,
    justifyContent: 'center',
    marginTop: 45,
    marginHorizontal: 5,
  },
  info: {
    alignItems: 'center',
  },
  infoFrom: {
    marginTop: 15,
  },
  infoTo: {
    marginTop: 15,
  },
  arrow: {
    marginLeft: 40,
    marginRight: 40,
  },
  btnOuter: {
    width: `${100 / 3}%`,
    alignItems: 'center',
  },
  btn: {
    borderRadius: 35,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTransfer: {
    backgroundColor: CustomColors.LightGold,
  },
  btnCancel: {
    backgroundColor: CustomColors.CancelGrey,
  },
  btnConference: {
    backgroundColor: CustomColors.Green,
  },
  space: {
    height: 10,
  },
  callerName: {
    marginTop: 8,
    fontFamily: 'Roboto',
    color: CustomColors.Black,
    fontSize: CustomFonts.SmallSubText,
    textAlign: 'center',
    width: 100,
  },
  partyName: {
    fontFamily: 'Roboto-Bold',
  },
  poweredBy: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default styles
