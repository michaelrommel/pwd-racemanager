import React, { Component } from 'react'
import { Spinner, FormGroup, Button, Card, InputGroup, Intent, Tooltip, HTMLTable, H5 } from '@blueprintjs/core'
import { Formik, Form } from 'formik'
import { Flex, Box } from 'reflexbox'
import DisplayToast from './DisplayToast'
import axios from 'axios'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return (
    Yup.object().shape({
      username: Yup.string()
        .required('Required'),
      password: Yup.string()
        .required('Required')
    })
  )
}

function LoginForm (props) {
  const {
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue,
    values,
    isValid
  } = props

  const handleLockClick = () => {
    setFieldValue('showPassword', !values.showPassword, false)
  }

  const LockButton = (
    <Tooltip content={values.showPassword ? 'Hide Password' : 'Show Password'}>
      <Button
        value={values.showPassword}
        icon={values.showPassword ? 'unlock' : 'lock'}
        intent={Intent.NONE}
        onClick={handleLockClick}
      />
    </Tooltip>
  )

  return (
    <Form>
      <FormGroup>
        <Flex align={'center'}>
          <Box w={1}>
            <InputGroup id='username' placeholder='Username' large
              leftIcon='person' className='logingroup'
              value={values.username} onChange={handleChange} />
          </Box>
        </Flex>
        <Flex align={'center'}>
          <Box w={1}>
            <InputGroup id='password' placeholder='Password' large
              leftIcon='key' rightElement={LockButton}
              type={values.showPassword ? 'text' : 'password'}
              value={values.password} onChange={handleChange} className='logingroup' />
          </Box>
        </Flex>
        <Flex justify={'center'} align={'center'}>
          <Box p={1} justify={'center'}>
            <Button id='login' onClick={handleSubmit} type='submit'
              intent={Intent.PRIMARY} large active
              text={isSubmitting ? '' : 'Login'}
              disabled={!isValid}>
              <Box hidden={!isSubmitting}>
                <Spinner id='spinner' size={Spinner.SIZE_SMALL} />
              </Box>
            </Button>
          </Box>
        </Flex>
      </FormGroup>
    </Form>
  )
}

class SessionPanel extends Component {
  constructor (props) {
    super(props)
    this.emptystate = {
      'showPassword': false,
      'username': '',
      'password': ''
    }
    this.state = { ...this.emptystate }
    this.ValidationSchema = getValidationSchema()
  }

  showToast = (msg, intent, icon) => {
    DisplayToast.show({ 'message': msg, 'intent': intent, 'icon': icon })
  }

  handleLogoutClick = (e) => {
    console.log('Sessionpanel: logging out user: ' + this.props.user)
    this.setState(this.emptystate)
    this.props.changeUser(null)
  }

  handleLoginClick = async (values, actions) => {
    const username = values.username
    const password = values.password

    console.log('Sessionpanel: logging in user: ' + username)
    try {
      let user = await axios.post('https://pwd-racetrack/auth/local-login',
        { 'username': username,
          'password': password })
      this.props.changeUser(user.data)
      actions.setSubmitting(false)
      this.setState(this.emptystate)
      actions.resetForm(this.emptyState)
    } catch (err) {
      console.log('Sessionpanel: error in logging in: ', err)
      this.showToast('Login error!', Intent.DANGER, 'warning-sign')
      actions.setSubmitting(false)
    }
  }

  render () {
    const panelActive = this.props.active ? {} : { 'display': 'none' }

    const loggedIn = this.props.user
    const hiddenIfLoggedIn = loggedIn ? { 'display': 'none' } : {}
    const hiddenIfLoggedOut = !loggedIn ? { 'display': 'none' } : {}

    const initialValues = this.state

    return (
      <div className='sessionpanel' style={panelActive}>
        <Flex p={2} align='center' justify='center'>
          <Box w={2 / 3} style={hiddenIfLoggedOut}>
            <Card>
              <H5>Session Information</H5>
              <HTMLTable className='sessiontable'>
                <thead><tr><th width='30%'>Key</th><th>Value</th></tr></thead>
                <tbody>
                  <tr><td>Username</td>
                    <td>{this.props.user ? this.props.user.username : ''}</td></tr>
                  <tr><td>Role</td>
                    <td>{this.props.user ? this.props.user.role : ''}</td></tr>
                  <tr><td>Token</td>
                    <td>{this.props.user ? this.props.user.token : ''}</td></tr>
                </tbody>
              </HTMLTable>
            </Card>
          </Box>
          <Box w={1 / 2} style={hiddenIfLoggedIn}>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={this.ValidationSchema}
              onSubmit={this.handleLoginClick}
              render={LoginForm}
            />
          </Box>
        </Flex>
        <Flex p={2} align='center' justify='center'>
          <Box align='center' justify='center'>
            <Button intent={Intent.PRIMARY} style={hiddenIfLoggedOut} active
              onClick={this.handleLogoutClick} text='Logout' />
          </Box>
        </Flex>
      </div>
    )
  }
}

export default SessionPanel
