import { StyleSheet } from 'react-native'

import CustomColors from '@/utils/CustomColors'
import CustomFonts from '@/utils/CustomFonts'
import CustomValues from '@/utils/CustomValues'

const styles = StyleSheet.create({
  fieldTextInput: {
    fontSize: CustomFonts.MediumText,
    lineHeight: 18,
    paddingHorizontal: 10,
    letterSpacing: 0.15,
    color: CustomColors.lightBlack,
    width: '100%',
    fontFamily: 'Roboto-Bold',
  },
  fieldTextPlaceholder: {
    fontSize: CustomFonts.MediumText,
    lineHeight: 18,
    paddingHorizontal: 10,
    letterSpacing: 0.15,
    color: CustomColors.lightBlack,
    width: '100%',
  },
  inputBox: {
    backgroundColor: CustomColors.White,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 16,
    position: 'relative',
    paddingHorizontal: 12,
    borderColor: CustomColors.DarkGreen,
    borderRadius: 10,
    height: 46,
  },
  footerContainer: {
    flex: 1,
    paddingBottom: 50,
  },
  actionBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginTop: 16,
    paddingHorizontal: 16,
    minHeight: CustomValues.iosAndroid ? 0 : 'initial',
  },
  callButton: {
    height: 49,
    backgroundColor: CustomColors.Green,
    width: '100%',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CustomColors.ShadowGrey,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
    opacity: 0.7,
  },
  formView: {
    marginTop: 24,
    marginBottom: 100,
  },
  callerName: {
    color: CustomColors.DarkBlue,
    fontSize: CustomFonts.HeaderName,
    lineHeight: CustomFonts.CallTextLineHeight,
    marginTop: 20,
    fontFamily: 'Nunito-Bold',
  },
  nameAvatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondForm: {
    marginTop: 24,
  },
  cellNumberText: {
    color: CustomColors.DodgerBlue,
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Nunito-SemiBold',
  },
  headerAvatar: {
    backgroundColor: CustomColors.SkyBlue,
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContainer: {
    marginBottom: 1,
  },
  backButtonContainer: {
    paddingBottom: 10,
  },
})

export default styles
