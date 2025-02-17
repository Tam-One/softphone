import { Platform, StyleSheet } from 'react-native'

import CustomColors from '@/utils/CustomColors'
import CustomFonts from '@/utils/CustomFonts'
import CustomValues from '@/utils/CustomValues'

const styles = StyleSheet.create({
  loading: {
    marginTop: 20,
  },
  noParksContainer: {
    backgroundColor: CustomColors.DodgerBlue,
    paddingHorizontal: 16,
    height: 56,
    marginTop: 16,
    justifyContent: 'center',
  },
  ParksText: {
    fontSize: CustomFonts.NumberFont,
    lineHeight: 25,
    color: CustomColors.DarkBlue,
    fontFamily: 'Roboto-Black',
  },
  noParksDesc: {
    fontSize: CustomFonts.SmallSubText,
    paddingVertical: 5,
    color: CustomColors.DarkBlue,
  },
  parkContainer: {
    marginTop: 27,
    marginBottom: 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldTextInput: {
    fontSize: CustomFonts.SmallIconFont,
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
    width: 15,
    height: 15,
    flex: 0.1,
  },
  recentList: {
    paddingLeft: 13,
  },
  addButtonContainer: {
    height: 40,
    width: 40,
    backgroundColor: CustomColors.ActiveBlue,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CustomColors.lightBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
  },
  addButton: {
    fontSize: CustomFonts.NumberFont,
    lineHeight: 28,
    paddingLeft: 1,
    color: CustomColors.White,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: CustomValues.iosAndroid ? 0 : 2,
  },
  transferSeparatorText: {
    fontSize: CustomFonts.SmallLabel,
    color: CustomColors.DodgerBlue,
  },
  transferSeparator: {
    backgroundColor: CustomColors.LightBlue,
    paddingLeft: 16,
  },
  scrollViewContainer: {
    marginBottom: 1,
  },
  listView: {
    marginTop: 18,
  },
  searchBoxView: {
    backgroundColor: CustomColors.GradientStart,
    width: '100%',
    paddingBottom: 10,
  },
})

export default styles
