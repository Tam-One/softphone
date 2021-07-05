import svgImages from 'assets/svgImages'
import CustomGradient from 'components/CustomGradient'
import PoweredBy from 'components/PoweredBy'
import { RnText } from 'components/Rn'
import styles from 'pages/PageProfileSingIn/Styles'
import React from 'react'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { SvgXml } from 'react-native-svg'
import { getAuthStore } from 'stores/authStore'
import Nav from 'stores/Nav'
import profileStore from 'stores/profileStore'
import CustomColors from 'utils/CustomColors'
import CustomImages from 'utils/CustomImages'

const InputBox = ({ label, val, icon = '' }) => {
  return (
    <View style={styles.inputBox}>
      {!!val && <RnText style={styles.singInInput}>{label}</RnText>}
      {!!icon && (
        <SvgXml
          width='20'
          height='20'
          xml={icon}
          fill={CustomColors.SVGBlack}
          fillOpacity={1}
        />
      )}
      <RnText style={styles.fieldTextInput}>{val}</RnText>
    </View>
  )
}

const PageProfileSignIn = () => {
  const profileMap =
    profileStore.profilesMap[profileStore.profiles[0]?.id] || {}
  const { id, pbxUsername, pbxTenant, pbxHostname, pbxPort } = profileMap

  return (
    <CustomGradient>
      <ScrollView style={{ paddingBottom: 100 }}>
        <Image
          source={CustomImages.signInBanner}
          style={{
            height: 235,
            width: '100%',
          }}
        />
        <TouchableOpacity
          style={styles.editContainer}
          onPress={() =>
            Nav().goToEditAccount({
              id: id,
              updatingProfile: profileStore.profilesMap[id],
            })
          }
        >
          <RnText
            style={{
              fontSize: 13,
              color: CustomColors.GreyMedium,
              textDecorationLine: 'underline',
            }}
          >
            {'Edit account'}
          </RnText>
        </TouchableOpacity>
        <View style={styles.formView}>
          <InputBox
            label={'UserName'}
            val={pbxUsername}
            icon={svgImages.profileIcon}
          ></InputBox>
          <InputBox
            label={'Tenant'}
            val={pbxTenant}
            icon={svgImages.keyIcon}
          ></InputBox>
          <InputBox
            label={'Hostname'}
            val={pbxHostname}
            icon={svgImages.webIcon}
          ></InputBox>
          <InputBox
            label={'Port'}
            val={pbxPort}
            icon={svgImages.cableDataIcon}
          ></InputBox>
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.actionBtnContainer}>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => getAuthStore().signIn(id)}
            >
              <RnText style={styles.signInButtonText}>{'Sign in'}</RnText>
            </TouchableOpacity>
          </View>
          <PoweredBy containerStyle={styles.poweredByView} />
        </View>
      </ScrollView>
    </CustomGradient>
  )
}

export default PageProfileSignIn
