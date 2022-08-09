import { mdiMagnify } from '@mdi/js'
import orderBy from 'lodash/orderBy'
import { observer } from 'mobx-react'
import React from 'react'
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Contacts from 'react-native-contacts'

import pbx from '../../api/pbx'
import UserItem from '../../components/ContactUserItem'
import CustomLayout from '../../components/CustomLayout'
import { RnIcon, RnText, RnTouchableOpacity } from '../../components/Rn'
import RnTextInput from '../../components/RnTextInput'
import styles from '../../pages/PageContactPhonebook/Styles'
import contactStore, { Phonebook2 } from '../../stores/contactStore'
import intl, { intlDebug } from '../../stores/intl'
import Nav from '../../stores/Nav'
import RnAlert from '../../stores/RnAlert'
import { BackgroundTimer } from '../../utils/BackgroundTimer'
import CustomColors from '../../utils/CustomColors'

@observer
class PageContactPhonebook extends React.Component {
  state = {
    showContacts: false,
  }

  onEndReachedCalledDuringMomentum = true

  componentDidMount() {
    const id = BackgroundTimer.setInterval(() => {
      if (!pbx.client) {
        return
      }
      contactStore.loadContactsFirstTime()
      BackgroundTimer.clearInterval(id)
    }, 1000)
    setTimeout(() => {
      this.setState({ showContacts: true })
    }, 1)
  }

  getContacts = async () => {
    try {
      Contacts.getAll().then(res => {
        let arr = res.map(item => {
          return item
        })
      })
    } catch (err) {
      console.log(err)
    }
  }

  update = (id: string) => {
    const contact = contactStore.getPhonebook(id)
    if (contact?.loaded) {
      Nav().goToPageViewContact({
        contact: contact,
      })
    } else {
      this.loadContactDetail(id, (ct: Phonebook2) => {
        Nav().goToPageViewContact({
          contact: ct,
        })
      })
    }
  }

  viewContact = contact => {
    Nav().goToPageViewContact({
      contact: contact,
    })
  }

  loadContactDetail = (id: string, cb: Function) => {
    pbx
      .getContact(id)
      .then(ct => {
        const x = {
          ...ct,
          loaded: true,
          name: ct.firstName + ' ' + ct.lastName,
          hidden: ct.hidden === 'true',
        }
        contactStore.upsertPhonebook(x)
        cb(x)
      })
      .catch((err: Error) => {
        RnAlert.error({
          message: intlDebug`Failed to load contact detail for ${id}`,
          err,
        })
      })
  }

  isMatchUser = user => {
    const { name } = user
    const { contactSearchBook } = contactStore
    return name
      ?.toString()
      .toLowerCase()
      .includes(contactSearchBook.toLowerCase())
  }

  contactsRenderItem = ({ item, index }) => {
    const { key, phoneContacts } = item
    return (
      <React.Fragment key={index}>
        <View style={styles.transferSeparator}>
          <RnText style={styles.transferSeparatorText}>{key}</RnText>
        </View>
        {phoneContacts.map((item, bookIndex) => {
          const { name, id, isPhoneContact } = item
          const hideBorder = index === contactStore.phoneContacts.length - 1
          return (
            <TouchableOpacity
              onPress={() => this.viewContact(item)}
              key={bookIndex}
            >
              <UserItem
                showNewAvatar={true}
                icons={[]}
                key={bookIndex}
                name={name}
                hideBorder={hideBorder}
                isPhoneContact={isPhoneContact}
              />
            </TouchableOpacity>
          )
        })}
      </React.Fragment>
    )
  }

  renderFooter = () => {
    const isLast =
      contactStore.limitedPhoneContacts.length ===
      contactStore.phoneContacts.length
    if (contactStore.contactSearchBook) {
      return null
    }
    return (
      <TouchableOpacity
        disabled={isLast}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 10,
        }}
        onPress={!isLast ? contactStore.phoneContactsLoadMore : () => {}}
      >
        {isLast ? (
          <></>
        ) : (
          <Text style={{ color: CustomColors.DodgerBlue }}>Load More...</Text>
        )}
      </TouchableOpacity>
    )
  }

  render() {
    let phonebooks = contactStore.phoneBooks
    phonebooks = phonebooks.filter(this.isMatchUser)

    const map = {} as { [k: string]: Phonebook2[] }
    phonebooks.forEach(u => {
      let c0 = u.name.charAt(0).toUpperCase()
      if (!/[A-Z]/.test(c0)) {
        c0 = '#'
      }
      if (!map[c0]) {
        map[c0] = []
      }
      map[c0].push(u)
    })

    let groups = Object.keys(map).map(k => ({
      key: k,
      phonebooks: map[k],
    }))
    groups = orderBy(groups, 'key')
    groups.forEach(g => {
      g.phonebooks = orderBy(g.phonebooks, 'name')
    })

    let phoneContacts = contactStore.contactSearchBook
      ? contactStore.phoneContacts
      : contactStore.limitedPhoneContacts
    phoneContacts = phoneContacts.filter(this.isMatchUser)

    const mapContacts = {} as { [k: string]: Phonebook2[] }
    phoneContacts.forEach(u => {
      let c0 = u.name.charAt(0).toUpperCase()
      if (!/[A-Z]/.test(c0)) {
        c0 = '#'
      }
      if (!mapContacts[c0]) {
        mapContacts[c0] = []
      }
      mapContacts[c0].push(u)
    })

    let groupsContacts = Object.keys(mapContacts).map(k => ({
      key: k,
      phoneContacts: mapContacts[k],
    }))
    groupsContacts = orderBy(groupsContacts, 'key')
    groupsContacts.forEach(g => {
      g.phoneContacts = orderBy(g.phoneContacts, 'name')
    })

    const contactsKeyExtractor = (item, index) => index.toString()

    const ITEM_HEIGHT = 60
    const getItemLayout = (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    })

    return (
      <CustomLayout menu='contact' subMenu='phonebook'>
        <ScrollView stickyHeaderIndices={[1]}>
          <View style={styles.parkContainer}>
            <View>
              <RnText style={styles.ParksText}>{'Contacts'}</RnText>
              <RnText style={styles.noParksDesc}>
                {'Phonebook external contacts'}
              </RnText>
            </View>
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() =>
                Nav().goToPagePhonebookUpdate({ contact: {}, newContact: true })
              }
            >
              <RnText style={styles.addButton}>+</RnText>
            </TouchableOpacity>
          </View>
          <View style={styles.searchBoxView}>
            <View style={styles.searchBox}>
              <RnIcon
                path={mdiMagnify}
                pointerEvents='none'
                style={styles.fieldIcon}
                size={17}
                color={CustomColors.DarkAsh}
              />
              <RnTextInput
                style={styles.fieldTextInput}
                value={contactStore.contactSearchBook}
                onChangeText={(val: string) => {
                  contactStore.contactSearchBook = val
                }}
                placeholder={'Search'}
              />
            </View>
          </View>
          <View style={styles.listView}>
            <FlatList
              data={groups}
              scrollEnabled={false}
              style={{ marginBottom: 25 }}
              renderItem={({ item, index }) => {
                const { key, phonebooks } = item
                return (
                  <React.Fragment key={index}>
                    <View style={styles.transferSeparator}>
                      <RnText style={styles.transferSeparatorText}>
                        {key}
                      </RnText>
                    </View>
                    {phonebooks.map((item, bookIndex) => {
                      const { name, id } = item
                      const hideBorder = bookIndex === phonebooks.length - 1
                      return (
                        <TouchableOpacity
                          onPress={() => this.update(id)}
                          key={bookIndex}
                        >
                          <UserItem
                            showNewAvatar={true}
                            icons={[]}
                            key={bookIndex}
                            name={name}
                            hideBorder={hideBorder}
                          />
                        </TouchableOpacity>
                      )
                    })}
                  </React.Fragment>
                )
              }}
            />
          </View>
          {phoneContacts && phoneContacts.length > 0 && (
            <>
              <View
                style={{
                  paddingLeft: 16,
                  marginBottom: 8,
                }}
              >
                <RnText
                  style={{
                    fontSize: 17,
                    color: CustomColors.DodgerBlue,
                    fontWeight: 'bold',
                  }}
                >
                  {`Phone Contacts (${contactStore.phoneContacts.length} )`}
                </RnText>
              </View>
              {this.state.showContacts ? (
                <FlatList
                  data={groupsContacts}
                  scrollEnabled={false}
                  style={{ marginBottom: 8 }}
                  renderItem={this.contactsRenderItem}
                  keyExtractor={contactsKeyExtractor}
                  ListFooterComponent={this.renderFooter}
                  getItemLayout={getItemLayout}
                />
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 40,
                  }}
                >
                  <ActivityIndicator
                    color={CustomColors.ActiveBlue}
                    size={'small'}
                  />
                </View>
              )}
            </>
          )}
          {contactStore.loading ? (
            <RnText
              style={styles.loading}
              warning
              small
              normal
              center
            >{intl`Loading...`}</RnText>
          ) : contactStore.hasLoadmore ? (
            <RnTouchableOpacity onPress={contactStore.loadMoreContacts}>
              <RnText
                style={styles.loading}
                primary
                small
                normal
                center
              >{intl`Load more contacts`}</RnText>
            </RnTouchableOpacity>
          ) : null}
        </ScrollView>
      </CustomLayout>
    )
  }
}

export default PageContactPhonebook
