import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  noParksContainer: {
    backgroundColor: CustomColors.DodgerBlue,
    paddingHorizontal: 16,
    height: 56,
    marginTop: 16,
    justifyContent: 'center',
  },
  noParksText: {
    fontSize: CustomFonts.HeaderTitle,
    lineHeight: 22,
    color: CustomColors.White,
    fontWeight: '800',
  },
  ParksText: {
    fontSize: CustomFonts.NumberFont,
    lineHeight: 25,
    color: CustomColors.DarkBlue,
    fontWeight: '800',
    paddingHorizontal: 16,
  },
  noParksDesc: {
    fontSize: CustomFonts.SmallSubText,
    paddingHorizontal: 16,
    paddingVertical: 5,
    color: CustomColors.DarkBlue,
  },
  parkContainer: {
    marginTop: 27,
    marginBottom: 12,
  },
  fieldTextInput: {
    fontSize: 14,
    lineHeight: 16,
    color: CustomColors.DarkAsh,
    flex: 0.9,
  },
  searchBox: {
    backgroundColor: CustomColors.White,
    marginHorizontal: 16,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fieldIcon: {
    width: 3,
    height: 3,
    flex: 0.1,
  },
  footerContainer: {
    marginBottom: 40,
  },
})

export default styles
