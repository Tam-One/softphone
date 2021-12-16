import { Platform, StyleSheet } from 'react-native'

import g from '@/components/variables'
import CustomColors from '@/utils/CustomColors'

const styles = StyleSheet.create({
  fieldButton: {
    alignSelf: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
    width: 305,
    backgroundColor: CustomColors.White,
    borderRadius: g.borderRadius,
    overflow: 'hidden',
  },
  inner: {
    ...Platform.select({
      android: {
        top: 1,
      },
      default: {
        top: -5,
      },
    }),
  },
  createBtn: {
    ...Platform.select({
      android: {
        top: 8,
      },
      default: {
        top: 15,
      },
    }),
  },
  createBtnIcon: {
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
})

export default styles
