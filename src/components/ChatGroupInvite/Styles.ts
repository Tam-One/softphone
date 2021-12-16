import { StyleSheet } from 'react-native'

import globalVariables from '@/components/variables'

const {
  borderBg,
  hoverBg,
  colors: { primary, primaryFn, danger },
} = globalVariables

const styles = StyleSheet.create({
  notify: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: borderBg,
    backgroundColor: hoverBg,
  },
  notifyInfo: {
    flex: 1,
    paddingLeft: 12,
    paddingVertical: 5,
  },
  notifyBtnReject: {
    borderColor: danger,
  },
  notifyBtnAccept: {
    borderColor: primary,
  },
  notifyUnread: {
    borderBottomWidth: 0,
  },
  notifyUnreadBtn: {
    flex: 1,
    backgroundColor: primaryFn(0.5),
  },
})

export default styles
