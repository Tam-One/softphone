import g from 'components/variables'
import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 40, // Header compact height
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CustomColors.Black,
  },
  videoSpace: {
    flex: 1,
    alignSelf: 'stretch',
  },
  btns: {
    top: 80, // Header compact height
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 124, // Hangup button 64 + 2*30
  },
  btnsIsVideoEnabled: {
    backgroundColor: g.layerBg,
  },
  btnsHidden: {
    opacity: 0,
  },
  btnsInnerView: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  btnsSpace: {
    height: 20,
  },
  btnsVerticalMargin: {
    flex: 1,
  },
  footerContainer: {
    flex: 1,
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
    marginTop: 19,
  },
  timerDisplayBox: {
    width: 80,
    height: 30,
    backgroundColor: CustomColors.Green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
})

export default styles
