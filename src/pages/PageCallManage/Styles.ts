import { Dimensions, Platform, StyleSheet } from 'react-native'

import CustomColors from '@/utils/CustomColors'
import CustomFonts from '@/utils/CustomFonts'
import CustomValues from '@/utils/CustomValues'

const styles = StyleSheet.create({
  customHeaderContainer: {
    height: 40,
    width: '100%',
    top: 0,
    zIndex: 99,
  },
  marginTop: {
    marginTop: 40,
  },
  title: {
    color: CustomColors.White,
    fontSize: CustomFonts.MediumText,
    marginBottom: 13,
  },
  backBtnContainer: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  gradientContainer: {
    height: Dimensions.get('window').height - 40,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'repeat',
    justifyContent: 'center',
  },
  videoPageContainer: {
    flex: 1,
    position: 'absolute',
    width: CustomValues.compatableWidth,
    height: Dimensions.get('window').height,
    zIndex: 9999,
  },
  videoContainer: {
    flex: 1,
    width: CustomValues.compatableWidth,
    height: Dimensions.get('window').height,
    backgroundColor: CustomColors.Transparent,
    position: 'relative',
  },
  remoteVideo: {
    width: CustomValues.compatableWidth,
    height: Dimensions.get('window').height,
    zIndex: 1,
    flex: 1,
  },
  localVideo: {
    position: 'absolute',
    width: 120,
    height: 170,
    alignSelf: 'flex-end',
    zIndex: 99,
    flex: 1,
  },
  btns: {
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 25, // Hangup button 64 + 2*30
  },
  btnsIsVideoEnabled: {
    position: 'absolute',
    flex: 1,
    bottom: Platform.OS === 'ios' ? 60 : 0,
    top: 0,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    padding: 0,
    margin: 0,
    backgroundColor: CustomColors.Transparent,
  },
  videoActionsContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    position: 'relative',
  },
  btnsHidden: {
    opacity: 0,
  },
  btnsInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  btnsSpace: {
    marginTop: 21,
  },
  btnsVerticalMargin: {
    flex: 1,
  },
  footerContainer: {
    flex: 1,
    paddingBottom: Dimensions.get('window').height * 0.01,
    justifyContent: 'center',
    width: '100%',
  },
  actionBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnImage: {
    width: 28,
    height: 28,
  },
  timerContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 19,
    position: 'relative',
  },
  videoTimerDisplayBox: {
    position: 'absolute',
    marginTop: 90,
  },
  timerDisplayBox: {
    width: 80,
    height: 30,
    backgroundColor: CustomColors.Green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  videoPopupContainer: {
    flex: 1,
    backgroundColor: CustomColors.lightBlack,
    position: 'absolute',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
    width: CustomValues.compatableWidth,
    height: Dimensions.get('window').height,
    paddingBottom: 60,
  },
  videoPopupView: {
    width: '90%',
    justifyContent: 'center',
    backgroundColor: CustomColors.PopupBlack,
    paddingVertical: 17,
    paddingHorizontal: 17,
  },
  videoPopupHeading: {
    color: CustomColors.Yellow,
    fontSize: CustomFonts.SmallIconFont,
    marginBottom: 40,
  },
  videoPopupFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  videoPopupCancel: {
    color: CustomColors.Purple,
    fontSize: CustomFonts.SmallIconFont,
    textTransform: 'uppercase',
  },
  videoPopupSwitch: {
    color: CustomColors.Purple,
    fontSize: CustomFonts.SmallIconFont,
    marginLeft: 21,
    textTransform: 'uppercase',
  },
  videoCallEndButton: {
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poweredByView: {
    marginTop: 3,
  },
  videoCallPopupContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    bottom: 0,
    top: 0,
    zIndex: 999,
  },
  callingScreenButtons: {
    position: 'absolute',
    flex: 1,
    bottom: Platform.OS === 'ios' ? 60 : 0,
    top: 0,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    padding: 0,
    margin: 0,
    backgroundColor: CustomColors.Transparent,
    zIndex: 99999,
  },
})

export default styles
