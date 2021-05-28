import {
  mdiAccountCircleOutline,
  mdiApplication,
  mdiClose,
  mdiDotsHorizontal,
  mdiServerNetwork,
  mdiWeb,
} from '@mdi/js'
import Field from 'components/Field'
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
}> = observer(({ empty, id: profileId, last }) => {
  if (empty || !profileId) {
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
  const profileMap = profileStore.profilesMap[profileId]
  const {
    id,
    pbxUsername,
    pbxTenant,
    pbxHostname,
    pbxPort,
    pushNotificationEnabled,
    ucEnabled,
  } = profileMap
  const isLoading = profileStore.pnSyncLoadingMap[profileId]
  return (
    <View
      style={[styles.profileSignInItem, last && styles.profileSignInItemLast]}
    >
      <RnTouchableOpacity
        onPress={() => Nav().goToPageProfileUpdate({ id: id })}
      >
        <Field
          icon={mdiAccountCircleOutline}
          label={intl`USERNAME`}
          value={pbxUsername}
        />
        <Field icon={mdiApplication} label={intl`TENANT`} value={pbxTenant} />
        <Field icon={mdiWeb} label={intl`HOSTNAME`} value={pbxHostname} />
        <Field icon={mdiServerNetwork} label={intl`PORT`} value={pbxPort} />
      </RnTouchableOpacity>
      <Field
        label={intl`PUSH NOTIFICATION`}
        onValueChange={(v: boolean) =>
          profileStore.upsertProfile({ id: id, pushNotificationEnabled: v })
        }
        type='Switch'
        value={pushNotificationEnabled}
      />
      <Field
        label={intl`UC`}
        onValueChange={(v: boolean) =>
          profileStore.upsertProfile({ id: id, ucEnabled: v })
        }
        type='Switch'
        value={ucEnabled}
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
                      {pbxUsername} - {pbxHostname}
                    </RnText>
                  </View>
                  <RnText>{intl`Do you want to remove this account?`}</RnText>
                </>
              ),
              onConfirm: () => {
                profileStore.removeProfile(id)
              },
            })
          }}
          onBackIcon={mdiClose}
          onMore={() => Nav().goToPageProfileUpdate({ id: id })}
          onMoreIcon={mdiDotsHorizontal}
          onNext={() => {
            getAuthStore().signIn(id)
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
