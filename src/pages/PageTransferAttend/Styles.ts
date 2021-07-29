import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  outer: {
    backgroundColor: CustomColors.AliceBlue,
    flex: 1,
  },
  inner: {
    width: '100%',
    flexDirection: 'row',
    maxWidth: 320,
  },
  innerInfo: {
    maxWidth: 280,
    marginBottom: 60,
    justifyContent: 'center',
    marginTop: 30,
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
  },
  btnStop: {
    backgroundColor: CustomColors.LightGold,
  },
  btnHangup: {
    backgroundColor: CustomColors.Tomato,
  },
  btnConference: {
    backgroundColor: CustomColors.Green,
  },
  space: {
    height: 10,
  },
  callerName: {
    marginTop: 7,
    fontFamily: 'Nunito-Bold',
    color: CustomColors.DarkBlue,
    fontSize: CustomFonts.SmallSubText,
  },
})

export default styles
