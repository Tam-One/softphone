import { Dimensions, Platform } from 'react-native'

const iosAndroid = Platform.OS === 'android' || Platform.OS === 'ios'

const CustomValues = {
  iosAndroid: iosAndroid,
  webWidth: 350,
  webHeight: 716,
  compatableWidth: iosAndroid ? Dimensions.get('window').width : 350,
  animationWidth: iosAndroid ? Dimensions.get('window').width : 50,
  animationExitWidth: iosAndroid ? Dimensions.get('window').width : 100,
  callButtons: iosAndroid ? 80 : 65,
}

export default CustomValues
