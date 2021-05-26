import { StyleSheet } from 'react-native'
import CustomColors from 'utils/CustomColors'

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: CustomColors.White,
    width: '100%',
    shadowColor: CustomColors.LightGrey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  inner: {
    width: 50,
    height: 70,
    paddingHorizontal: 0,
    paddingVertical: 20,
    borderRadius: 0,
  },
})

export default styles
