import React, { Component } from 'react'
import { FormGroup, InputGroup, Callout, Intent, Icon, Tooltip, Position, Button } from '@blueprintjs/core'
import { Formik, Form } from 'formik'
import { Flex, Box } from 'reflexbox'
import * as Yup from 'yup'

const getValidationSchema = (values) => { 
  return (
    Yup.object().shape({
      appState: Yup.string()
        .oneOf(['fresh','configured'])
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
          (ghid) => ( /^[\x61-\x7a\x30-\x39]*$/.test(ghid))
        ),
      githubClientSecret: Yup.string()
        .test(
          'ghsecret',
          'Can contain only lowercase letters and numbers!',
          (ghsec) => ( /^[\x61-\x7a\x30-\x39]*$/.test(ghsec))
        )
    })
  )
}


function AppSettingsForm (props) {
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
        helperText={'Indicates whether this installation has been initially configured.'}
        label={'Application State'}
        labelFor='appState'
        labelInfo={'(required)'} >
        <Flex align={'center'}>
          <Box w={6/10} pr={2} >
            <InputGroup id="appState" placeholder='Application State' large
              value={values.appState} onChange={handleChange}/>
          </Box>
          <Box justify={'center'} hidden={errors.appState ? false : true} >
            <Tooltip content={errors.appState} position={Position.TOP} >
              <Icon icon='warning-sign' iconSize={30} intent={Intent.DANGER} />
            </Tooltip>
          </Box>
          <Box w={3/10} pl={2} justify={'left'} hidden={errors.appState ? false : true} >
            {errors.appState}
          </Box>
        </Flex>
      </FormGroup>

			<FormGroup
				helperText={'The JSON Web Token Secret used to sign and verify the tokens.'}
				label={'JSON Web Token Secret'}
				labelFor='jwtSecret'
				labelInfo={'(required)'} >
        <Flex align={'center'}>
          <Box w={6/10} pr={2} >
					  <InputGroup id="jwtSecret" placeholder='JWT Secret' large
						  value={values.jwtSecret} onChange={handleChange}/>
          </Box>
          <Box w={4/10} pl={2} justify={'left'} hidden={errors.jwtSecret ? false : true} >
            <Callout hidden={errors.jwtSecret ? false : true}
              intent={Intent.DANGER} icon={'warning-sign'}>
              {errors.jwtSecret}
            </Callout>
          </Box>
        </Flex>
			</FormGroup>

			<FormGroup
					helperText={'Password for the admin user "root". This needs to be changed!'}
					label={'root Password'}
					labelFor='rootpwd'
					labelInfo={'(required)'} >
          <InputGroup id="rootpwd" placeholder='root password' large
            value={values.rootpwd} onChange={handleChange}/>
			</FormGroup>
			<Callout className={'formerrors'} hidden={errors.rootpwd ? false : true}
				intent={Intent.DANGER} icon={'warning-sign'}>
				{errors.rootpwd}
			</Callout>

			<FormGroup
				helperText={'Github Client ID for OAuth authentication.'}
				label={'Github Client ID'}
				labelFor='githubClientId'
				labelInfo={'(optional)'} >
        <Flex align={'center'} justify={'space-between'}>
          <Box w={19/20} pr={2} >
					  <InputGroup id="githubClientId" placeholder='Github Client ID' large
						  value={values.githubClientId} onChange={handleChange}/>
          </Box>
          <Box hidden={errors.githubClientId ? false : true} >
            <Tooltip content={errors.githubClientId} position={Position.TOP} >
              <Icon icon='warning-sign' iconSize={30} intent={Intent.DANGER} />
            </Tooltip>
          </Box>
        </Flex>
			</FormGroup>

			<FormGroup
					helperText={'Github Client Secret for OAuth authentication.'}
					label={'Github Client Secret'}
					labelFor='githubClientSecret'
					labelInfo={'(optional)'} >
          <InputGroup id="githubClientSecret" placeholder='Github Client Secret' large
            value={values.githubClientSecret} onChange={handleChange}/>
			</FormGroup>
			<Callout className={'formerrors'} hidden={errors.githubClientSecret ? false : true}
				intent={Intent.DANGER} icon={'warning-sign'}>
				{errors.githubClientSecret}
			</Callout>

      <Button className={'savebutton'} id='submit' onClick={handleSubmit} type='submit'
				intent={Intent.PRIMARY} large={true} 
				text={isSubmitting ? 'Saving...' : 'Save'} />
		</Form>
  )
}


class SettingsPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'appState': 'fresh',
      'jwtSecret': 'dK8TDkc0qOdeE8-iUpzxG',
      'rootpwd': 'tdlvucveLpCghyS4ZSsJB',
      'rootPwdChanged': false,
      'githubClientId': "123A",
      'githubClientSecret': "123"
    }
    // we call a function to return a validation Yup schema
    // this gives us the ability to pass a state parameter 
    // to the created schema
    this.ValidationSchema = getValidationSchema(this.state)
  }

  render () {
    const panelActive = this.props.active ? {} : {'display': 'none'}

    const initialValues = this.state

    const onSubmit = (values, actions) => {
      try {
        console.log(values)
        //actions.setSubmitting(false);
      } catch (err) {
        actions.setSubmitting(false);
        actions.setErrors({ 'appState':'This is an example error' });
        actions.setStatus({ 'msg': 'Set some arbitrary status or data' });
      }
    }

    return (
      <div className='settingspanel' style={panelActive}>
				<Flex p={2} align='center' justify='center'>
          <Box w={4/5}>
						<Formik
							initialValues={initialValues}
							validationSchema={this.ValidationSchema}
							onSubmit={onSubmit}
							render={AppSettingsForm}
						/>
					</Box>
				</Flex>
      </div>
    )
  }
}

export default SettingsPanel
