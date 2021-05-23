import React, { FC } from 'react'
import { Image, TouchableOpacityProps, View } from 'react-native'

import CustomImages from '../../utils/CustomImages'
import { RnText } from '../Rn'
import styles from './Styles'

const PoweredBy: FC<{
  containerStyle?: TouchableOpacityProps['style']
}> = p => (
  <View style={[styles.poweredBy, p.containerStyle]}>
    <RnText style={styles.poweredByText}>{'POWERED BY'}</RnText>
    <Image source={CustomImages.QooqieLogo} style={styles.qooqieLogo}></Image>
  </View>
)

export default PoweredBy
