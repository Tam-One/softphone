import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  customHeaderContainer: {
    backgroundColor: CustomColors.AliceBlue,
    height: 40,
    width: '100%',
    // position: 'absolute',
    top: 0,
    zIndex: 99,
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'repeat',
    justifyContent: 'center',
  },
  videoPageContainer: {
    flex: 1,
    position: 'relative',
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: CustomColors.Transparent,
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  localVideo: {
    position: 'absolute',
    width: 120,
    height: 170,
    alignSelf: 'flex-end',
    zIndex: 99,
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
    bottom: 0,
    top: 0,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    padding: 0,
    margin: 0,
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
    paddingBottom: 80,
  },
  actionBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
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
    height: '100%',
    width: '100%',
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
    marginTop: 0,
  },
})

export default styles
