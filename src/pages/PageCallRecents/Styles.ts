import { Platform, StyleSheet } from 'react-native'

import CustomColors from '@/utils/CustomColors'
import CustomFonts from '@/utils/CustomFonts'

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
    fontFamily: 'Roboto-Black',
  },
  ParksText: {
    fontSize: CustomFonts.NumberFont,
    lineHeight: 25,
    color: CustomColors.DarkBlue,
    paddingLeft: 16,
    fontFamily: 'Roboto-Black',
  },
  noParksDesc: {
    fontSize: CustomFonts.SmallSubText,
    paddingLeft: 16,
    paddingVertical: 5,
    color: CustomColors.DarkBlue,
  },
  parkContainer: {
    marginTop: 27,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 16,
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
    width: 15,
    height: 15,
    flex: 0.1,
  },
  voiceMailIcon: {
    position: 'relative',
  },
  footerContainer: {
    marginBottom: 1,
  },
  voiceMailCount: {
    width: 23,
    height: 23,
    borderRadius: 13,
    backgroundColor: CustomColors.Black,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    marginTop: -8,
    marginLeft: 33,
  },
  voiceMailText: {
    color: CustomColors.White,
    fontSize: CustomFonts.SmallLabel,
    lineHeight: 14,
  },
  voiceMailLabel: {
    color: CustomColors.DarkBlue,
    fontSize: CustomFonts.SmallSubText,
    lineHeight: 13,
    marginBottom: 6,
  },
  searchBoxView: {
    width: '100%',
    paddingBottom: 10,
  },
})

export default styles
