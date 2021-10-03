import svgImages from 'assets/svgImages'
import CustomGradient from 'components/CustomGradient'
import FormInputBox from 'components/FormInputBox'
import PoweredBy from 'components/PoweredBy'
import { RnText } from 'components/Rn'
import { cloneDeep } from 'lodash'
import get from 'lodash/get'
import styles from 'pages/PageProfileSingIn/Styles'
import React, { FC, useState } from 'react'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { SvgXml } from 'react-native-svg'
import { getAuthStore } from 'stores/authStore'
import profileStore from 'stores/profileStore'
import CustomColors from 'utils/CustomColors'
import CustomImages from 'utils/CustomImages'
import useStore from 'utils/useStore'

const InputBox: FC<{
  label: string
  val: string
  icon: string
  style?: object
  onPress?(): void
}> = ({ label, val, icon, style, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.inputBox}
      onPress={onPress}
      disabled={!onPress}
    >
      {val ? <RnText style={styles.singInInput}>{label}</RnText> : <></>}
      {icon ? (
        <SvgXml
          width='20'
          height='20'
          xml={icon}
          fill={CustomColors.SVGBlack}
          fillOpacity={1}
        />
      ) : (
        <></>
      )}
      <RnText style={styles.fieldTextInput}>{val}</RnText>
    </TouchableOpacity>
  )
}

const PageProfileSignIn = () => {
  const [fieldErrors, setFieldErrors] = useState({})
  const profileMap =
    profileStore.profilesMap[profileStore.profiles[0]?.id] || {}
  const { id, pbxUsername, pbxTenant, pbxHostname, pbxPort } = profileMap

  const storeObj = () => ({
    observable: {
      profile: {
        ...profileStore.genEmptyProfile(),
        ...cloneDeep(profileStore.profilesMap[id]),
      },
      addingPark: '',
    },
  })
  type M0 = ReturnType<typeof storeObj>
  type M = Omit<M0, 'observable'> &
    M0['observable'] &
    ReturnType<typeof useStore>
  const store = (useStore(storeObj) as any) as M
  const [profileObj, setProfileObj] = useState(get(store, 'profile'))

  const onTextChange = (key, val) => {
    let fieldErrorsCopy = { ...fieldErrors }
    fieldErrorsCopy[key] = false
    setFieldErrors(fieldErrorsCopy)
    store.set('profile.' + key, val)
    const data = { ...profileObj }
    data[key] = val
    setProfileObj({ ...data })
  }

  const onSavePress = () => {
    const { profile } = store
    const { pbxUsername, pbxPassword, pbxTenant } = profile
    if (!pbxUsername || !pbxPassword || !pbxTenant) {
      setFieldErrors({
        pbxUsername: !pbxUsername,
        pbxPassword: !pbxPassword,
        pbxTenant: !pbxTenant,
      })
      return
    }
    profile.pbxPhoneIndex = '4'
    profile.pbxHostname = 'spt.qooqie.com'
    profile.pbxPort = '8443'
    profile.pushNotificationEnabled = true
    profile.ucEnabled = false
    profile.pbxTurnEnabled = false
    profileStore.upsertProfile(profile)
    const profileMap =
      profileStore.profilesMap[profileStore.profiles[0]?.id] || {}
    const { id } = profileMap
    getAuthStore().signIn(id)
  }

  return (
    <CustomGradient>
      <ScrollView>
        <Image
          source={CustomImages.signInBanner}
          style={{
            height: 235,
            width: '100%',
          }}
        />
        <View style={styles.formView}>
          <FormInputBox
            label={'Username'}
            val={get(store, 'profile.pbxUsername')}
            onTextChange={text => onTextChange('pbxUsername', text)}
            required={true}
            showError={fieldErrors['pbxUsername']}
            icon={svgImages.profileIcon}
          />
          <FormInputBox
            label={'Tenant'}
            val={get(store, 'profile.pbxTenant')}
            onTextChange={text => onTextChange('pbxTenant', text)}
            icon={svgImages.keyIcon}
            containerStyle={{ marginTop: 16 }}
            required={true}
            showError={fieldErrors['pbxTenant']}
          />
          <FormInputBox
            label={'Password'}
            val={get(store, 'profile.pbxPassword')}
            onTextChange={text => onTextChange('pbxPassword', text)}
            required={true}
            showError={fieldErrors['pbxPassword']}
            containerStyle={{ marginTop: 16 }}
            icon={svgImages.lockButton}
            iconStyle={{ marginBottom: 10 }}
            secureEntry={true}
          />
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.actionBtnContainer}>
            <TouchableOpacity style={styles.signInButton} onPress={onSavePress}>
              <RnText style={styles.signInButtonText}>{'Sign in'}</RnText>
            </TouchableOpacity>
          </View>
        </View>
        <PoweredBy containerStyle={styles.poweredByView} />
      </ScrollView>
    </CustomGradient>
  )
}

export default PageProfileSignIn
