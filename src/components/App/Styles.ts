import globalVariables from 'components/variables'
import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'

const {
  bg,
  colors: { warning, danger },
} = globalVariables
const styles = StyleSheet.create({
  app: {
    backgroundColor: bg,
  },
  container: {
    flex: 1,
    zIndex: 99,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    top: 0,
  },
  appInner: {
    flex: 1,
  },
  appConnectionStatus: {
    backgroundColor: warning,
  },
  appConnectionStatusFailure: {
    backgroundColor: danger,
  },
  appConnectionStatusInner: {
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  loadingFullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: CustomColors.GreenMantis, // Old color from design, not g.colors.primary
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default styles
