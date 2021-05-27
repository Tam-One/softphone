import {
  mdiAccountCircleOutline,
  mdiApplication,
  mdiClose,
  mdiDotsHorizontal,
  mdiServerNetwork,
  mdiWeb,
} from '@mdi/js'
import Field from 'components/Field/Field'
import FooterActions from 'components/FooterActions'
import styles from 'components/ProfileSignInItem/Styles'
import { RnText, RnTouchableOpacity } from 'components/Rn'
import { observer } from 'mobx-react'
import React, { FC } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { getAuthStore } from 'stores/authStore'
import intl from 'stores/intl'
import Nav from 'stores/Nav'
import profileStore from 'stores/profileStore'
import RnAlert from 'stores/RnAlert'
import CustomColors from 'utils/CustomColors'

const ProfileSignInItem: FC<{
  empty?: boolean
  id?: string
  last?: boolean
}> = observer(props => {
  if (props.empty || !props.id) {
    return (
      <View style={[styles.profileSignInItem, styles.profileSignInItemEmpty]}>
        <RnText subTitle>{intl`No account`}</RnText>
        <RnText>{intl`There is no account created`}</RnText>
        <RnText>{intl`Tap the below button to create one`}</RnText>
        <View style={styles.profileSignInItemBtns}>
          <FooterActions
            onNext={Nav().goToPageProfileCreate}
            onNextText={intl`CREATE NEW ACCOUNT`}
          />
        </View>
      </View>
    )
  }
  const p = profileStore.profilesMap[props.id]
  const isLoading = profileStore.pnSyncLoadingMap[props.id]
  return (
    <View
      style={[
        styles.profileSignInItem,
        props.last && styles.profileSignInItemLast,
      ]}
    >
      <RnTouchableOpacity
        onPress={() => Nav().goToPageProfileUpdate({ id: p.id })}
      >
        <Field
          icon={mdiAccountCircleOutline}
          label={intl`USERNAME`}
          value={p.pbxUsername}
        />
        <Field icon={mdiApplication} label={intl`TENANT`} value={p.pbxTenant} />
        <Field icon={mdiWeb} label={intl`HOSTNAME`} value={p.pbxHostname} />
        <Field icon={mdiServerNetwork} label={intl`PORT`} value={p.pbxPort} />
      </RnTouchableOpacity>
      <Field
        label={intl`PUSH NOTIFICATION`}
        onValueChange={(v: boolean) =>
          profileStore.upsertProfile({ id: p.id, pushNotificationEnabled: v })
        }
        type='Switch'
        value={p.pushNotificationEnabled}
      />
      <Field
        label={intl`UC`}
        onValueChange={(v: boolean) =>
          profileStore.upsertProfile({ id: p.id, ucEnabled: v })
        }
        type='Switch'
        value={p.ucEnabled}
      />
      <View style={styles.profileSignInItemBtns}>
        <FooterActions
          onBack={() => {
            RnAlert.prompt({
              title: intl`Remove Account`,
              message: (
                <>
                  <View>
                    <RnText small>
                      {p.pbxUsername} - {p.pbxHostname}
                    </RnText>
                  </View>
                  <RnText>{intl`Do you want to remove this account?`}</RnText>
                </>
              ),
              onConfirm: () => {
                profileStore.removeProfile(p.id)
              },
            })
          }}
          onBackIcon={mdiClose}
          onMore={() => Nav().goToPageProfileUpdate({ id: p.id })}
          onMoreIcon={mdiDotsHorizontal}
          onNext={() => {
            getAuthStore().signIn(p.id)
          }}
          onNextText={intl`SIGN IN`}
        />
      </View>
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size='small' color={CustomColors.White} />
        </View>
      )}
    </View>
  )
})

export default ProfileSignInItem
