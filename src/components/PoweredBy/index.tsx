import React, { FC } from 'react'
import { Image, TouchableOpacityProps, View } from 'react-native'

import styles from '@/components/PoweredBy/Styles'
import { RnText } from '@/components/Rn'
import CustomImages from '@/utils/CustomImages'

const PoweredBy: FC<{
  containerStyle?: TouchableOpacityProps['style']
}> = ({ containerStyle }) => (
  <View style={[styles.poweredBy, containerStyle]}>
    <RnText style={styles.poweredByText}>{'POWERED BY'}</RnText>
    <Image source={CustomImages.QooqieLogo} style={styles.qooqieLogo}></Image>
  </View>
)

export default PoweredBy
