import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

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
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  animationContainer: {
    backgroundColor: CustomColors.lightGreen,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationImage: {
    margin: 10,
  },
})

export default styles
