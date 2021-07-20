import CustomGradient from 'components/CustomGradient'
import FormInputBox from 'components/FormInputBox'
import PoweredBy from 'components/PoweredBy'
import { RnText } from 'components/Rn'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import styles from 'pages/PageProfileSingIn/Styles'
import React, { FC, useState } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import Nav from 'stores/Nav'
import profileStore, { Profile } from 'stores/profileStore'
import CustomColors from 'utils/CustomColors'
import CustomImages from 'utils/CustomImages'
import useStore from 'utils/useStore'

const EditAccount: FC<{
  id: string
  updatingProfile?: Profile
}> = ({ id, updatingProfile }) => {
  const [fieldErrors, setFieldErrors] = useState({})

  const storeObj = () => ({
    observable: {
      profile: {
        ...profileStore.genEmptyProfile(),
        ...cloneDeep(updatingProfile),
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

  const resetAllFields = () => {
    setFieldErrors({})
    const data = (p: Profile) => ({
      ...profileStore.genEmptyProfile(),
      ...cloneDeep(updatingProfile),
      id: p.id,
    })
    store.set('profile', data)
    setProfileObj(get(store, 'profile'))
  }

  const onSavePress = () => {
    const { profile } = store
    const { pbxUsername, pbxPassword, pbxHostname, pbxPort } = profile
    if (!pbxUsername || !pbxPassword || !pbxHostname || !pbxPort) {
      setFieldErrors({
        pbxUsername: !pbxUsername,
        pbxPassword: !pbxPassword,
        pbxHostname: !pbxHostname,
        pbxPort: !pbxPort,
      })
      return
    }
    profile.pbxPhoneIndex = '4'
    profileStore.upsertProfile(profile)
    Nav().backToPageProfileSignIn()
  }

  return (
    <CustomGradient>
      <View style={styles.backBtnRow}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => Nav().backToPageProfileSignIn()}
        >
          <Image
            source={CustomImages.HeaderBackButton}
            style={styles.buttonIcon}
          ></Image>
          <RnText style={styles.backText}>{'Back to sign in'}</RnText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            resetAllFields()
          }}
        >
          <RnText style={styles.resetButton}>{'Reset form'}</RnText>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <FormInputBox
          label={'UserName'}
          val={get(store, 'profile.pbxUsername')}
          onTextChange={text => onTextChange('pbxUsername', text)}
          required={true}
          showError={fieldErrors['pbxUsername']}
        />
        <FormInputBox
          label={'Password'}
          val={get(store, 'profile.pbxPassword')}
          onTextChange={text => onTextChange('pbxPassword', text)}
          required={true}
          showError={fieldErrors['pbxPassword']}
        />
        <FormInputBox
          label={'Tenant'}
          val={get(store, 'profile.pbxTenant')}
          onTextChange={text => onTextChange('pbxTenant', text)}
        />
        <FormInputBox
          label={'Hostname'}
          val={get(store, 'profile.pbxHostname')}
          onTextChange={text => onTextChange('pbxHostname', text)}
          required={true}
          showError={fieldErrors['pbxHostname']}
        />
        <FormInputBox
          label={'Port'}
          val={get(store, 'profile.pbxPort')}
          onTextChange={text => onTextChange('pbxPort', text)}
          required={true}
          showError={fieldErrors['pbxPort']}
        />
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.actionBtnContainer}>
          <TouchableOpacity
            style={[
              styles.signInButton,
              { backgroundColor: CustomColors.LightDowny },
            ]}
            onPress={onSavePress}
          >
            <RnText style={styles.saveButton}>{'Save'}</RnText>
          </TouchableOpacity>
        </View>
      </View>
      <PoweredBy containerStyle={styles.poweredByView} />
    </CustomGradient>
  )
}

export default EditAccount
