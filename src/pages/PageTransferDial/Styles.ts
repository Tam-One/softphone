import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  transferSeparatorText: {
    fontSize: CustomFonts.smallLabel,
    color: CustomColors.DodgerBlue,
  },
  transferSeparator: {
    backgroundColor: CustomColors.White,
    paddingLeft: 21,
  },
})

export default styles
