import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  header: {
    backgroundColor: CustomColors.lightAliceBlue,
  },
  backBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: 170,
  },
  backText: {
    color: CustomColors.DodgerBlue,
    fontSize: CustomFonts.BackText,
    marginLeft: 4,
    overflow: 'visible',
  },
  headerText: {
    color: CustomColors.DarkBlue,
    fontSize: CustomFonts.NumberFont,
    lineHeight: CustomFonts.CallTextLineHeight,
    fontFamily: 'Roboto-Black',
    textAlign: 'center',
  },
  rightButtonText: {
    fontSize: CustomFonts.BackText,
    color: CustomColors.ActiveBlue,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  disabledRightButton: {
    opacity: 0.8,
    color: 'grey',
  },
  subText: {
    color: CustomColors.DarkBlue,
    fontSize: CustomFonts.SmallSubText,
    alignSelf: 'center',
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 44,
    paddingBottom: 28,
    width: '100%',
  },
})

export default styles
