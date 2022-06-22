import orderBy from 'lodash/orderBy'
import uniqBy from 'lodash/uniqBy'
import { action, computed, observable } from 'mobx'
import {
  Alert,
  FlatList,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import Contacts from 'react-native-contacts'

import CustomValues from '@/utils/CustomValues'

import { getContactByNumber } from '../api/CallApi'
import pbx from '../api/pbx'
import { arrToMap } from '../utils/toMap'
import { intlDebug } from './intl'
import RnAlert from './RnAlert'

export type PbxUser = {
  id: string
  name: string
  talkers?: {
    id: string
    status: string // 'calling' | 'ringing' | 'talking' | 'holding'
  }[]
}
export type UcUser = {
  id: string
  name: string
  avatar: string
  status: string // 'online' | 'offline' | 'idle' | 'busy'
  statusText: string
}
export type Phonebook2 = {
  id: string
  name: string
  book: string
  firstName: string
  lastName: string
  workNumber: string
  cellNumber: string
  homeNumber: string
  job: string
  company: string
  address: string
  email: string
  shared: boolean
  loaded?: boolean
  hidden: boolean
  isPhoneContact?: boolean
}

class ContactStore {
  @observable usersSearchTerm = ''
  @observable callSearchRecents = ''
  @observable contactSearchBook = ''
  @observable loading = true
  @observable hasLoadmore = false
  @observable offset = 0
  numberOfContactsPerPage = 100

  loadContacts = async () => {
    this.loading = true
    await pbx
      .getContacts({
        shared: true,
        offset: this.offset,
        limit: this.numberOfContactsPerPage,
      })
      .then(arr => {
        this.setPhonebook(arr as Phonebook2[])
        this.hasLoadmore = arr.length === this.numberOfContactsPerPage
      })
      .catch((err: Error) => {
        RnAlert.error({
          message: intlDebug`Failed to load contact list`,
          err,
        })
      })
    this.loading = false
  }

  @observable alreadyLoadContactsFirstTime = false
  @action loadContactsFirstTime = () => {
    if (this.alreadyLoadContactsFirstTime) {
      return
    }
    this.loadContacts()?.then(() => {
      this.alreadyLoadContactsFirstTime = true
    })
    if (CustomValues.iosAndroid) {
      this.fetchPhoneContacts()
    }
  }

  fetchPhoneContacts = () => {
    if (Platform.OS === 'ios') {
      this.getContacts()
      return
    }
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    }).then(() => {
      this.getContacts()
    })
  }

  getContacts = () => {
    Contacts.getAll()
      .then(contacts => {
        console.log(contacts)
        let phoneContacts: Phonebook2[] = []
        const numberKey = ['cellNumber', 'workNumber', 'homeNumber']
        contacts.forEach(contact => {
          let contactObj = {} as Phonebook2
          if (
            !(contact.displayName || contact.givenName || contact.familyName) ||
            !contact.phoneNumbers ||
            !contact.phoneNumbers.length
          ) {
            return
          }
          let uniquePhoneNumbers = contact.phoneNumbers.filter(
            (v, i, a) =>
              a.findIndex(
                v2 =>
                  v2.number?.replace(/[^A-Z0-9]+/gi, '') ===
                  v.number?.replace(/[^A-Z0-9]+/gi, ''),
              ) === i,
          )

          uniquePhoneNumbers.forEach((phoneNumber, index) => {
            let number = phoneNumber.number?.replace(/[^A-Z0-9]+/gi, '_')

            contactObj[numberKey[index]] = phoneNumber.number
          })
          if (contactObj.cellNumber) {
            console.log(contact, 'contact123')
            contactObj = {
              ...contactObj,
              id: contact.recordID,
              name:
                contact.displayName ||
                contact.givenName ||
                contact.familyName ||
                '',
              book: '',
              firstName: contact.givenName,
              lastName: contact.familyName,
              job: contact.jobTitle,
              company: contact.company || '',
              address:
                contact.postalAddresses && contact.postalAddresses.length > 0
                  ? contact.postalAddresses[0].street
                  : '',
              email:
                contact.emailAddresses && contact.emailAddresses.length > 0
                  ? contact.emailAddresses[0].email
                  : '',
              shared: false,
              loaded: true,
              hidden: false,
              isPhoneContact: true,
            }
          }
          phoneContacts.push(contactObj)
        })
        phoneContacts = orderBy(
          phoneContacts,
          [phoneContact => phoneContact.name.toLowerCase()],
          ['asc'],
        )
        // this.setPhonebook(phoneContacts)
        console.log(phoneContacts, 'phoneContacts')
        this.setPhonecontacts(phoneContacts)
      })
      .catch(e => {
        console.log(e)
      })
  }

  @action loadMoreContacts = () => {
    this.offset += this.numberOfContactsPerPage
    this.loadContacts()
  }

  @observable pbxUsers: PbxUser[] = []
  setTalkerStatus = (userId: string, talkerId: string, status: string) => {
    const user = this.getPBXUser(userId)
    if (!user) {
      return
    }
    if (!user.talkers) {
      user.talkers = []
    }
    if (!status) {
      user.talkers = user.talkers.filter(t => t.id !== talkerId)
    } else {
      const talker = user.talkers.find(t => t.id === talkerId)
      if (!talker) {
        user.talkers.push({
          id: talkerId,
          status,
        })
      } else {
        talker.status = status
      }
    }
    this.pbxUsers = [...this.pbxUsers]
  }
  //
  @computed get _pbxUsersMap() {
    return arrToMap(this.pbxUsers, 'id', (u: PbxUser) => u) as {
      [k: string]: PbxUser
    }
  }
  getPBXUser = (id: string) => {
    return this._pbxUsersMap[id]
  }

  getPhonebookUser = (id: string) => {
    let selectedContact = this.phoneBooks.filter(contact => {
      return (
        contact.cellNumber === id ||
        contact.workNumber === id ||
        contact.homeNumber === id
      )
    })
    return selectedContact[0]?.name
  }

  getPartyName = async (id: string, callback: Function) => {
    await getContactByNumber({ search_text: id })
      .then(res => {
        if (res && res.length) {
          callback(res[0].name)
        } else {
          callback('')
        }
      })
      .catch(err => callback(''))
  }

  @observable ucUsers: UcUser[] = []
  updateUCUser = (_u: UcUser) => {
    const u = this.getUCUser(_u.id)
    if (!u) {
      return
    }
    Object.assign(u, _u)
    this.ucUsers = [...this.ucUsers]
  }
  @computed get _ucUsersMap() {
    return arrToMap(this.ucUsers, 'id', (u: UcUser) => u) as {
      [k: string]: UcUser
    }
  }
  getUCUser = (id: string) => {
    return this._ucUsersMap[id]
  }

  @observable phoneBooks: Phonebook2[] = []
  @observable phoneContacts: Phonebook2[] = []
  @observable limitedPhoneContacts: Phonebook2[] = []
  @observable phoneContactsOffset = 0

  @computed get _phoneBooksMap() {
    return arrToMap(this.phoneBooks, 'id', (u: Phonebook2) => u) as {
      [k: string]: Phonebook2
    }
  }

  @action upsertPhonebook = (_p: Phonebook2) => {
    const p = this.getPhonebook(_p.id)
    if (!p) {
      this.phoneBooks.push(_p)
    } else {
      Object.assign(p, _p)
    }
    this.phoneBooks = [...this.phoneBooks]
  }

  @action setPhonebook = (_p: Phonebook2 | Phonebook2[]) => {
    if (!_p) {
      return
    }
    if (!Array.isArray(_p)) {
      _p = [_p]
    }
    this.phoneBooks = uniqBy([...this.phoneBooks, ..._p], 'id')
  }

  phoneContactsLimit = 100

  @action setPhonecontacts = (contacts: Phonebook2 | Phonebook2[]) => {
    if (!contacts) {
      return
    }
    if (!Array.isArray(contacts)) {
      contacts = [contacts]
    }
    this.phoneContacts = uniqBy([...this.phoneContacts, ...contacts], 'id')
    this.limitedPhoneContacts = [
      ...this.phoneContacts.slice(
        this.phoneContactsOffset,
        this.phoneContactsLimit,
      ),
    ]
  }

  @action phoneContactsLoadMore = () => {
    // console.log('phoneContactsLoadMore', this.phoneContactsOffset)
    // console.log('phoneContactsLoadMore', this.phoneContacts.length)
    console.log(this.limitedPhoneContacts.length)
    console.log(this.phoneContactsOffset)
    console.log(this.phoneContactsLimit)

    this.phoneContactsOffset += this.phoneContactsLimit
    this.limitedPhoneContacts = [
      ...this.limitedPhoneContacts,
      ...this.phoneContacts.slice(
        this.phoneContactsOffset,
        this.phoneContactsOffset + this.phoneContactsLimit,
      ),
    ]
    console.log(this.limitedPhoneContacts.length)
  }

  getPhonebook = (id: string) => {
    return this._phoneBooksMap[id]
  }

  clearStore = () => {
    this.phoneBooks = []
    this.ucUsers = []
    this.pbxUsers = []
    this.loading = true
    this.hasLoadmore = false
    this.alreadyLoadContactsFirstTime = false
  }
}

export default new ContactStore()
