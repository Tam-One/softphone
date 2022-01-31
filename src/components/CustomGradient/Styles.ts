import { Dimensions, StyleSheet } from 'react-native'

import CustomColors from '@/utils/CustomColors'
import CustomValues from '@/utils/CustomValues'

const styles = StyleSheet.create({
  CustomGradient: {
    zIndex: 99,
    width: CustomValues.compatableWidth,
    height: Dimensions.get('window').height - 60,
    backgroundColor: CustomColors.AppBackground,
  },
  flexbox: {
    flex: 1,
  },
})

export default styles
