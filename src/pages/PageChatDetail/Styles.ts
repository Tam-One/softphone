import { StyleSheet } from 'react-native'

import globalStyles from '@/components/variables'

const styles = StyleSheet.create({
  loadMore: {
    alignSelf: 'center',
    paddingBottom: 15,
    fontSize: globalStyles.fontSizeSmall,
    paddingHorizontal: 10,
  },
  loadMoreBtn: {
    color: globalStyles.colors.primary,
  },
  loadMoreFinished: {
    color: globalStyles.colors.warning,
  },
})

export default styles
