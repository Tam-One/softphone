import { mdiCheck, mdiTranslate } from '@mdi/js'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import uc from '@/api/uc'
import Field from '@/components/Field'
import Layout from '@/components/Layout'
import { getAuthStore } from '@/stores/authStore'
import intl, { intlDebug } from '@/stores/intl'
import intlStore from '@/stores/intlStore'
import RnAlert from '@/stores/RnAlert'

@observer
class PageSettingsOther extends Component {
  state = {
    status: '',
    statusText: '',
  }
  componentDidMount() {
    const me = uc.me()
    this.setState({
      status: me.status,
      statusText: me.statusText,
    })
  }
  setStatusText = (statusText: string) => {
    this.setState({ statusText })
  }
  submitStatusText = () => {
    this.setStatus(this.state.status, this.state.statusText)
  }
  submitStatus = (status: string) => {
    this.setStatus(status, this.state.statusText)
  }
  setStatus = (status: string, statusText: string) => {
    uc.setStatus(status, statusText)
      .then(() => {
        const me = uc.me()
        this.setState({
          status: me.status,
          statusText: me.statusText,
        })
      })
      .catch((err: Error) => {
        RnAlert.error({
          message: intlDebug`Failed to change UC status`,
          err,
        })
      })
  }
  render() {
    return (
      <Layout
        description={intl`Other settings for PBX/UC`}
        dropdown={[
          ...(getAuthStore().isConnFailure
            ? [
                {
                  label: intl`Reconnect to server`,
                  onPress: getAuthStore().reconnectWithUcLoginFromAnotherPlace,
                },
              ]
            : []),
          {
            label: intl`Logout`,
            onPress: getAuthStore().signOut,
            danger: true,
          },
        ]}
        menu='settings'
        subMenu='other'
        title={intl`Other Settings`}
      >
        <Field isGroup label={intl`LOCALIZATION`} />
        <Field
          icon={mdiTranslate}
          label={intl`LANGUAGE`}
          onTouchPress={intlStore.selectLocale}
          value={intlStore.locale}
          valueRender={() => intlStore.localeName}
        />
        {getAuthStore().currentProfile.ucEnabled && (
          <>
            <Field isGroup label={intl`UC`} />
            <Field
              disabled={!getAuthStore().currentProfile.ucEnabled}
              label={intl`STATUS`}
              onValueChange={this.submitStatus}
              options={[
                { key: 'online', label: intl`Online` },
                { key: 'offline', label: intl`Invisible` },
                { key: 'busy', label: intl`Busy` },
              ]}
              type='RnPicker'
              value={this.state.status}
            />
            <Field
              createBtnIcon={mdiCheck}
              disabled={!getAuthStore().currentProfile.ucEnabled}
              label={intl`STATUS NOTE`}
              onCreateBtnPress={this.submitStatusText}
              onSubmitEditing={this.submitStatusText}
              onValueChange={this.setStatusText}
              value={this.state.statusText}
            />
          </>
        )}
      </Layout>
    )
  }
}

export default PageSettingsOther
