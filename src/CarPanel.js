import React, { Component } from 'react'
import { Icon, TagInput, FormGroup, Button, Intent } from '@blueprintjs/core'
import { Formik, Form } from 'formik'
import { Flex, Box } from 'reflexbox'
import * as Yup from 'yup'
import memoizeOne from 'memoize-one'
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
    handleReset,
    handleChange,
    validateForm,
    initialValues,
    setFieldTouched,
    setFieldValue,
    values,
    errors,
    user,
    scaleIp,
    openCarInEditpanel
  } = props

  const showToast = (msg, intent, icon, timeout) => {
    DisplayToast.show({
      'message': msg,
      'intent': intent,
      'icon': icon,
      'timeout': timeout
    })
  }

  const handleTagChange = (tags) => {
    setFieldValue('races', tags)
    setFieldValue('racesInput', '')
  }

  const handleGetCar = async () => {
    try {
      let config = {
        headers: { 'Authorization': 'Bearer ' + user.token }
      }
      let response = await axios.get(
        'http://' + scaleIp + ':1337/info', config)
      setFieldValue('rf', response.data.rfid)
      setFieldValue('weight', response.data.weight)
    } catch (err) {
      console.log('CarPanel: Could not get car details from scale!')
      showToast('Could not connect to scale!', Intent.DANGER,
        'warning-sign', 5000)
    }
  }

  const handleTagClear = () => handleTagChange([])

  const clearButton = (
    <Button
      icon='cross'
      minimal
      onClick={handleTagClear}
    />
  )

  const handleClear = () => {
    openCarInEditpanel(null)
  }

  return (
    <Form>
      <Flex column p={1}>
        <Box w={1} px={1} className='pwd-carform-details'>
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

          <FormGroup
            label={'Weight'}
            labelFor='weight'
            labelInfo={''} >
            <FieldWithError
              fieldname={'weight'}
              placeholder={'Weight'}
              handleChange={handleChange}
              disabled
              values={values}
              errors={errors} />
          </FormGroup>
        </Box>
        <Box w={1 / 3} px={1} className={'formbutton-right'}>
          <Button className={'formbutton'}
            id='getrfid' onClick={handleGetCar}
            type='button'
            intent={Intent.NONE} large fill
            text={isSubmitting ? 'Getting...' : 'Get car details'} />
        </Box>

        <Box w={1} px={1}>
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

        <Box w={1} px={1}>
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
            labelInfo={''} >
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

        <Box w={1} className={'formbutton-right'}>
          <Flex w={1}>
            <Box w={1} px={1} className={'formbutton-right'}>
              <Button className={'formbutton'}
                id='clearForm' onClick={handleClear}
                type='button'
                intent={Intent.NONE} large fill
                text={'Clear Form'} />
            </Box>
            <Box w={1} px={1} className={'formbutton-right'}>
              <Button className={'formbutton'}
                id='resetForm' onClick={handleReset}
                type='button'
                intent={Intent.NONE} large fill
                text={'Reset Form'} />
            </Box>
            <Box w={1} px={1} className={'formbutton-right'}>
              <Button className={'formbutton'}
                id='saveCar' onClick={handleSubmit}
                type='button'
                intent={Intent.PRIMARY} large fill
                text={isSubmitting ? 'Saving...' : 'Save car'} />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Form>
  )
}

class EditCarForm extends Component {
  constructor (props) {
    super(props)
    this.defaultState = {
      'rf': '',
      'weight': 0,
      'ow': '',
      'name': '',
      'country': '',
      'races': ['2019-Quali'],
      'mn': '201906261',
      'sn': '',
      'racesInput': '',
      'newcar': true
    }
    this.state = this.defaultState
  }

  componentDidMount () {
    console.log('EditCarForm: mounted.')
    this.memoizeGetCar(this.props.carToEdit)
  }

  componentDidUpdate () {
    console.log('EditCarForm: updated')
    this.memoizeGetCar(this.props.carToEdit, this.props.editFormTrigger)
    console.log('EditCarForm::componentDidUpdate: state is', this.state)
  }

  memoizeGetCar = memoizeOne(
    (p) => {
      console.log('EditCarForm::memoizedGetCar: submitted prop is', p)
      this.editCar(this.props.carToEdit)
    }
  )

  editCar = async (rfid) => {
    console.log('EditCarForm::editCar: getting car from server')
    if (rfid === null) {
      // this is a request to clear the form
      this.setState({
        ...this.defaultState,
        'editFormTrigger': this.props.editFormTrigger
      })
    } else {
      // try to get a car to edit
      try {
        if (!this.props.user) {
          console.log('EditCarForm::editCar: not logged in, cannot get!')
          throw (new Error('Not Logged In'))
        }
        let config = {
          headers: { 'Authorization': 'Bearer ' + this.props.user.token }
        }
        let response = await axios.get(
          this.props.urlprefix + '/car/' + rfid, config)
        // we got one car object in response.data
        let car = response.data
        car['newcar'] = false
        this.setState(car)
        return true
      } catch (err) {
        console.log('EditCarForm::editCar: error getting car: ', err)
        return false
      }
    }
  }

  async saveCar (car) {
    try {
      if (!this.props.user) {
        console.log('EditCarForm::saveCar: not logged in, cannot save!')
        throw (new Error('Not Logged In'))
      }
      console.log('EditCarForm::saveCar: saving a car: ' + car)
      let config = {
        headers: { 'Authorization': 'Bearer ' + this.props.user.token }
      }
      // remove the input field from the values
      delete car.racesInput
      let response
      if (this.state.newcar) {
        response = await axios.post(
          this.props.urlprefix + '/car/' + car.rf, car, config)
      } else {
        response = await axios.put(
          this.props.urlprefix + '/car/' + car.rf, car, config)
      }
      console.log('EditCarForm::saveCar: stored car:', response)
      if (response.data.success) {
        // success storing the new settings
      }
      return true
    } catch (err) {
      console.log('EditCarForm::saveCar: error storing application settings: ', err)
      return false
    }
  }

  onSubmit = async (values, actions) => {
    try {
      if (await this.saveCar(values)) {
        this.showToast('Successfully saved the car',
          Intent.SUCCESS, 'tick-circle', 2000)
        this.props.toggleCarlistRefresh()
      } else {
        this.showToast('Failed to save the car',
          Intent.DANGER, 'warning-sign', 5000)
      }
      actions.setSubmitting(false)
    } catch (err) {
      this.showToast('Failed to submit the car',
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
    const initialValues = this.state

    return (
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        onSubmit={this.onSubmit}
        component={
          (formikProps) => <CarForm
            {...formikProps}
            {...this.props} />
        }
      />
    )
  }
}

class CarPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'editIsOpen': false,
      'refreshToggle': false,
      'carToEdit': null,
      'editFormTrigger': 0
    }
  }

  toggleCarlistRefresh = () => {
    this.setState({ 'refreshToggle': !this.state.refreshToggle })
    this.props.incrementRaceRefresh()
  }

  openCarEditPanel = () => {
    this.setState({ 'editIsOpen': !this.state.editIsOpen })
  }

  openCarInEditpanel = (rfid) => {
    // component is instantiated with carToEdit = null
    // only if this function is called then the state is changed
    // and propagated to the edit window. As soon as ....
    // is finished, the state is reset to null and the edit window
    // can function as new edit panel again
    if (this.state.carToEdit === null && rfid === null) {
      // we had a new, empty careditor, but are asked to clear the form
      // again, increase trigger, so that the form is refreshed
      let newtrigger = this.state.editFormTrigger + 1
      this.setState({ 'editFormTrigger': newtrigger })
    } else {
      this.setState({ 'carToEdit': rfid })
    }
  }

  render () {
    const panelActive = this.props.active ? {} : { 'display': 'none' }
    const drawerStyle = this.state.editIsOpen ? {} : { 'display': 'none' }

    return (
      <div className='carpanel' style={panelActive}>
        <Flex w={1} p={0}>
          <Box w={this.state.editIsOpen ? 13 / 20 : 19 / 20}>
            <CarList
              user={this.props.user}
              urlprefix={this.props.urlprefix}
              raceId={this.props.raceId}
              refreshToggle={this.state.refreshToggle}
              columns={this.state.editIsOpen ? 2 : 3}
              openCarInEditpanel={this.openCarInEditpanel}
            />
          </Box>
          <Box w={1 / 20}>
            <Flex column className='drawercontainer'
              justify='flex-start' align='flex-end'>
              <Box w={1} className='drawerspacer' py={2} px={1} />
              <Box w={1} className='drawerbutton' py={2} px={1}
                onClick={this.openCarEditPanel} >
                <Icon icon={this.state.editIsOpen
                  ? 'chevron-right'
                  : 'chevron-left'}
                />
              </Box>
            </Flex>
          </Box>
          <Box w={this.state.editIsOpen ? 6 / 20 : 0}
            style={drawerStyle}>
            <EditCarForm
              user={this.props.user}
              urlprefix={this.props.urlprefix}
              raceId={this.props.raceId}
              scaleIp={this.props.scaleIp}
              toggleCarlistRefresh={this.toggleCarlistRefresh}
              openCarInEditpanel={this.openCarInEditpanel}
              carToEdit={this.state.carToEdit}
              editFormTrigger={this.state.editFormTrigger}
            />
          </Box>
        </Flex>
      </div>
    )
  }
}

export default CarPanel
