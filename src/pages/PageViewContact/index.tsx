import { mdiBriefcase, mdiCellphone, mdiHome, mdiPhone } from '@mdi/js'
import CustomHeader from 'components/CustomHeader'
import CustomLayout from 'components/CustomLayout'
import { RnIcon, RnText } from 'components/Rn'
import styles from 'pages/PageViewContact/Styles'
import React, { FC } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import UserAvatar from 'react-native-user-avatar'
import callStore from 'stores/callStore'
import { Phonebook2 } from 'stores/contactStore'
import Nav from 'stores/Nav'
import RnPicker from 'stores/RnPicker'
import CustomColors from 'utils/CustomColors'

const InputBox: FC<{
  label: string
  val: string
  icon?: string
  style?: object
  onPress?(): void
}> = ({ label, val, icon, style, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.inputBox}
      onPress={onPress}
      disabled={!onPress || !val}
    >
      {icon ? (
        <View>
          <RnIcon path={icon} color={CustomColors.SVGBlack} size={18} />
        </View>
      ) : (
        <></>
      )}
      {val ? (
        <View>
          <RnText style={[styles.fieldTextInput, style]}>{val}</RnText>
        </View>
      ) : (
        <RnText style={[styles.fieldTextPlaceholder]}>{label}</RnText>
      )}
    </TouchableOpacity>
  )
}

const callRequest = (number: string, u: Phonebook2) => {
  if (number !== '') {
    callStore.startCall(number.replace(/\s+/g, ''))
  }
}

const onCallPress = (user: Phonebook2, number: string) => {
  if (!user || !number) {
    return
  }
  const { workNumber, cellNumber, homeNumber } = user
  const numbers: {
    key: string
    value: string
    icon: string
  }[] = []
  if (cellNumber) {
    numbers.push({
      key: 'cellNumber',
      value: cellNumber,
      icon: mdiCellphone,
    })
  }
  if (workNumber) {
    numbers.push({
      key: 'workNumber',
      value: workNumber,
      icon: mdiBriefcase,
    })
  }
  if (homeNumber) {
    numbers.push({
      key: 'homeNumber',
      value: homeNumber,
      icon: mdiHome,
    })
  }

  if (numbers.length === 1) {
    callRequest(numbers[0].value, user)
    return
  }

  RnPicker.open({
    options: numbers.map(num => ({
      key: num.value,
      label: num.value,
      icon: num.icon,
    })),
    onSelect: (ele: string) => callRequest(ele, user),
  })
}

const PageViewContact = ({ contact }) => {
  console.log(JSON.stringify(contact))

  const {
    id,
    name,
    firstName,
    lastName,
    workNumber,
    cellNumber,
    homeNumber,
    job,
    book,
    company,
    hidden,
    shared,
    loaded,
    address,
    email,
  } = contact

  const phoneNumber = cellNumber || workNumber || homeNumber

  return (
    <CustomLayout menu='contact' subMenu='phonebook' hideSubMenu={true}>
      <CustomHeader
        onBack={Nav().goToPageContactPhonebook}
        backText={'Contacts'}
        onRightButtonPress={() =>
          Nav().goToPagePhonebookUpdate({
            contact: contact,
          })
        }
        rightButtonText={'Edit'}
        backContainerStyle={styles.backButtonContainer}
      ></CustomHeader>
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.headerAvatar}>
          <View style={styles.nameAvatarContainer}>
            <UserAvatar
              size={100}
              name={name}
              bgColor={CustomColors.DodgerBlue}
            />
          </View>
          <RnText style={styles.callerName}>{name}</RnText>
        </View>
        <View style={styles.actionBtnContainer}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => onCallPress(contact, phoneNumber)}
          >
            <RnIcon color={CustomColors.White} path={mdiPhone} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.formView}>
          <InputBox
            label={'Mobile number'}
            val={cellNumber}
            style={styles.cellNumberText}
            onPress={() => callRequest(cellNumber, contact)}
          ></InputBox>
          <InputBox
            label={'Work number'}
            val={workNumber}
            icon={mdiBriefcase}
            style={styles.cellNumberText}
            onPress={() => callRequest(workNumber, contact)}
          ></InputBox>
          <InputBox
            label={'Home number'}
            val={homeNumber}
            icon={mdiHome}
            style={styles.cellNumberText}
            onPress={() => callRequest(homeNumber, contact)}
          ></InputBox>
          <View style={styles.secondForm}>
            <InputBox label={'Job'} val={job}></InputBox>
            <InputBox label={'Company'} val={company}></InputBox>
            <InputBox label={'Address'} val={address}></InputBox>
            <InputBox label={'Email'} val={email}></InputBox>
          </View>
        </View>

        <View style={styles.footerContainer}></View>
      </ScrollView>
    </CustomLayout>
  )
}

export default PageViewContact
