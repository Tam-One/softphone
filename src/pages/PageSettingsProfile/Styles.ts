import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  fieldTextInput: {
    fontSize: CustomFonts.BackText,
    lineHeight: 22,
    paddingHorizontal: 10,
    letterSpacing: 0.15,
    color: CustomColors.Disabled,
    fontFamily: 'Nunito-SemiBold',
  },
  inputBox: {
    backgroundColor: CustomColors.White,
    marginHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 44,
  },
  flexBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: CustomColors.White,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 44,
    position: 'relative',
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 44,
  },
  actionArrow: {
    fontSize: CustomFonts.MediumText,
    lineHeight: 18,
    color: CustomColors.Black,
  },
  actionText: {
    fontSize: CustomFonts.MediumText,
    lineHeight: 18,
    paddingHorizontal: 10,
    letterSpacing: 0.32,
    color: CustomColors.BlueMedium,
    fontFamily: 'Nunito-Bold',
  },
  heading: {
    marginHorizontal: 16,
    fontSize: CustomFonts.SmallSubText,
    color: CustomColors.GreyMedium,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  logoutText: {
    color: CustomColors.Red,
    fontSize: CustomFonts.FooterText,
    lineHeight: 22,
  },
  logoutButton: {
    marginTop: '28%',
    marginBottom: 60,
  },
  backButtonContainer: {
    paddingBottom: 8,
  },
  advanceSettingsBack: {
    paddingBottom: 8,
  },
  formView: {
    marginTop: 46,
  },
  tenentFormView: {
    marginTop: 16,
  },
  advanceSettings: {
    marginTop: 46,
  },
  scrollViewContainer: {
    marginBottom: 1,
  },
})

export default styles
