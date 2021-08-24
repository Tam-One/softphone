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
    marginTop: 30,
    position: 'relative',
    paddingHorizontal: 12,
    borderColor: CustomColors.DarkGreen,
    borderRadius: 10,
    height: 46,
  },
  fieldIcon: {
    width: 3,
    height: 3,
    flex: 0.1,
  },
  footerContainer: {
    paddingBottom: 50,
    marginTop: 48,
  },
  actionBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  signInButton: {
    backgroundColor: CustomColors.Downy,
    paddingVertical: 11,
    width: 260,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: CustomColors.ShadowBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  signInButtonText: {
    fontSize: 18,
    color: CustomColors.White,
  },
  buttonIcon: {
    flex: 0,
    width: 10,
    height: 30,
    marginRight: 10,
  },
  backBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 44,
    paddingHorizontal: 16,
  },
  backText: {
    color: CustomColors.DodgerBlue,
    fontSize: CustomFonts.BackText,
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CustomColors.Black,
    opacity: 0.3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBoxLabel: {
    position: 'absolute',
    top: -7,
    left: 15,
    color: CustomColors.DodgerBlue,
    fontSize: CustomFonts.SmallLabel,
    lineHeight: 12,
    letterSpacing: 0.4,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  resetButton: {
    fontSize: CustomFonts.SmallSubText,
    color: CustomColors.GreyMedium,
    textDecorationLine: 'underline',
  },
  formContainer: {
    marginTop: 54,
  },
  saveButton: {
    fontSize: CustomFonts.FooterText,
    color: CustomColors.White,
  },
  poweredByView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  singInInput: {
    position: 'absolute',
    top: -7,
    left: 15,
    color: CustomColors.BlueLabel,
    fontSize: CustomFonts.SmallLabel,
    lineHeight: 12,
    letterSpacing: 0.4,
  },
  editContainer: {
    alignItems: 'flex-end',
    marginRight: '12%',
  },
  formView: {
    marginTop: 40,
  },
})

export default styles
