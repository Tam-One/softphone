import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'

const styles = StyleSheet.create({
  buttonIconBtn: {
    paddingTop: 8,
    borderRadius: 9,
    alignItems: 'center',
    marginHorizontal: 5,
    width: 72,
    height: 72,
    justifyContent: 'center',
    shadowColor: CustomColors.LightGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonIconName: {
    paddingTop: 5,
    fontSize: 11,
    color: CustomColors.Black,
  },
  btnLogo: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
})

export default styles
