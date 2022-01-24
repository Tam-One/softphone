import { Platform, StyleSheet } from 'react-native'

import CustomColors from '@/utils/CustomColors'
import CustomFonts from '@/utils/CustomFonts'
import CustomValues from '@/utils/CustomValues'

const styles = StyleSheet.create({
  actionBtnText: {
    fontSize: CustomFonts.ButtonText,
    color: CustomColors.DarkBlue,
  },
  actionBtnContainer: {
    alignItems: 'center',
    width: 100,
  },
  actionBtn: {
    width: CustomValues.iosAndroid ? 80 : 60,
    height: CustomValues.iosAndroid ? 80 : 60,
    marginBottom: 10,
  },
  animationContainer: {
    backgroundColor: CustomColors.LightGreen,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationImage: {
    margin: 10,
  },
})

export default styles
