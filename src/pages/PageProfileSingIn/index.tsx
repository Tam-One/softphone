import { cloneDeep } from 'lodash'
import get from 'lodash/get'
import React, { FC, useEffect, useState } from 'react'
import {
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { SvgXml } from 'react-native-svg'

import svgImages from '@/assets/svgImages'
import CustomGradient from '@/components/CustomGradient'
import FormInputBox from '@/components/FormInputBox'
import PoweredBy from '@/components/PoweredBy'
import { RnText } from '@/components/Rn'
import styles from '@/pages/PageProfileSingIn/Styles'
import { getAuthStore } from '@/stores/authStore'
import profileStore from '@/stores/profileStore'
import CustomColors from '@/utils/CustomColors'
import CustomImages from '@/utils/CustomImages'
import useStore from '@/utils/useStore'

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
      {/* {icon ? (
        <SvgXml
          width='20'
          height='20'
          xml={icon}
          fill={CustomColors.SVGBlack}
          fillOpacity={1}
        />
      ) : (
        <></>
      )} */}
      <RnText style={styles.fieldTextInput}>{val}</RnText>
    </TouchableOpacity>
  )
}

const PageProfileSignIn = () => {
  const [fieldErrors, setFieldErrors] = useState({})
  const [passwordView, setPasswordView] = useState(false)

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

  const [open, setOpen] = useState(false)
  const [selectedServer, setSelectedServer] = useState(
    get(store, 'profile.pbxHostname') || 'sip2.qooqie.com',
  )
  const serverConfig = [
    { label: 'Qooqie', value: 'sip2.qooqie.com' },
    { label: 'Tam One', value: 'sip2.voipcentrale.nl' },
    { label: 'Test', value: 'spt.qooqie.com' },
  ]
  const prodServerConfig = [
    { label: 'Qooqie', value: 'sip2.qooqie.com' },
    { label: 'Tam One', value: 'sip2.voipcentrale.nl' },
  ]
  const testingServer = {
    label: 'Test',
    value: 'spt.qooqie.com',
  }
  const [servers, setServers] = useState(serverConfig)

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
    profile.pbxHostname = selectedServer
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

  useEffect(() => {
    if (get(store, 'profile.pbxTenant') !== 'callback') {
      let server = serverConfig.filter(ele => ele.value !== 'spt.qooqie.com')
      setServers(server)
    }
  }, [])

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
            onTextChange={text => {
              let data = prodServerConfig
              if (text === 'callback') {
                data.push(testingServer)
              } else if (selectedServer === 'spt.qooqie.com') {
                setSelectedServer('sip2.qooqie.com')
              }
              setServers(data)
              onTextChange('pbxTenant', text)
            }}
            icon={svgImages.keyIcon}
            containerStyle={{ marginTop: 16 }}
            required={true}
            showError={fieldErrors['pbxTenant']}
          />
          <View
            style={[
              styles.serverView,
              Platform.OS !== 'android' && { zIndex: 99 },
            ]}
          >
            <RnText
              style={[
                styles.inputBoxLabel,
                open && { backgroundColor: CustomColors.White },
              ]}
            >
              {'Server'}
            </RnText>

            <DropDownPicker
              showTickIcon={false}
              open={open}
              value={selectedServer}
              items={servers}
              setOpen={setOpen}
              setValue={text => {
                onTextChange('pbxHostname', text)
                setSelectedServer(text)
              }}
              setItems={setServers}
              style={[styles.serverStyle, open && styles.activeView]}
              textStyle={styles.serverText}
              containerStyle={[styles.serverContainer]}
              dropDownContainerStyle={styles.dropDownContainer}
              dropDownDirection='BOTTOM'
              selectedItemContainerStyle={styles.selectedItemContainer}
              listItemContainerStyle={styles.listItemContainer}
            />
          </View>
          <FormInputBox
            label={'Password'}
            val={get(store, 'profile.pbxPassword')}
            onTextChange={text => onTextChange('pbxPassword', text)}
            required={true}
            showError={fieldErrors['pbxPassword']}
            containerStyle={{ marginTop: 16 }}
            icon={svgImages.lockButton}
            iconStyle={{ marginBottom: 10 }}
            secureEntry={!passwordView}
            rightIcon={passwordView ? svgImages.eyeOffIcon : svgImages.eyeIcon}
            rightIconOnClick={() => setPasswordView(!passwordView)}
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
