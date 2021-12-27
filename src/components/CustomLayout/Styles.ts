import { Dimensions, StyleSheet } from 'react-native'

const screenHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  scroller: {
    flexGrow: 1,
  },
  childStyle: {
    height: screenHeight * 0.02,
  },
})

export default styles
