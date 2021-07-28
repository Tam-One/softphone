import CustomHeader from 'components/CustomHeader'
import CustomLayout from 'components/CustomLayout'
import FormInputBox from 'components/FormInputBox'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import styles from 'pages/PagePhonebookUpdate/Styles'
import React, { FC, useState } from 'react'
import { ScrollView, View } from 'react-native'
import useStore from 'utils/useStore'

import pbx from '../../api/pbx'
import contactStore, { Phonebook2 } from '../../stores/contactStore'
import { intlDebug } from '../../stores/intl'
import Nav from '../../stores/Nav'
import RnAlert from '../../stores/RnAlert'

const genEmptyPhonebook = () => {
  return {
    firstName: '',
    lastName: '',
    workNumber: '',
    cellNumber: '',
    homeNumber: '',
    job: '',
    company: '',
    address: '',
    email: '',
    shared: false,
  }
}

const PagePhonebookUpdate: FC<{
  contact: Phonebook2
  newContact?: boolean
}> = ({ contact, newContact }) => {
  const [fieldErrors, setFieldErrors] = useState({})

  const updateContact = (phonebook: Phonebook2) => {
    if (!phonebook.firstName || !phonebook.lastName) {
      setFieldErrors({
        firstName: !phonebook.firstName,
        lastName: !phonebook.lastName,
      })
      return
    }
    phonebook.book = 'default'
    pbx
      .setContact(phonebook)
      .then(() => Nav().goToPageViewContact({ contact }))
      .catch(onSaveFailure)
    Object.assign(phonebook, {
      name: `${phonebook.firstName} ${phonebook.lastName}`,
    })
    contactStore.upsertPhonebook(phonebook)
  }

  const saveNewContact = (phonebook: Phonebook2) => {
    if (!phonebook.firstName || !phonebook.lastName) {
      setFieldErrors({
        firstName: !phonebook.firstName,
        lastName: !phonebook.lastName,
      })
      return
    }
    phonebook.book = 'default'
    pbx
      .setContact({ ...phonebook })
      .then(val => {
        phonebook = Object.assign(phonebook, {
          id: val.aid,
          name: `${phonebook.firstName} ${phonebook.lastName}`,
        })
        contactStore.upsertPhonebook(phonebook)
        const contact = contactStore.getPhonebook(val.aid)
        Nav().goToPageViewContact({ contact })
      })
      .catch(onSaveFailure)
  }

  const onSaveFailure = (err: Error) => {
    RnAlert.error({
      message: intlDebug`Failed to save the contact`,
      err,
    })
  }

  const storeObj = () => ({
    observable: {
      phonebook: {
        ...genEmptyPhonebook(),
        ...cloneDeep(contact),
      },
    },
  })

  type M0 = ReturnType<typeof storeObj>
  type M = Omit<M0, 'observable'> &
    M0['observable'] &
    ReturnType<typeof useStore>
  const store = (useStore(storeObj) as any) as M
  console.log('asdf', get(store, 'phonebook'))
  const [phonebookObj, setPhonebookObj] = useState(get(store, 'phonebook'))

  const disabled = contact?.shared

  const onTextChange = (key, val) => {
    let fieldErrorsCopy = { ...fieldErrors }
    fieldErrorsCopy[key] = false
    setFieldErrors(fieldErrorsCopy)
    store.set('phonebook.' + key, val)
    const data = { ...phonebookObj }
    data[key] = val
    setPhonebookObj({ ...data })
  }
  return (
    <CustomLayout menu='contact' subMenu='phonebook' hideSubMenu={true}>
      <CustomHeader
        onBack={() => {
          if (newContact) {
            Nav().goToPageContactPhonebook()
            return
          }
          Nav().goToPageViewContact({ contact })
        }}
        title={newContact ? 'New' : 'Edit'}
        backContainerStyle={styles.backButtonContainer}
        rightButtonText={'Done'}
        onRightButtonPress={() => {
          newContact
            ? saveNewContact(store.phonebook)
            : updateContact(store.phonebook)
        }}
        disableRightButton={disabled}
        backText={newContact ? 'Cancel' : 'Back'}
      ></CustomHeader>
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.formContainer}>
          <FormInputBox
            label={'First Name'}
            val={get(store, 'phonebook.firstName')}
            onTextChange={text => onTextChange('firstName', text)}
            editable={!disabled}
            required={true}
            showError={fieldErrors['firstName']}
          />
          <FormInputBox
            label={'Last Name'}
            val={get(store, 'phonebook.lastName')}
            onTextChange={text => onTextChange('lastName', text)}
            editable={!disabled}
            required={true}
            showError={fieldErrors['lastName']}
          />
          <FormInputBox
            label={'Cell number'}
            val={get(store, 'phonebook.cellNumber')}
            onTextChange={text => onTextChange('cellNumber', text)}
            editable={!disabled}
          />
          <FormInputBox
            label={'Work number'}
            val={get(store, 'phonebook.workNumber')}
            onTextChange={text => onTextChange('workNumber', text)}
            editable={!disabled}
          />
          <FormInputBox
            label={'Home number'}
            val={get(store, 'phonebook.homeNumber')}
            onTextChange={text => onTextChange('homeNumber', text)}
            editable={!disabled}
          />
          <FormInputBox
            label={'Job'}
            val={get(store, 'phonebook.job')}
            onTextChange={text => onTextChange('job', text)}
            editable={!disabled}
          />
          <FormInputBox
            label={'Company'}
            val={get(store, 'phonebook.company')}
            onTextChange={text => onTextChange('company', text)}
            editable={!disabled}
          />
          <FormInputBox
            label={'Address'}
            val={get(store, 'phonebook.address')}
            onTextChange={text => onTextChange('address', text)}
            editable={!disabled}
          />
          <FormInputBox
            label={'Email'}
            val={get(store, 'phonebook.email')}
            onTextChange={text => onTextChange('email', text)}
            editable={!disabled}
          />
        </View>
      </ScrollView>
    </CustomLayout>
  )
}
export default PagePhonebookUpdate
