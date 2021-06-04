import { observer } from 'mobx-react'
import React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { RTCView } from 'react-native-webrtc'

const css = StyleSheet.create({
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
})

declare global {
  interface MediaStream {
    toURL(): string
  }
}

export default observer(
  (props: { sourceObject?: MediaStream | null; style?: object | {} }) => {
    const { sourceObject, style } = props
    return sourceObject ? (
      <RTCView
        streamURL={sourceObject.toURL()}
        style={{ ...css.video, ...style }}
        objectFit='cover'
        mirror={true}
      />
    ) : (
      <ActivityIndicator style={css.video} />
    )
  },
)
