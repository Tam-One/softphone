import UserItem from 'components/ContactUserItem'
import CustomGradient from 'components/CustomGradient'
import CustomHeader from 'components/CustomHeader'
import CustomLayout from 'components/CustomLayout'
import { RnText, RnTouchableOpacity } from 'components/Rn'
import { observer } from 'mobx-react'
import styles from 'pages/PageCallParks/Styles'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { getAuthStore } from 'stores/authStore'
import callStore from 'stores/callStore'
import intl from 'stores/intl'
import Nav from 'stores/Nav'

@observer
class PageCallParks extends React.Component<{
  callParks2: boolean
}> {
  state = {
    selectedPark: '',
  }

  selectPark = (parkSelected: string) => {
    const { selectedPark } = this.state
    this.setState({
      selectedPark: parkSelected === selectedPark ? '' : parkSelected,
    })
  }

  park = () => {
    const { selectedPark } = this.state
    const { callParks2 } = this.props
    const { currentCall = {}, startCall }: any = callStore || {}
    const { park } = currentCall
    return callParks2 ? park(selectedPark) : startCall(selectedPark || '')
  }

  ParkComponent = (parks, selectedPark) => {
    return (
      <>
        {!parks.length && (
          <>
            <View style={styles.noParksContainer}>
              <RnText style={styles.noParksText}>{'Parks (0)'}</RnText>
            </View>
            <RnText style={styles.noParksDesc}>
              {intl`This account has no park number`}
            </RnText>
          </>
        )}
        <ScrollView>
          {parks.map((park, index) => (
            <RnTouchableOpacity
              key={index}
              onPress={() => this.selectPark(park)}
            >
              <UserItem
                key={index}
                name={intl`Park ${index + 1}: ${park}`}
                selected={selectedPark === park}
              />
            </RnTouchableOpacity>
          ))}
        </ScrollView>
      </>
    )
  }

  render() {
    const {
      currentProfile: { parks },
    } = getAuthStore() || {}
    const { selectedPark } = this.state
    const { callParks2 } = this.props

    return (
      <>
        {!callParks2 && (
          <>
            <CustomLayout menu='keys' subMenu='parks'>
              <View style={styles.parkContainer}>
                <RnText style={styles.ParksText}>{'Park'}</RnText>
                <RnText style={styles.noParksDesc}>
                  {'Recent voicemails and calls'}
                </RnText>
              </View>
              {this.ParkComponent(parks, selectedPark)}
            </CustomLayout>
          </>
        )}
        {!!callParks2 && (
          <CustomGradient>
            <CustomHeader
              onBack={Nav().backToPageCallManage}
              description={'Your park numbers'}
              title={'Park'}
            />
            {this.ParkComponent(parks, selectedPark)}
          </CustomGradient>
        )}
      </>
    )
  }
}

export default PageCallParks
