import globalStyles from 'components/variables'
import { Platform, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  pageProfileSignInListServers: {
    height: '70%',
    minHeight: 320,
  },
  pageProfileSignInSpacing: {
    flex: 1,
    maxHeight: '20%',
  },
  space: {
    height: 15,
  },
  cornerButton: {
    position: 'absolute',
    bottom: 0,
    paddingTop: 25,
    paddingBottom: 10,
    paddingHorizontal: 15,
    ...globalStyles.backdropZindex,
  },
  cornerButtonInfo: {
    left: 0,
  },
  cornerButtonLanguage: {
    right: 0,
  },
  cornerButtonInner: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cornerButtonInnerInfo: {
    paddingLeft: 19,
  },
  cornerButtonInnerLanguage: {
    paddingRight: 18,
  },
  cornerButtonIcon: {
    position: 'absolute',
    ...Platform.select({
      android: {
        top: 4,
      },
      default: {
        top: 2,
      },
    }),
  },
  cornerButtonIconInfo: {
    left: 0,
  },
  cornerButtonIconLanguage: {
    right: 0,
  },
})

export default styles
