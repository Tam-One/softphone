import globalVar from 'components/variables'
import { StyleSheet } from 'react-native'

const {
  bg,
  borderBg,
  colors: { primary, danger },
  borderRadius,
  fontSizeSmall,
} = globalVar

const styles = StyleSheet.create({
  navigation: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    backgroundColor: bg,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderColor: borderBg,
  },
  buttonActive: {
    borderColor: primary,
  },
  textActive: {
    color: primary,
  },
  unreadOuter: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flex: 1,
    alignItems: 'center',
  },
  unread: {
    top: -5,
    left: 25,
    width: 20,
    height: 15,
    borderRadius: borderRadius,
    paddingTop: 3,
    backgroundColor: danger,
    overflow: 'hidden',
  },
  unreadText: {
    fontSize: fontSizeSmall - 2,
    lineHeight: fontSizeSmall - 2,
  },
})

export default styles
