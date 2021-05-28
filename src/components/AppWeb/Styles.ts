import v from 'components/variables'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  webApp: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed' as 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  webAppLogo: {
    width: 80,
    height: 80,
  },
  webAppBrand: {
    width: 150,
    height: 54,
    marginTop: 10,
  },
  webAppBtn: {
    position: 'relative',
    width: 270,
    padding: 15,
    borderRadius: v.borderRadius,
    marginTop: 10,
  },
  webAppBtnApp: {
    marginTop: 30,
    backgroundColor: 'black',
  },
  webAppBtnBrowser: {
    backgroundColor: 'white',
    marginBottom: 50,
  },
  webAppBtnTxtBrowser: {
    color: 'white',
  },
  webAppIcon: {
    position: 'absolute',
    top: 11,
    right: 10,
  },
})

export default styles
