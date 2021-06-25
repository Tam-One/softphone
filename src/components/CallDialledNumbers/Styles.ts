import { StyleSheet } from 'react-native'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  showNumbers: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  showNumbersDisplayText: {
    fontSize: CustomFonts.CallTextLineHeight,
    fontWeight: '500',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  },
})

export default styles
