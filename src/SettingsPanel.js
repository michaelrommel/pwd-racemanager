import React, { Component } from 'react'
import { FormGroup, InputGroup, Intent, Icon, Button } from '@blueprintjs/core'
import { Formik, Form } from 'formik'
import { Flex, Box } from 'reflexbox'
import axios from 'axios'
import memoize from 'memoize-one'
import FormikValidator from './FormikValidator'
import { DisplayToast } from './DisplayToast'
import * as Yup from 'yup'

const getValidationSchema = (values) => {
  console.log('getValidationSchema with: ', values.rootpwd)
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
          pwd => pwd !== values.rootpwd
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

function FieldWithError (props) {
  const {
    fieldname,
    placeholder,
    handleChange,
    values,
    errors
  } = props

  return (
    <Flex align={'center'}>
      <Box w={6 / 10} pr={2} >
        <InputGroup id={fieldname} placeholder={placeholder} large
          value={values[fieldname]} onChange={handleChange} />
      </Box>
      <Box justify={'center'} hidden={!errors[fieldname]} >
        <Icon icon='warning-sign' iconSize={30} intent={Intent.DANGER} />
      </Box>
      <Box w={3 / 10} pl={2} justify={'left'} hidden={!errors[fieldname]} >
        {errors[fieldname]}
      </Box>
    </Flex>
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
          values={values}
          errors={errors} />
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

      <Button className={'savebutton'} id='submit' onClick={handleSubmit} type='submit'
        intent={Intent.PRIMARY} large
        text={isSubmitting ? 'Saving...' : 'Save'} />

      <FormikValidator
        initialValues={initialValues.rootpwd} 
        values={values.rootpwd} 
        validateForm={validateForm}
        handleChange={handleChange}
        setFieldTouched={setFieldTouched}
      />
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
      'githubClientSecret': ''
    }
    // we call a function to return a validation Yup schema
    // this gives us the ability to pass a state parameter
    // to the created schema
    this.ValidationSchema = getValidationSchema(this.state)
  }

  componentDidMount() {
    console.log('SettingsPanel mounted')
    console.log('SettingsPanel: calling getAppSettings')
    this.getAppSettings()
  }

  getSettings = memoize(
    async (user) => {
      await this.getAppSettings()
    }
  )

  async getAppSettings() {
    let settings
    try {
      console.log('SettingsPanel: getting application settings: ')
      let config
      if (this.props.user) {
        // a user already logged in, use the user token
        config = {
          headers: {'Authorization': 'Bearer ' + this.props.user.token}
        };
        settings = await axios.get('https://pwd-racetrack/admin/settings', config)
      } else {
        // try to get the view for anonymous users
        settings = await axios.get('https://pwd-racetrack/admin/init')
      }
      console.log('SettingsPanel: got application settings: ', settings)
      let newstate ={ 
        'appState': settings.data.appState || '',
        'jwtSecret': settings.data.jwtSecret || '',
        'rootpwd': settings.data.rootpwd || '',
        'githubClientId': settings.data.githubClientId || '',
        'githubClientSecret': settings.data.githubClientSecret || '',
      }
      // this sets a new validator with the new values to compare to
      // especially the rootpwd
      this.ValidationSchema = getValidationSchema(newstate)
      // this will trigger a re-render with the new values
      this.setState(newstate)
      // if the application state is fresh, let's see if we 
      // can log in as root user
      if (newstate.appState === 'fresh') {
        try {
          let user = await axios.post('https://pwd-racetrack/auth/local-login',
            { 'username': 'root',
              'password': settings.data.rootpwd })
          // we got a user, propagate it to the state
          // this.setState({ 'user': user.data })
          this.props.onUserChange(user.data)
          console.log('Logged in as root user: ')
        } catch (err) {
          console.log('Error in logging in as root user: ', err)
        }
      }
      return newstate
    } catch (err) {
      console.log('Error getting application settings: ', err)
      return undefined
    }
  }

  async storeAppSettings(settings) {
    try {
      let config
      console.log('SettingsPanel: storing application settings: ')
      config = {
        headers: {'Authorization': 'Bearer ' + this.props.user.token}
      }
      settings.appState = 'configured'
      let response = await axios.post('https://pwd-racetrack/admin/settings', settings, config)
      console.log('SettingsPanel: stored application settings: ', response)
      if (response.data.inserted === 1) {
        // success storing the new settings, now
        // reinitialize user, token and JWT
        this.setState(settings)
      }
      return true
    } catch (err) {
      console.log('Error storing application settings: ', err)
      return false
    }
  }

  onSubmit = async (values, actions) => {
    try {
      console.log(values)
      if (await this.storeAppSettings(values)) { 
        this.showToast('Successfully stored settings.', Intent.SUCCESS, 'tick-circle')
      } else {
        this.showToast('Failed to store settings.', Intent.DANGER, 'warning-sign')
      }
      actions.setSubmitting(false);
    } catch (err) {
      actions.setSubmitting(false)
      actions.setErrors({ 'appState': 'This is an example error' })
      actions.setStatus({ 'msg': 'Set some arbitrary status or data' })
    }
  }

	showToast = (msg, intent, icon) => {
			// create toasts in response to interactions.
			// in most cases, it's enough to simply create and forget (thanks to timeout).
			DisplayToast.show({ 'message': msg, 'intent': intent, 'icon': icon })
	}

  render () {
    const panelActive = this.props.active ? {} : { 'display': 'none' }
    const initialValues = this.getSettings(this.props.user)
    // const initialValues = this.state

    console.log('Rendering SettingsPanel with: ', JSON.stringify(initialValues,null,2))

    return (
      <div className='settingspanel' style={panelActive}>
        <Flex p={2} align='center' justify='center'>
          <Box w={4 / 5}>
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={this.ValidationSchema}
              onSubmit={this.onSubmit}
              render={AppSettingsForm}
            />
          </Box>
        </Flex>
      </div>
    )
  }
}

export default SettingsPanel
