import React, { Component } from 'react'
import { FormGroup, Intent, Button } from '@blueprintjs/core'
import { Formik, Form } from 'formik'
import { Flex, Box } from 'reflexbox'
import axios from 'axios'
import FormikValidator from './FormikValidator'
import FieldWithError from './FieldWithError.js'
import DisplayToast from './DisplayToast'
import * as Yup from 'yup'

const getValidationSchema = (values) => {
  return (
    Yup.object().shape({
      appState: Yup.string()
        .oneOf(['fresh', 'configured'])
        .required('Required'),
      jwtSecret: Yup.string()
        .min(20, 'Too short!')
        .max(50, 'Too long!')
        .required('Required'),
      rootpwd: Yup.string()
        .min(12, 'Too short!')
        .max(50, 'Too long!')
        .required('Required and needs to be changed')
        .test(
          'rootPwdChanged',
          'You have to change the root password!',
          pwd => (pwd !== values.rootpwd) || (values.appState === 'configured')
        ),
      githubClientId: Yup.string()
        .test(
          'ghid',
          'Can contain only lowercase letters and numbers!',
          (ghid) => (/^[\x61-\x7a\x30-\x39]*$/.test(ghid))
        ),
      githubClientSecret: Yup.string()
        .test(
          'ghsecret',
          'Can contain only lowercase letters and numbers!',
          (ghsec) => (/^[\x61-\x7a\x30-\x39]*$/.test(ghsec))
        )
    })
  )
}

function ScaleSettingsForm (props) {
  const {
    isSubmitting,
    handleChange,
    handleSubmit,
    values,
    errors
  } = props

  return (
    <Form>
      <FormGroup
        helperText={'IP address of the Pinewood Derby race scale.'}
        label={'Scale IP address'}
        labelFor='scaleIp'
        labelInfo={''} >
        <FieldWithError
          fieldname={'scaleIp'}
          placeholder={'192.168.10.10'}
          handleChange={handleChange}
          values={values}
          errors={errors} />
      </FormGroup>

      <Button className={'savebutton'} id='saveScaleSettings' onClick={handleSubmit} type='submit'
        intent={Intent.PRIMARY} large
        text={isSubmitting ? 'Saving...' : 'Save Scale IP'} />

    </Form>
  )
}

function AppSettingsForm (props) {
  const {
    isSubmitting,
    handleChange,
    handleSubmit,
    validateForm,
    initialValues,
    setFieldTouched,
    setFieldValue,
    values,
    errors
  } = props

  return (
    <Form>
      <FormGroup
        helperText={'Indicates whether this installation has been initially configured.'}
        label={'Application State'}
        labelFor='appState'
        labelInfo={'(required)'} >
        <FieldWithError
          fieldname={'appState'}
          placeholder={'fresh|configured'}
          disabled
          handleChange={handleChange}
          values={values}
          errors={errors} />
      </FormGroup>

      <FormGroup
        helperText={'The JSON Web Token Secret used to sign and verify the tokens.'}
        label={'JSON Web Token Secret'}
        labelFor='jwtSecret'
        labelInfo={'(required)'} >
        <FieldWithError
          fieldname={'jwtSecret'}
          placeholder={'JWT Secret'}
          handleChange={handleChange}
          values={values}
          errors={errors} />
      </FormGroup>

      <FormGroup
        helperText={'Password for the admin user "root". This needs to be changed!'}
        label={'root Password'}
        labelFor='rootpwd'
        labelInfo={'(required)'} >
        <FieldWithError
          fieldname={'rootpwd'}
          placeholder={'super secret'}
          handleChange={handleChange}
          setFieldValue={setFieldValue}
          values={values}
          errors={errors}
          lock />
      </FormGroup>

      <FormGroup
        helperText={'Github Client ID for OAuth authentication.'}
        label={'Github Client ID'}
        labelFor='githubClientId'
        labelInfo={'(optional)'} >
        <FieldWithError
          fieldname={'githubClientId'}
          placeholder={'Your Github Client ID'}
          handleChange={handleChange}
          values={values}
          errors={errors} />
      </FormGroup>

      <FormGroup
        helperText={'Github Client Secret for OAuth authentication.'}
        label={'Github Client Secret'}
        labelFor='githubClientSecret'
        labelInfo={'(optional)'} >
        <FieldWithError
          fieldname={'githubClientSecret'}
          placeholder={'Your Github Client Secret'}
          handleChange={handleChange}
          values={values}
          errors={errors} />
      </FormGroup>

      <FormikValidator
        initialValues={initialValues.rootpwd}
        values={values.rootpwd}
        fieldName={'rootpwd'}
        validateForm={validateForm}
        setFieldTouched={setFieldTouched}
      />

      <Button className={'savebutton'} id='saveAppSettings' onClick={handleSubmit} type='submit'
        intent={Intent.PRIMARY} large
        text={isSubmitting ? 'Saving...' : 'Save Racetrack Configuration'} />

    </Form>
  )
}

class SettingsPanel extends Component {
  constructor (props) {
    super(props)
    // we need to initialize all form fields with some value
    // otherwise React will complain because the field changes
    // from uncontrolle to controlled input
    this.state = {
      'appState': '',
      'jwtSecret': '',
      'rootpwd': '',
      'githubClientId': '',
      'githubClientSecret': '',
      'netReqId': 1
    }
  }

  componentDidMount () {
    console.log('SettingsPanel: mounted', this.props.user)
    // we fire off one request to the server to get the
    // initial values for the form fields based on the
    // current user, if any.
    let nextId = this.state.netReqId + 1
    this.setState({ 'netReqId': nextId })
    this.getAppSettings(nextId)
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    // If the user changed, fire off another network request
    if (this.props.user !== prevProps.user) {
      let nextId = this.state.netReqId + 1
      this.setState({ 'netReqId': nextId })
      this.getAppSettings(nextId)
    }
  }

  async getAppSettings (netReqId) {
    let settings
    try {
      console.log('SettingsPanel: get app settings: id:', netReqId, 'user:', this.props.user)
      let config
      if (this.props.user) {
        // a user already logged in, use the user token
        config = {
          headers: { 'Authorization': 'Bearer ' + this.props.user.token }
        }
        console.log('SettingsPanel: path /settings')
        settings = await axios.get(
          this.props.urlprefix + '/admin/settings', config)
      } else {
        // try to get the view for anonymous users
        console.log('SettingsPanel: path /init')
        settings = await axios.get(
          this.props.urlprefix + '/admin/init')
      }
      console.log('SettingsPanel: got application settings: ', settings.data.rootpwd)
      let newstate = {
        'appState': settings.data.appState || '',
        'jwtSecret': settings.data.jwtSecret || '',
        'rootpwd': settings.data.rootpwd || '',
        'githubClientId': settings.data.githubClientId || '',
        'githubClientSecret': settings.data.githubClientSecret || ''
      }
      // this will conditionally update the state and if so,
      // trigger a re-render with the new values
      this.setState((state, props) => {
        if (state.netReqId > netReqId) {
          // another request has already been fired off,
          // so ignore the network response we jost got
          console.log('Ignoring response for', netReqId,
            'because state already has', state.netReqId,
            'state: ', newstate)
          return {}
        } else {
          console.log('Accepting response for request for', netReqId,
            ' state: ', newstate)
          return newstate
        }
      })
      // if the application state is fresh, let's see if we
      // can log in as root user, if we are not already logged in
      if (newstate.appState === 'fresh' && !this.props.user) {
        try {
          let user = await axios.post(
            this.props.urlprefix + '/auth/local-login',
            { 'username': 'root',
              'password': settings.data.rootpwd })
          // we got a user, propagate it to the top level state
          this.props.changeUser(user.data)
          console.log('Settingspanel: logged in as root user: ')
        } catch (err) {
          console.log('Settingspanel: error in logging in as root user: ', err)
        }
      }
    } catch (err) {
      console.log('Settingspanel: error getting application settings: ', err)
    }
  }

  async storeAppSettings (settings) {
    try {
      let config
      console.log('SettingsPanel: storing application settings: ')
      config = {
        headers: { 'Authorization': 'Bearer ' + this.props.user.token }
      }
      settings.appState = 'configured'
      let response = await axios.post(
        this.props.urlprefix + '/admin/settings', settings, config)
      console.log('SettingsPanel: stored application settings: ', response)
      if (response.data.success) {
        // success storing the new settings, now
        // reinitialize user, token and JWT
        this.setState(settings)
      }
      return true
    } catch (err) {
      console.log('Settingspanel: error storing application settings: ', err)
      return false
    }
  }

  async connectScale (ip) {
    try {
      let config
      console.log('SettingsPanel: connect to scale: ')
      config = {
        headers: { 'Authorization': 'Bearer ' + this.props.user.token }
      }
      let response = await axios.get('http://' + ip + ':1337/info', config)
      if (response.data.success) {
        // success getting info from scale
        this.setState({ 'scaleIp': ip })
      }
      return true
    } catch (err) {
      console.log('Settingspanel: error connecting to scale: ', err)
      return false
    }
  }

  onSubmitApp = async (values, actions) => {
    try {
      if (await this.storeAppSettings(values)) {
        this.showToast('Successfully stored settings',
          Intent.SUCCESS, 'tick-circle', 2000)
      } else {
        this.showToast('Failed to store settings',
          Intent.DANGER, 'warning-sign', 5000)
      }
      actions.setSubmitting(false)
    } catch (err) {
      this.showToast('Failed to submit settings',
        Intent.DANGER, 'warning-sign', 5000)
      actions.setSubmitting(false)
    }
  }

  onSubmitScale = async (values, actions) => {
    try {
      if (await this.connectScale(values.scaleIp)) {
        this.showToast('Successfully connnected scale',
          Intent.SUCCESS, 'tick-circle', 2000)
        this.props.changeScaleIp(values.scaleIp)
      } else {
        this.showToast('Failed to get info from scale',
          Intent.DANGER, 'warning-sign', 5000)
      }
      actions.setSubmitting(false)
    } catch (err) {
      this.showToast('Failed to connect to scale',
        Intent.DANGER, 'warning-sign', 5000)
      actions.setSubmitting(false)
    }
  }

  showToast = (msg, intent, icon, timeout) => {
    DisplayToast.show({
      'message': msg,
      'intent': intent,
      'icon': icon,
      'timeout': timeout
    })
  }

  render () {
    const panelActive = this.props.active ? {} : { 'display': 'none' }
    const initialAppValues = this.state
    const initialScaleValues = {
      'scaleIp': this.props.scaleIp
    }

    return (
      <div className='settingspanel' style={panelActive}>
        <Flex p={2} align='top'>
          <Box w={1 / 2}>
            <Formik
              enableReinitialize
              initialValues={initialAppValues}
              validationSchema={getValidationSchema(this.state)}
              onSubmit={this.onSubmitApp}
              render={AppSettingsForm}
            />
          </Box>
          <Box w={1 / 2}>
            <Formik
              enableReinitialize
              initialValues={initialScaleValues}
              onSubmit={this.onSubmitScale}
              render={ScaleSettingsForm}
            />
          </Box>
        </Flex>
      </div>
    )
  }
}

export default SettingsPanel
