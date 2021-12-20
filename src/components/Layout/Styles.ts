import { StyleSheet } from 'react-native'

import CustomColors from '@/utils/CustomColors'

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    height: '100%',
    backgroundColor: CustomColors.White,
  },
  layoutTransparent: {
    backgroundColor: CustomColors.Transparent,
  },
  scroller: {
    flexGrow: 1,
  },
  footerSpaceInsideScroller: {
    height: 15,
  },
})

export default styles
