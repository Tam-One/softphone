import { Dimensions, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  CustomGradient: {
    zIndex: 99,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  flexbox: {
    flex: 1,
  },
})

export default styles
