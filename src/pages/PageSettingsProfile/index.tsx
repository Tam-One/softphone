import { mdiAccount, mdiGreaterThan, mdiLock } from '@mdi/js'
import CustomHeader from 'components/CustomHeader'
import CustomLayout from 'components/CustomLayout'
import { RnIcon } from 'components/Rn'
import RnText from 'components/RnText'
import RnTextInput from 'components/RnTextInput'
import styles from 'pages/PageSettingsProfile/Styles'
import React, { useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import CustomColors from 'utils/CustomColors'

import { getAuthStore } from '../../stores/authStore'

const InputBox = ({ val, icon = '' }) => {
  return (
    <View style={styles.inputBox}>
      {!!icon && (
        <View>
          <RnIcon path={icon} color={CustomColors.GreyMedium} size={18} />
        </View>
      )}
      <RnTextInput disabled style={styles.fieldTextInput} value={val} />
    </View>
  )
}

const SettingsView = ({ onPress }) => {
  const { pbxUsername, pbxPassword, pbxTenant } = getAuthStore().currentProfile

  return (
    <>
      <CustomHeader
        title={'Settings'}
        hideBackText={true}
        backContainerStyle={styles.backButtonContainer}
      />
      <View style={styles.formView}>
        <RnText style={styles.heading}>{'Username & password'}</RnText>
        <InputBox val={pbxUsername} icon={mdiAccount}></InputBox>
        <InputBox val={pbxPassword} icon={mdiLock}></InputBox>
      </View>
      <View style={styles.formView}>
        <RnText style={styles.heading}>{'Tenant'}</RnText>
        <InputBox val={pbxTenant}></InputBox>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={onPress}>
        <RnText style={styles.actionText}>{'Advanced settings'} </RnText>
        <View>
          <RnIcon
            path={mdiGreaterThan}
            color={CustomColors.DarkBlue}
            size={18}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.logoutButton]}
        onPress={getAuthStore().signOut}
      >
        <RnText style={styles.logoutText}>{'Logout'} </RnText>
      </TouchableOpacity>
    </>
  )
}

const AdvancedSettingsView = ({ onBackPress }) => {
  const { pbxPort, pbxHostname } = getAuthStore().currentProfile

  return (
    <>
      <CustomHeader
        title={'Advanced'}
        hideBackText={false}
        onBack={onBackPress}
        backContainerStyle={styles.advanceSettingsBack}
      />
      <View style={styles.advanceSettings}>
        <RnText style={styles.heading}>{'Hostname & port'}</RnText>
        <InputBox val={pbxHostname}></InputBox>
        <InputBox val={pbxPort}></InputBox>
      </View>
    </>
  )
}

const PageSettingsProfile = () => {
  const [advancedSettings, setAdvancedSettings] = useState(false)
  return (
    <CustomLayout menu='settings' subMenu='profile' hideSubMenu={true}>
      <ScrollView style={styles.scrollViewContainer}>
        {!advancedSettings && (
          <SettingsView
            onPress={() => setAdvancedSettings(true)}
          ></SettingsView>
        )}
        {advancedSettings && (
          <AdvancedSettingsView
            onBackPress={() => setAdvancedSettings(false)}
          ></AdvancedSettingsView>
        )}
      </ScrollView>
    </CustomLayout>
  )
}

export default PageSettingsProfile
