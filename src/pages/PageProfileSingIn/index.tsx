import svgImages from 'assets/svgImages'
import CustomGradient from 'components/CustomGradient'
import PoweredBy from 'components/PoweredBy'
import { RnText } from 'components/Rn'
import styles from 'pages/PageProfileSingIn/Styles'
import React, { FC } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { SvgXml } from 'react-native-svg'
import { getAuthStore } from 'stores/authStore'
import Nav from 'stores/Nav'
import profileStore from 'stores/profileStore'
import CustomColors from 'utils/CustomColors'
import CustomImages from 'utils/CustomImages'

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

const onFieldPress = id => {
  Nav().goToEditAccount({
    id: id,
    updatingProfile: profileStore.profilesMap[id],
  })
}

const PageProfileSignIn = () => {
  const profileMap =
    profileStore.profilesMap[profileStore.profiles[0]?.id] || {}
  const { id, pbxUsername, pbxTenant, pbxHostname, pbxPort } = profileMap

  return (
    <CustomGradient>
      <Image
        source={CustomImages.signInBanner}
        style={{
          height: 235,
          width: '100%',
        }}
      />
      <View style={styles.formView}>
        <InputBox
          label={'Username'}
          val={pbxUsername}
          icon={svgImages.profileIcon}
          onPress={() => onFieldPress(id)}
        ></InputBox>
        <InputBox
          label={'Tenant'}
          val={pbxTenant}
          icon={svgImages.keyIcon}
          onPress={() => onFieldPress(id)}
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
      </View>
      <PoweredBy containerStyle={styles.poweredByView} />
    </CustomGradient>
  )
}

export default PageProfileSignIn
