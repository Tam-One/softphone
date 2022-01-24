import { observer } from 'mobx-react'
import React from 'react'
import { View } from 'react-native'

import CallButtons from '@/components/CallButtons'
import CallerInfo from '@/components/CallerInfo'
import styles from '@/components/CallNotify/Styles'
import CustomGradient from '@/components/CustomGradient'
import PoweredBy from '@/components/PoweredBy'
import callStore from '@/stores/callStore'
import contactStore from '@/stores/contactStore'
import CustomImages from '@/utils/CustomImages'
import { AcceptButton, DeclineButton } from '@/utils/SvgComponent'

@observer
class CallNotify extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = {
      callerName: '',
      callerNumer: '',
    }
  }

  fetchPartyName = (partyName: string, partyNumber: string) => {
    const { callerName, callerNumber }: any = this.state

    if (!partyNumber || callerNumber !== partyNumber) {
      this.setState({ callerName: '', callerNumber: partyNumber })
      return
    }

    if (partyName && partyName !== partyNumber && !callerName) {
      this.setState({ callerName: partyName, callerNumber: partyNumber })
    } else if (partyNumber && !callerName) {
      contactStore.getPartyName(partyNumber, (value: String) =>
        this.setState({ callerName: value, callerNumber: partyNumber }),
      )
    }
  }

  render() {
    const callStoreInfo = callStore.incomingCall
    const callStoreRecentAction = callStore.recentPn?.action
    const { callerName }: any = this.state

    if (!callStoreInfo || callStoreRecentAction) {
      return null
    }
    const { partyName, partyNumber, hangup, answer } = callStoreInfo
    const callerNumber = partyNumber
    const isUserCalling = !callerNumber.includes('+')
    this.fetchPartyName(partyName, partyNumber)

    return (
      <CustomGradient customStyle={{ position: 'absolute', flex: 1 }}>
        <View style={styles.notify}>
          <CallerInfo
            isUserCalling={isUserCalling}
            callerName={callerName}
            callerNumber={callerNumber}
          />
          <View style={styles.notifyContainer}>
            <View style={styles.notifyBtnSideBySide}>
              <CallButtons
                onPress={hangup}
                lable={'Refuse'}
                Icon={DeclineButton}
              />
              <CallButtons
                onPress={() => answer({}, callerName)}
                Icon={AcceptButton}
                lable={'Accept'}
                showAnimation={true}
              />
            </View>
            <PoweredBy />
          </View>
        </View>
      </CustomGradient>
    )
  }
}

export default CallNotify
