import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  notify: {
    flex: 1,
  },
  notifyBtnSideBySide: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  numberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifyContainer: {
    flex: 1,
    marginBottom: 40,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    zIndex: 9,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
})

export default styles
