import { mdiDotsHorizontal, mdiLadybug, mdiUnfoldMoreHorizontal } from '@mdi/js'
import BrekekeGradient from 'components/BrekekeGradient'
import Layout from 'components/Layout/Layout'
import ProfileSignInItem from 'components/ProfileSignInItem/ProfileSignInItem'
import { RnIcon, RnText, RnTouchableOpacity } from 'components/Rn'
import { currentVersion } from 'components/variables'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import styles from 'pages/PageProfileSingIn/Styles'
import React from 'react'
import { FlatList, View } from 'react-native'
import intl from 'stores/intl'
import intlStore from 'stores/intlStore'
import Nav from 'stores/Nav'
import profileStore, { Profile } from 'stores/profileStore'
import CustomColors from 'utils/CustomColors'

const PageProfileSignIn = observer(() => {
  const l = profileStore.profiles.length
  return (
    <BrekekeGradient>
      <Layout
        description={intl`${l} accounts in total`}
        noScroll
        onCreate={!!l ? Nav().goToPageProfileCreate : undefined}
        title={intl`Accounts`}
        transparent
      >
        <View style={styles.pageProfileSignInSpacing} />
        {!!l && (
          <FlatList
            data={
              toJS(profileStore.profiles) /* Fix observable inside FlatList */
            }
            horizontal
            keyExtractor={(item: Profile) => item.id}
            renderItem={({ index, item }) => (
              <ProfileSignInItem id={item.id} last={index === l - 1} />
            )}
            showsHorizontalScrollIndicator={false}
            style={styles.pageProfileSignInListServers}
          />
        )}
        {!l && <ProfileSignInItem empty />}
      </Layout>
      <RnTouchableOpacity
        onPress={Nav().goToPageSettingsDebug}
        style={styles.cornerButton}
      >
        <View style={[styles.cornerButtonInner, styles.cornerButtonInnerInfo]}>
          <RnIcon
            color={CustomColors.White}
            path={mdiLadybug}
            size={16}
            style={[styles.cornerButtonInfo, styles.cornerButtonIconInfo]}
          />
          <RnText bold white>
            {currentVersion}
          </RnText>
        </View>
      </RnTouchableOpacity>
      <RnTouchableOpacity
        onPress={intlStore.localeLoading ? undefined : intlStore.selectLocale}
        style={[styles.cornerButton, styles.cornerButtonLanguage]}
      >
        <View
          style={[styles.cornerButtonInner, styles.cornerButtonInnerLanguage]}
        >
          <RnText bold white>
            {intlStore.localeLoading ? '\u200a' : intlStore.localeName}
          </RnText>
          <RnIcon
            color={CustomColors.White}
            path={
              intlStore.localeLoading
                ? mdiDotsHorizontal
                : mdiUnfoldMoreHorizontal
            }
            size={16}
            style={[styles.cornerButtonInfo, styles.cornerButtonIconLanguage]}
          />
        </View>
      </RnTouchableOpacity>
      <View style={styles.space} />
    </BrekekeGradient>
  )
})

export default PageProfileSignIn
