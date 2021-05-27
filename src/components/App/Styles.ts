import g from 'components/variables'
import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'

const styles = StyleSheet.create({
  app: {
    backgroundColor: g.bg,
  },
  appInner: {
    flex: 1,
  },
  appConnectionStatus: {
    backgroundColor: g.colors.warning,
  },
  appConnectionStatusFailure: {
    backgroundColor: g.colors.danger,
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
