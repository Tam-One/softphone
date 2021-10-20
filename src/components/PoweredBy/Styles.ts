import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'
import CustomFonts from 'utils/CustomFonts'

const styles = StyleSheet.create({
  poweredBy: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  poweredByText: {
    color: CustomColors.Grey,
    fontSize: CustomFonts.SmallIconFont,
    marginTop: 2,
  },
  qooqieLogo: {
    width: 56.3,
    height: 14,
    marginLeft: 5,
  },
})

export default styles
