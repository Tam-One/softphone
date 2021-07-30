import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  callHeading: {
    backgroundColor: CustomColors.DodgerBlue,
    paddingHorizontal: 29,
    height: 56,
    justifyContent: 'center',
  },
  currentCallHeading: {
    backgroundColor: CustomColors.Green,
  },
  callHeadingText: {
    fontSize: CustomFonts.HeaderTitle,
    lineHeight: 22,
    color: CustomColors.White,
    fontFamily: 'Roboto-Black',
  },
  listContainerStyle: {
    marginLeft: 0,
    paddingRight: 0,
  },
  listInnerContainer: {
    paddingLeft: 21,
    paddingRight: 6,
  },
})

export default styles
