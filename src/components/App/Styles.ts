import { Platform, StyleSheet } from 'react-native'

import globalVariables from '@/components/variables'
import CustomColors from '@/utils/CustomColors'

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
    position: 'absolute',
    flex: 1,
    zIndex: 99,
    width: '100%',
    bottom: 0,
    top: Platform.OS === 'ios' ? 43 : 0,
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
    backgroundColor: CustomColors.Black, // Old color from design, not g.colors.primary
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default styles
