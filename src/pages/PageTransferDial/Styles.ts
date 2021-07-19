import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  transferSeparatorText: {
    fontSize: CustomFonts.SmallLabel,
    color: CustomColors.DodgerBlue,
  },
  transferSeparator: {
    backgroundColor: CustomColors.LightBlue,
    paddingLeft: 17,
  },
  scrollViewContainer: {
    marginBottom: 1,
  },
  keyPadContainer: {
    marginTop: 15,
  },
  transferKeysPlaceholder: {
    fontSize: CustomFonts.HeaderTitle,
    fontWeight: '500',
    padding: 15,
    textAlign: 'left',
    width: '100%',
    marginTop: '5%',
    marginLeft: 65,
  },
})

export default styles
