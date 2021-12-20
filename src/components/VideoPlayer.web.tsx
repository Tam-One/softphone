import { observer } from 'mobx-react'
import React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

const css = StyleSheet.create({
  loading: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 50,
  },
})

export default observer(props => {
  const { sourceObject, height, width } = props

  return sourceObject ? (
    <video
      style={{ position: 'absolute', alignSelf: 'flex-end' }}
      autoPlay
      height={height}
      ref={video => {
        if (video) {
          video.srcObject = sourceObject
        }
      }}
      width={width}
    />
  ) : (
    <ActivityIndicator style={css.loading} />
  )
})
