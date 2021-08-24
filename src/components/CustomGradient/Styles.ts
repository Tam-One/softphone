import { Dimensions, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  CustomGradient: {
    resizeMode: 'cover',
    position: 'absolute',
    flex: 1,
    left: 0,
    top: 0,
    zIndex: 99,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
})

export default styles
