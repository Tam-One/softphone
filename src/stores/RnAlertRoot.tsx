import flow from 'lodash/flow'
import { observer } from 'mobx-react'
import React, { ReactElement } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

import g from '../components/variables'
import VideoPopup from '../pages/PageCallManage/VideoPopup'
import { useAnimationOnDidMount } from '../utils/animation'
import intl from './intl'
import RnAlert, { ErrorRnAlert2, PromptRnAlert } from './RnAlert'

const css = StyleSheet.create({
  RootRnAlert: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  RootRnAlert_Backdrop: {
    backgroundColor: g.layerBg,
  },
  RootRnAlert_Modal: {
    width: '90%',
    maxWidth: g.maxModalWidth,
    borderRadius: g.borderRadius,
    padding: 15,
    backgroundColor: g.bg,
    ...g.boxShadow,
  },
  RootRnAlert_Message: {
    marginTop: 15,
  },
  RootRnAlert_Err: {
    alignSelf: 'flex-start',
  },
  RootRnAlert_ErrTxt: {
    color: g.colors.danger,
    fontWeight: g.fontWeight,
  },
  RootRnAlert_ErrTxt__title: {
    fontWeight: 'bold',
  },
  RootRnAlert_Btns: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    top: 5,
    left: 5,
    marginTop: 15,
  },
  RootRnAlert_Btn: {
    borderRadius: g.borderRadius,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: g.colors.primary,
    width: 100,
  },
  RootRnAlert_Btn__cancel: {
    backgroundColor: g.revBg,
    marginRight: 10,
  },
  RootRnAlert_BtnTxt: {
    textAlign: 'center',
    color: g.revColor,
  },
})

const RnAlertR = ({
  error,
  prompt,
}: {
  error?: ErrorRnAlert2
  prompt?: PromptRnAlert
}) => {
  const a = useAnimationOnDidMount({
    opacity: [0, 1],
    translateY: [Dimensions.get('window').height, 0],
  })
  let props: {
    title: string | ReactElement
    message: string | ReactElement
    dismissText?: string | boolean
    confirmText?: string | boolean
    onConfirm(): void
    onDismiss(): void
  }
  if (prompt) {
    const { message, onConfirm, onDismiss, title, ...rest } = prompt
    props = {
      title,
      message,
      dismissText: intl`CANCEL`,
      confirmText: intl`REMOVE`,
      onConfirm: flow(
        [RnAlert.dismiss, onConfirm as any].filter((f: Function) => f),
      ),
      onDismiss: flow(
        [RnAlert.dismiss, onDismiss as any].filter((f: Function) => f),
      ),
      ...rest,
    }
  } else if (error) {
    const { err, message, unexpectedErr, ...rest } = error
    const errMessage = unexpectedErr?.message || err?.message || err
    props = {
      title: 'Error',
      message: `${unexpectedErr ? 'An unexpected error occurred' : message}.${
        errMessage || ''
      }`,
      confirmText: intl`OK`,
      onConfirm: RnAlert.dismiss,
      onDismiss: RnAlert.dismiss,
      ...rest,
    }
  } else {
    return null
  }
  return (
    <View style={[StyleSheet.absoluteFill, css.RootRnAlert]}>
      <VideoPopup
        title={props.title.toString()}
        showOk={true}
        onOkPress={props.onDismiss}
        okText={'OK'}
        hideCancel={!props.dismissText}
        onCancel={props.onConfirm}
        header={props.message?.toString()}
      ></VideoPopup>
    </View>
  )
}

const RootRnAlert = observer(() => {
  if (!RnAlert.alertsCount || !RnAlert.alerts[0]) {
    return null
  }
  return <RnAlertR {...RnAlert.alerts[0]} />
})

export default RootRnAlert
