import { StyleSheet } from 'react-native'

import g from '@/components/variables'
import CustomColors from '@/utils/CustomColors'

const styles = StyleSheet.create({
  profileSignInItem: {
    backgroundColor: g.bg,
    marginBottom: 15,
    marginLeft: 15,
    borderRadius: g.borderRadius,
    width: 280,
  },
  profileSignInItemLast: {
    marginRight: 15,
  },
  profileSignInItemEmpty: {
    height: '70%',
    minHeight: 320,
    marginVertical: 45,
    marginLeft: 15,
    padding: 15,
  },
  profileSignInItemBtns: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CustomColors.Black,
    opacity: 0.3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default styles
