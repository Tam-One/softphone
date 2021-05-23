import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  customButtonIcon: {},
  buttonIconBtn: {
    paddingTop: 8,
    borderRadius: 9,
    alignItems: 'center',
    marginHorizontal: 5,
    width: 72,
    height: 72,
    justifyContent: 'center',
    shadowColor: 'lightgrey',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonIconName: {
    paddingTop: 5,
    fontSize: 11,
    color: 'black',
  },
  btnLogo: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
})

export default styles
