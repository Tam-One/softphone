import { Dimensions, StyleSheet } from 'react-native'

import CustomValues from '@/utils/CustomValues'

const styles = StyleSheet.create({
  CustomGradient: {
    zIndex: 99,
    width: CustomValues.compatableWidth,
    height: Dimensions.get('window').height,
  },
  flexbox: {
    flex: 1,
  },
})

export default styles
