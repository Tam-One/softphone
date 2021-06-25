import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  header: {
    top: 0,
    left: 0,
    right: 0,
  },
  navigation: {
    flexDirection: 'row',
    marginTop: '6%',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    width: 225,
    backgroundColor: CustomColors.lightAliceBlue,
    alignSelf: 'center',
    paddingLeft: 3,
    paddingVertical: 3,
  },
  button: {
    width: 110,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: CustomColors.DarkAsh,
    fontSize: CustomFonts.BackText,
    lineHeight: 23,
    fontWeight: '500',
  },
  buttonActive: {
    backgroundColor: CustomColors.White,
    borderRadius: 22,
  },
  textActive: {
    color: CustomColors.DarkBlue,
  },
})

export default styles
