import { StyleSheet } from 'react-native'

import globalVariables from '../variables'

const {
  colors: { primaryFn },
} = globalVariables

const styles = StyleSheet.create({
  unread: {
    backgroundColor: primaryFn(0.5),
  },
})

export default styles
