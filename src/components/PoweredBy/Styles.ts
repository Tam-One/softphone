import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  poweredBy: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  poweredByText: {
    color: CustomColors.Grey,
    fontSize: CustomFonts.SmallFooterText,
  },
  qooqieLogo: {
    width: 56.3,
    height: 14,
    marginLeft: 5,
    marginTop: 2,
  },
})

export default styles
