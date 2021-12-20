import { Platform, StyleSheet } from 'react-native'

import CustomColors from '@/utils/CustomColors'
import CustomFonts from '@/utils/CustomFonts'

const styles = StyleSheet.create({
  buttonIconBtn: {
    paddingTop: 8,
    borderRadius: 9,
    alignItems: 'center',
    marginHorizontal: 9,
    width: Platform.OS === 'web' ? 65 : 72,
    height: Platform.OS === 'web' ? 65 : 72,
    justifyContent: 'center',
  },
  shadowEffect: {
    shadowColor: CustomColors.LightGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonIconName: {
    paddingTop: 5,
    fontSize: CustomFonts.SmallFooterText,
    color: CustomColors.Black,
  },
  btnLogo: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
})

export default styles
