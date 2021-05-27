import g from 'components/variables'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  notify: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: g.borderBg,
    backgroundColor: g.hoverBg,
  },
  notifyInfo: {
    flex: 1,
    paddingLeft: 12,
    paddingVertical: 5,
  },
  notifyBtnReject: {
    borderColor: g.colors.danger,
  },
  notifyBtnAccept: {
    borderColor: g.colors.primary,
  },
  notifyUnread: {
    borderBottomWidth: 0,
  },
  notifyUnreadBtn: {
    flex: 1,
    backgroundColor: g.colors.primaryFn(0.5),
  },
})

export default styles
