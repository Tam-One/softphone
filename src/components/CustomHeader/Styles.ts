import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  header: {
    backgroundColor: CustomColors.lightAliceBlue,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 17,
    shadowColor: CustomColors.LightGrey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonIcon: {
    flex: 0,
    width: 30,
    height: 30,
  },
  backBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backText: {
    color: CustomColors.DodgerBlue,
    fontSize: CustomFonts.BackText,
  },
  headerText: {
    color: CustomColors.DarkBlue,
    fontSize: CustomFonts.NumberFont,
    lineHeight: CustomFonts.CallTextLineHeight,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 59,
    textAlign: 'center',
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
