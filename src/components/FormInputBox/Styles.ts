import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  fieldTextInput: {
    fontSize: CustomFonts.MediumText,
    lineHeight: 18,
    paddingHorizontal: 10,
    letterSpacing: 0.15,
    color: CustomColors.Blue,
    width: '100%',
  },
  inputBox: {
    backgroundColor: CustomColors.White,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    position: 'relative',
    paddingHorizontal: 12,
    borderColor: CustomColors.DarkGreen,
    borderRadius: 10,
    height: 46,
  },
  inputBoxLabel: {
    position: 'absolute',
    top: -7,
    left: 15,
    color: CustomColors.DodgerBlue,
    fontSize: CustomFonts.SmallLabel,
    lineHeight: 12,
    letterSpacing: 0.4,
    paddingHorizontal: 2,
  },
  activeView: {
    borderColor: CustomColors.DarkGreen,
    borderWidth: 2,
  },
})

export default styles
