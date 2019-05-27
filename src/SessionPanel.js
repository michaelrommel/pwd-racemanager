import React, { Component } from 'react'
import { Spinner, FormGroup, Icon, Button, Card, InputGroup, Intent, Tooltip, HTMLTable, H5 } from '@blueprintjs/core'
import { Formik, Form } from 'formik'
import { Flex, Box } from 'reflexbox'
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
    errors,
  } = props

  const handleLockClick = () => {
    setFieldValue('showPassword', !values.showPassword, false)
  }

  const LockButton = (
    <Tooltip content={`${values.showPassword ? 'Hide' : 'Show'} Password`}>
      <Button
        value={values.showPassword}
        icon={values.showPassword ? "unlock" : "lock"}
        intent={Intent.NONE}
        onClick={handleLockClick}
      />
    </Tooltip>
  )

  return (
    <Form>
      <FormGroup>
        <Flex align={'center'}>
          <Box w={6 / 10} pr={2} >
            <InputGroup id='username' placeholder='Username' large
              leftIcon='person' className='logingroup'
              value={values.newuser} onChange={handleChange} />
          </Box>
          <Box justify={'center'} hidden={!errors['username']} >
            <Icon icon='warning-sign' iconSize={30} intent={Intent.DANGER} />
          </Box>
          <Box w={3 / 10} pl={2} justify={'left'} hidden={!errors['username']} >
            {errors['username']}
          </Box>
        </Flex>
        <Flex align={'center'}>
          <Box w={6 / 10} pr={2} >
            <InputGroup id='password' placeholder='Password' large
              leftIcon='key' rightElement={LockButton} type={values.showPassword ? 'text' : 'password'}
              value={values.newpass} onChange={handleChange} className='logingroup' />
          </Box>
          <Box justify={'center'} hidden={!errors['password']} >
            <Icon icon='warning-sign' iconSize={30} intent={Intent.DANGER} />
          </Box>
          <Box w={3 / 10} pl={2} justify={'left'} hidden={!errors['password']} >
            {errors['password']}
          </Box>
        </Flex>
        <Flex justify={'center'} align={'center'}>
          <Box w={6 / 10} p={1} justify={'center'} >
            <Button id='submit' onClick={handleSubmit} type='submit'
              intent={Intent.PRIMARY} large active={true}
              text={isSubmitting ? '' : 'Login'}> 
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
    this.state = {
      'showPassword': false,
      'newuser': '',
      'newpass': ''
    }
    this.ValidationSchema = getValidationSchema()
  }

  handleLogoutClick = (e) => {
    console.log('Logging out user: ' + this.props.user)
    this.setState(
      {
        'user': null,
        'newuser': '',
        'newpass': ''
      }
    )
    this.props.onUserChange(null)
  }

  handleLoginClick = async (values, actions) => {
    const username = values.username
    const password = values.password

    console.log('Logging in user: ' + username)
    // Do something to validate the user/pass combination
    try {
      let user = await axios.post('https://pwd-racetrack/auth/local-login',
        { 'username': username,
          'password': password })
      // we got a user, propagate it to the state
      this.setState({ 'user': user.data })
      this.props.onUserChange(user.data)
      actions.setSubmitting(false);
    } catch (err) {
      console.log('Error in logging in: ', err)
    }
  }

  render () {
    const panelActive = this.props.active ? {} : {'display': 'none'}

    const loggedIn = this.props.user === null ? false : true
    const hiddenIfLoggedIn = loggedIn ? {'display': 'none'} : {}
    const hiddenIfLoggedOut = !loggedIn ? {'display': 'none'} : {}

    return (
      <div className='sessionpanel' style={panelActive}>
        <Flex p={2} align='center' justify='center'>
          <Box w={1/2} style={hiddenIfLoggedOut}>
            <Card>
              <H5>Session Information</H5>
              <HTMLTable className='sessiontable'>
                <thead><tr><th width="25%">Key</th><th>Value</th></tr></thead>
                <tbody>
                  <tr>
                    <td>User</td>
                    <td>{this.props.user !== null ? this.props.user.name : ''}</td>
                  </tr>
                  <tr>
                    <td>Role</td>
                    <td>{this.props.user !== null ? this.props.user.role : ''}</td>
                  </tr>
                  <tr>
                    <td>Token</td>
                    <td>{this.props.user !== null ? this.props.user.token : ''}</td>
                  </tr>
                </tbody>
              </HTMLTable>
            </Card>
          </Box>
          <Box w={1/2} style={hiddenIfLoggedIn}>
            <Formik
              enableReinitialize={true}
              initialValues={{
                'username': this.state.newuser,
                'password': this.state.newpass,
                'showPassword': false
              }}
              showPassword={this.state.showPassword} 
              handleLockClick={this.handleLockClick}
              validationSchema={this.ValidationSchema}
              onSubmit={this.handleLoginClick}
              render={LoginForm}
            />
          </Box>
        </Flex>
        <Flex p={2} align='center' justify='center'>
          <Box align='center' justify='center'>
            <Button intent={Intent.PRIMARY} style={hiddenIfLoggedOut} active={true}
              onClick={this.handleLogoutClick} text='Logout'/>
          </Box>
        </Flex>
      </div>
    )
  }
}

export default SessionPanel
