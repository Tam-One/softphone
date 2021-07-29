import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  fieldTextInput: {
    fontSize: CustomFonts.MediumText,
    paddingHorizontal: 12.5,
    letterSpacing: 0.15,
    color: CustomColors.Blue,
    width: '100%',
    height: 46,
  },
  inputBox: {
    backgroundColor: CustomColors.White,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 16,
    position: 'relative',
    paddingRight: 12,
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
  fieldError: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
    marginLeft: 7,
  },
  fieldErrorInner: {
    alignSelf: 'flex-start',
    marginVertical: 2,
    marginHorizontal: 15,
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: CustomColors.ErrorRed,
    borderRadius: 3,
  },
  fieldErrorIcon: {
    position: 'absolute',
    top: -8,
    left: 2,
  },
  fieldErrorLabel: {
    color: CustomColors.White,
  },
})

export default styles
