import { StyleSheet } from 'react-native'

import CustomColors from '@/utils/CustomColors'

const styles = StyleSheet.create({
  navigation: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    backgroundColor: CustomColors.MediumBlack,
  },
  button: {
    flex: 1,
    bottom: 0,
    top: 0,
    alignItems: 'center',
  },
  buttonBackground: {
    paddingVertical: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default styles
