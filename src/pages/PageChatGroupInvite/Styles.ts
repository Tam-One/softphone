import { StyleSheet } from 'react-native'

import globalStyles from '@/components/variables'

const styles = StyleSheet.create({
  pageChatGroupInvite: {},
  pageChatGroupInviteTextInput: {
    padding: 10,
    ...globalStyles.boxShadow,
  },
  pageChatGroupInviteOuter: {
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  pageChatGroupInviteBtnSave: {
    marginTop: 15,
    padding: 10,
    borderRadius: globalStyles.borderRadius,
    backgroundColor: globalStyles.colors.primary,
  },
  pageChatGroupInviteBtnText: {
    alignItems: 'center',
  },
  pageChatGroupInviteGroupName: {
    fontSize: globalStyles.fontSizeTitle,
    padding: 5,
  },
  pageChatGroupInviteText: {
    paddingTop: 15,
    fontSize: globalStyles.fontSizeTitle,
  },
})

export default styles
