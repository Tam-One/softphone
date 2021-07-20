import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  header: {
    backgroundColor: CustomColors.lightAliceBlue,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonIcon: {
    flex: 0,
    width: 10,
    height: 30,
    marginRight: 10,
  },
  backBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backText: {
    color: CustomColors.DodgerBlue,
    fontSize: CustomFonts.BackText,
    marginLeft: 4,
  },
  headerText: {
    color: CustomColors.DarkBlue,
    fontSize: CustomFonts.NumberFont,
    lineHeight: CustomFonts.CallTextLineHeight,
    fontWeight: '800',
    flex: 1,
    paddingRight: 59,
    textAlign: 'center',
  },
  headerCenter: {
    paddingRight: 0,
  },
  rightButtonText: {
    fontSize: CustomFonts.BackText,
    color: CustomColors.ActiveBlue,
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
    paddingTop: 44,
    paddingBottom: 28,
    width: '100%',
  },
})

export default styles
