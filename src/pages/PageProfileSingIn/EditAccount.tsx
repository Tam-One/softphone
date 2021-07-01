import CustomGradient from 'components/CustomGradient'
import PoweredBy from 'components/PoweredBy'
import { RnText } from 'components/Rn'
import RnTextInput from 'components/RnTextInput'
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

const InputBox = ({ label, val, onTextChange }) => {
  return (
    <View style={styles.inputBox}>
      {!!val && <RnText style={styles.inputBoxLabel}>{label}</RnText>}
      <RnTextInput
        disabled={true}
        style={styles.fieldTextInput}
        value={val}
        onChangeText={(text: string) => {
          onTextChange(text)
        }}
        placeholder={label}
        placeholderTextColor={CustomColors.lightBlack}
      />
    </View>
  )
}

const EditAccount: FC<{
  id: string
  updatingProfile?: Profile
}> = ({ id, updatingProfile }) => {
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
    store.set('profile.' + key, val)
    const data = { ...profileObj }
    data[key] = val
    setProfileObj({ ...data })
  }

  const resetAllFields = () => {
    const data = (p: Profile) => ({
      ...profileStore.genEmptyProfile(),
      ...cloneDeep(updatingProfile),
      id: p.id,
    })
    store.set('profile', data)
    setProfileObj(get(store, 'profile'))
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
        <InputBox
          label={'UserName'}
          val={get(store, 'profile.pbxUsername')}
          onTextChange={text => onTextChange('pbxUsername', text)}
        ></InputBox>
        <InputBox
          label={'Tenant'}
          val={get(store, 'profile.pbxTenant')}
          onTextChange={text => onTextChange('pbxTenant', text)}
        ></InputBox>
        <InputBox
          label={'Hostname'}
          val={get(store, 'profile.pbxHostname')}
          onTextChange={text => onTextChange('pbxHostname', text)}
        ></InputBox>
        <InputBox
          label={'Port'}
          val={get(store, 'profile.pbxPort')}
          onTextChange={text => onTextChange('pbxPort', text)}
        ></InputBox>
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.actionBtnContainer}>
          <TouchableOpacity
            style={[
              styles.signInButton,
              { backgroundColor: CustomColors.LightDowny },
            ]}
            onPress={() => {
              profileStore.upsertProfile(store.profile)
              Nav().backToPageProfileSignIn()
            }}
          >
            <RnText style={styles.saveButton}>{'Save'}</RnText>
          </TouchableOpacity>
        </View>
        <PoweredBy containerStyle={styles.poweredByView} />
      </View>
    </CustomGradient>
  )
}

export default EditAccount
