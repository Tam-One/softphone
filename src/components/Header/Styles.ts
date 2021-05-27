import g from 'components/variables'
import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  outer: {
    backgroundColor: g.bg,
  },
  outerCompact: {
    ...g.boxShadow,
  },
  outerTransparent: {
    backgroundColor: CustomColors.Transparent,
  },
  innerHasBackBtn: {
    paddingLeft: 35,
  },
})

export default styles
