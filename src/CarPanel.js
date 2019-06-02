import React, { Component } from 'react'
import { TagInput, FormGroup, Button, Collapse, Intent } from '@blueprintjs/core'
import { Formik, Form } from 'formik'
import { Flex, Box } from 'reflexbox'
import * as Yup from 'yup'
import axios from 'axios'
import FormikValidator from './FormikValidator'
import FieldWithError from './FieldWithError.js'
import DisplayToast from './DisplayToast'
import CarList from './CarList'

const getValidationSchema = () => {
  return (
    Yup.object().shape({
      rf: Yup.string()
        .required('Required'),
      ow: Yup.string()
        .max(14, 'Too long!')
        .required('Required'),
      name: Yup.string()
        .required('Required'),
      country: Yup.string()
        .required('Required'),
      mn: Yup.number()
        .required('Required'),
      sn: Yup.number()
        .required('Required')
    })
  )
}

const CarForm = (props) => {
  let {
    isSubmitting,
    handleSubmit,
    handleChange,
    validateForm,
    initialValues,
    setFieldTouched,
    setFieldValue,
    values,
    errors
  } = props

  const handleTagChange = (tags) => {
    setFieldValue('races', tags)
    setFieldValue('racesInput', '')
  }

  const handleTagClear = () => handleTagChange([])

  const clearButton = (
    <Button
      icon='cross'
      minimal
      onClick={handleTagClear}
    />
  )

  return (
    <Form>
      <Flex p={1} className='pwd-carform-rfid'>
        <Box w={1 / 3} px={1}>
          <FormGroup
            label={'Car RFID'}
            labelFor='rf'
            labelInfo={'(required)'} >
            <FieldWithError
              fieldname={'rf'}
              placeholder={'RFID'}
              handleChange={handleChange}
              values={values}
              errors={errors} />
          </FormGroup>
        </Box>
      </Flex>

      <Flex p={1} justify='flex-start' className='pwd-carform-details'>
        <Box w={1 / 3} px={1}>
          <FormGroup
            label={'Owner\'s Full Name'}
            labelFor='name'
            labelInfo={'(required)'} >
            <FieldWithError
              fieldname={'name'}
              placeholder={'Firstname Lastname'}
              handleChange={handleChange}
              values={values}
              errors={errors} />
          </FormGroup>

          <FormGroup
            label={'Short Name'}
            labelFor='ow'
            labelInfo={'(required, max 14 characters)'} >
            <FieldWithError
              fieldname={'ow'}
              placeholder={'Shortname'}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              values={values}
              errors={errors} />
          </FormGroup>

          <FormGroup
            label={'Country'}
            labelFor='country'
            labelInfo={'(required)'} >
            <FieldWithError
              fieldname={'country'}
              placeholder={'Country'}
              handleChange={handleChange}
              values={values}
              errors={errors} />
          </FormGroup>
        </Box>

        <Box w={1 / 3} px={1}>
          <FormGroup
            label={'Material Number'}
            labelFor='mn'
            labelInfo={'(required)'} >
            <FieldWithError
              disabled
              fieldname={'mn'}
              placeholder={'201906261'}
              handleChange={handleChange}
              values={values}
              errors={errors} />
          </FormGroup>

          <FormGroup
            label={'Serial Number'}
            labelFor='sn'
            labelInfo={'(required)'} >
            <FieldWithError
              fieldname={'sn'}
              placeholder={'12345'}
              handleChange={handleChange}
              values={values}
              errors={errors} />
          </FormGroup>

          <FormGroup
            label={'Races'}
            labelFor='races'
            labelInfo={'(optional)'} >
            <TagInput
              large
              addOnBlur
              addOnPaste
              placeholder={'2019-Demo'}
              rightElement={clearButton}
              inputProps={{ 'id': 'racesInput' }}
              onInputChange={handleChange}
              inputValue={values.racesInput}
              id={'races'}
              onChange={handleTagChange}
              values={values.races} />
          </FormGroup>

          <FormikValidator
            initialValues={initialValues.rf}
            values={values.rf}
            fieldName={'rf'}
            validateForm={validateForm}
            setFieldTouched={setFieldTouched}
          />
        </Box>

        <Box>
          <Button className={'savebutton'}
            id='saveCar' onClick={handleSubmit}
            type='button'
            intent={Intent.PRIMARY} large
            text={isSubmitting ? 'Saving...' : 'Save car'} />
        </Box>
      </Flex>
    </Form>
  )
}

class NewCarFormCollapse extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'rf': '',
      'ow': '',
      'name': '',
      'country': '',
      'races': [],
      'mn': '201906261',
      'sn': '',
      'racesInput': ''
    }
  }

  async saveCar (car) {
    try {
      if (!this.props.user) {
        console.log('CarPanel::saveCar: not logged in, cannot save!')
        throw (new Error('Not Logged In'))
      }
      console.log('CarPanel::saveCar: saving a car: ')
      let config = {
        headers: { 'Authorization': 'Bearer ' + this.props.user.token }
      }
      // remove the input field from the values
      delete car.racesInput
      let response = await axios.post(
        this.props.urlprefix + '/car/' + car.rf, car, config)
      console.log('SettingsPanel: stored car:', response)
      if (response.data.success) {
        // success storing the new settings
      }
      return true
    } catch (err) {
      console.log('Settingspanel: error storing application settings: ', err)
      return false
    }
  }

  onSubmit = async (values, actions) => {
    try {
      if (await this.saveCar(values)) {
        this.showToast('Successfully saved the car.',
          Intent.SUCCESS, 'tick-circle')
        this.props.toggleCarlistRefresh()
      } else {
        this.showToast('Failed to save the car.',
          Intent.DANGER, 'warning-sign')
      }
      actions.setSubmitting(false)
    } catch (err) {
      this.showToast('Failed to submit the car.',
        Intent.DANGER, 'warning-sign')
      actions.setSubmitting(false)
    }
  }

  showToast = (msg, intent, icon) => {
    DisplayToast.show({ 'message': msg, 'intent': intent, 'icon': icon })
  }

  render () {
    const initialValues = this.state

    return (
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        onSubmit={this.onSubmit}
        component={CarForm}
      />
    )
  }
}

class CarPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'editIsOpen': false,
      'refreshToggle': false
    }
  }

  openCarEditPanel = () => {
    this.setState({ 'editIsOpen': !this.state.editIsOpen })
  }

  toggleCarlistRefresh = () => {
    this.setState({ 'refreshToggle': !this.state.refreshToggle })
  }

  render () {
    const panelActive = this.props.active ? {} : { 'display': 'none' }

    return (
      <div className='carpanel' style={panelActive}>
        <Collapse isOpen={this.state.editIsOpen}>
          <NewCarFormCollapse
            user={this.props.user}
            urlprefix={this.props.urlprefix}
            raceId={this.props.raceId}
            toggleCarlistRefresh={this.toggleCarlistRefresh}
          />
        </Collapse>
        <Flex w={1} p={0}>
          <Box w={17 / 20}>
            <CarList
              user={this.props.user}
              urlprefix={this.props.urlprefix}
              raceId={this.props.raceId}
              refreshToggle={this.state.refreshToggle}
            />
          </Box>
          <Box w={3 / 20} p={1}>
            <Button onClick={this.openCarEditPanel}
              fill
              intent={Intent.SUCCESS}>
              {this.state.editIsOpen ? 'Close panel' : 'Add new car'}
            </Button>
          </Box>
        </Flex>
      </div>
    )
  }
}

export default CarPanel
