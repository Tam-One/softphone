import { StyleSheet } from 'react-native'

import CustomColors from '@/utils/CustomColors'
import CustomFonts from '@/utils/CustomFonts'

const styles = StyleSheet.create({
  callBar: {
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  callBarOuter: {
    flexDirection: 'row',
    padding: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  callBarInfo: {
    paddingLeft: 10,
  },
  callBarButtonCall: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  notifyInfoPartyName: {
    fontSize: CustomFonts.CallBarName,
    fontWeight: 'bold',
  },
  duration: {
    color: CustomColors.White,
    fontSize: CustomFonts.MediumText,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  actionButtons: {
    backgroundColor: CustomColors.White,
    height: 49,
    width: 49,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  actionButtonsContainer: {
    marginHorizontal: 0,
    marginRight: 8,
  },
  videoCallReq: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    top: 0,
  },
})

export default styles
