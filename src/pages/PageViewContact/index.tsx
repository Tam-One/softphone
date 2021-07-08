import { mdiBriefcase, mdiCellphone, mdiHome, mdiPhone } from '@mdi/js'
import CustomHeader from 'components/CustomHeader'
import CustomLayout from 'components/CustomLayout'
import { RnIcon, RnText } from 'components/Rn'
import styles from 'pages/PageViewContact/Styles'
import React from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import UserAvatar from 'react-native-user-avatar'
import callStore from 'stores/callStore'
import { Phonebook2 } from 'stores/contactStore'
import Nav from 'stores/Nav'
import RnPicker from 'stores/RnPicker'
import CustomColors from 'utils/CustomColors'

const InputBox = ({ label, val, icon = '', style = {} }) => {
  return (
    <View style={styles.inputBox}>
      {icon ? (
        <View>
          <RnIcon path={icon} color={CustomColors.SVGBlack} size={18} />
        </View>
      ) : (
        <></>
      )}
      {val ? (
        <RnText style={[styles.fieldTextInput, style]}>{val}</RnText>
      ) : (
        <RnText style={[styles.fieldTextPlaceholder]}>{label}</RnText>
      )}
    </View>
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
  if (workNumber) {
    numbers.push({
      key: 'workNumber',
      value: workNumber,
      icon: mdiBriefcase,
    })
  }
  if (cellNumber) {
    numbers.push({
      key: 'cellNumber',
      value: cellNumber,
      icon: mdiCellphone,
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
            label={'CellNumber'}
            val={cellNumber}
            style={styles.cellNumberText}
          ></InputBox>
          <InputBox
            label={'WorkNumber'}
            val={workNumber}
            icon={mdiBriefcase}
          ></InputBox>
          <InputBox
            label={'HomeNumber'}
            val={homeNumber}
            icon={mdiHome}
          ></InputBox>
          <View style={styles.secondForm}>
            <InputBox label={'Job'} val={job}></InputBox>
            <InputBox label={'Company'} val={company}></InputBox>
            <InputBox label={'Address'} val={address}></InputBox>
          </View>
        </View>

        <View style={styles.footerContainer}></View>
      </ScrollView>
    </CustomLayout>
  )
}

export default PageViewContact
