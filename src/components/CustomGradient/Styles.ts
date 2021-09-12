import { Dimensions, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  CustomGradient: {
    flex: 1,
    zIndex: 99,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
})

export default styles
