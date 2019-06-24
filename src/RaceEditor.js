import React, { Component } from 'react'
import { Icon, FormGroup, Button, Intent } from '@blueprintjs/core'
import { Formik, Form } from 'formik'
import { Flex, Box } from 'reflexbox'
import * as Yup from 'yup'
import memoizeOne from 'memoize-one'
import axios from 'axios'
import FormikValidator from './FormikValidator'
import FieldWithError from './FieldWithError.js'
import DisplayToast from './DisplayToast'
import CarListField from './CarListField'
import RemainingCarPool from './RemainingCarPool'

const getValidationSchema = () => {
  return (
    Yup.object().shape({
      id: Yup.string()
        .required('Required'),
      description: Yup.string()
        .max(80, 'Too long!')
        .required('Required'),
      lanes: Yup.number()
        .min(4, 'Only 4 lanes supported')
        .max(4, 'Only 4 lanes supported')
        .required('Required'),
      countCars: Yup.number()
        .required('Required'),
      startAt: Yup.number()
        .required('Required'),
      finalists: Yup.number()
        .required('Required')
    })
  )
}

/*
      cars: Yup.array()
        .required('Required')
        .min(1, 'Minimum of one car needed')
*/

class RaceForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'addPanelIsOpen': false
    }
  }

  componentDidMount () {
    console.log('RaceEditor::RaceForm: mounted')
    // the form has been re-initialized with new values,
    // trigger the validation of the field gotten in props
    this.evaluateStatus(true)
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.initialValues !== this.props.initialValues) {
      console.log('RaceEditor::RaceForm: initialValues changed')
      // the form has been re-initialized with new values,
      // trigger the validation of the field gotten in props
      this.evaluateStatus(true)
    }
  }

  handleClear = () => {
    this.props.openRaceInEditpanel(null)
  }

  handleSaveRace = () => {
    this.props.submitForm()
    this.evaluateStatus(false)
  }

  modifyCarList = (p) => {
    // TODO: code to manipulate the car list
    console.log(p)
  }

  openAddPanel = () => {
    this.setState({ 'addPanelIsOpen': !this.state.addPanelIsOpen })
  }

  evaluateStatus = (addSuggested) => {
    let newcars = { ...this.props.values.cars }
    let newAllCars = { ...this.props.values.allCars }
    let count = Object.keys(newcars).length
    let shouldBeIn

    if (Object.keys(newAllCars).length === 0 ||
        Object.keys(newcars).length === 0) return null

    Object.keys(this.props.values.allCars).forEach((carid) => {
      // check whether the car should be in the race
      let races = this.props.values.allCars[carid].races
      if (races !== undefined && races.length > 0) {
        shouldBeIn = races.reduce((acc, cur) => {
          acc = acc || (cur === this.props.values.id)
          return acc
        }, false)
      } else {
        shouldBeIn = false
      }
      // check whether the car is actually in the stored
      // configuration on the server
      let isIn = Object.values(this.props.initialValues.cars).reduce((acc, cur) => {
        acc = acc || (cur === carid)
        return acc
      }, false)
      // reset a default value
      newAllCars[carid].stat = ''
      // compare
      if (shouldBeIn && !isIn) {
        if (addSuggested) {
          // add if it is allowed at the beginning when the initialValues
          // are set
          let isAlreadyProposed = Object.values(this.props.values.cars)
            .reduce((acc, cur) => {
              acc = acc || (cur === carid)
              return acc
            }, false)
          if (!isAlreadyProposed) {
            newcars[++count] = carid
          }
        }
        newAllCars[carid].stat = 'added'
      }
      if (!shouldBeIn && isIn) {
        // flag as to be removed
        newAllCars[carid].stat = 'removed'
      }
    })
    if (addSuggested) {
      this.props.setFieldValue('cars', newcars, false)
      this.props.setFieldValue('countCars', count, false)
    }
    this.props.setFieldValue('allCars', newAllCars, false)
  }

  addClickHandler = (e) => {
    console.log('RaceEditor::addClickHandler')
    let id = e.currentTarget.id.slice(5)
    console.log('Adding: ', id)
    let newcars = {}
    let count = 0
    Object.keys(this.props.values.cars).forEach((key) => {
      count++
      newcars[count] = this.props.values.cars[key]
    })
    newcars[++count] = id
    console.log('new cars: ', JSON.stringify(newcars, null, 2))
    this.props.setFieldValue('cars', newcars)
    this.props.setFieldValue('countCars', count)
  }

  removeClickHandler = (e) => {
    console.log('RaceEditor::removeClickHandler')
    console.log('Removing: ', e.currentTarget.id)
    let newcars = {}
    let count = 0
    Object.keys(this.props.values.cars).forEach((key) => {
      if (this.props.values.cars[key] !== e.currentTarget.id) {
        count++
        newcars[count] = this.props.values.cars[key]
      }
    })
    console.log('Remaining cars: ', JSON.stringify(newcars, null, 2))
    this.props.setFieldValue('cars', newcars)
    this.props.setFieldValue('countCars', count)
    e.stopPropagation()
  }

  render () {
    let {
      isSubmitting,
      handleReset,
      handleChange,
      validateForm,
      initialValues,
      setFieldTouched,
      values,
      errors,
      user,
      urlprefix,
      raceToEdit,
      refreshToggle
    } = this.props

    const drawerStyle = this.state.addPanelIsOpen ? {} : { 'display': 'none' }

    return (
      <Form>
        <Flex p={1}>
          <Box w={2 / 5} px={1}>
            <FormGroup
              label={'Race ID'}
              labelFor='id'
              labelInfo={'(required)'} >
              <FieldWithError
                fieldname={'id'}
                placeholder={'Race ID'}
                disabled={initialValues.id !== ''}
                handleChange={handleChange}
                values={values}
                errors={errors} />
            </FormGroup>
            <FormGroup
              label={'Number of cars'}
              labelFor='countCars'
              labelInfo={'(calculated)'} >
              <FieldWithError
                fieldname={'countCars'}
                placeholder={'7'}
                disabled
                handleChange={handleChange}
                values={values}
                errors={errors} />
            </FormGroup>
            <FormGroup
              label={'Number of lanes'}
              labelFor='lanes'
              labelInfo={'(fixed)'} >
              <FieldWithError
                fieldname={'lanes'}
                placeholder={'Number of Lanes ID'}
                handleChange={handleChange}
                disabled
                values={values}
                errors={errors} />
            </FormGroup>
            <FormGroup
              label={'Number of rounds'}
              labelFor='rounds'
              labelInfo={'(required)'} >
              <FieldWithError
                fieldname={'rounds'}
                placeholder={'1'}
                handleChange={handleChange}
                values={values}
                errors={errors} />
            </FormGroup>
          </Box>
          <Box w={2 / 5} px={1}>
            <FormGroup
              label={'Description'}
              labelFor='description'
              labelInfo={'(required)'} >
              <FieldWithError
                fieldname={'description'}
                placeholder={'Description'}
                handleChange={handleChange}
                values={values}
                errors={errors} />
            </FormGroup>
            <FormGroup
              label={'Number of finalists'}
              labelFor='finalists'
              labelInfo={'(required)'} >
              <FieldWithError
                fieldname={'finalists'}
                placeholder={'7'}
                handleChange={handleChange}
                values={values}
                errors={errors} />
            </FormGroup>
            <FormGroup
              label={'Status'}
              labelFor='raceStatus'
              labelInfo={'(calculated)'} >
              <FieldWithError
                fieldname={'raceStatus'}
                placeholder={'-'}
                handleChange={handleChange}
                disabled
                values={values}
                errors={errors} />
            </FormGroup>
            <FormGroup
              label={'First heat number'}
              labelFor='startAt'
              labelInfo={'(fixed)'} >
              <FieldWithError
                fieldname={'startAt'}
                placeholder={'1'}
                disabled
                handleChange={handleChange}
                values={values}
                errors={errors} />
            </FormGroup>

            <FormikValidator
              initialValues={initialValues.id}
              values={values.id}
              fieldName={'id'}
              validateForm={validateForm}
              setFieldTouched={setFieldTouched}
            />
          </Box>

          <Box w={1 / 5} className={'formbutton-right'}>
            <Flex column w={1}>
              <Box w={1} px={1} className={'formbutton-right'}>
                <Button className={'formbutton-tight'}
                  id='clearForm' onClick={this.handleClear}
                  type='button'
                  intent={Intent.NONE} large fill
                  text={'Clear Form'} />
              </Box>
              <Box w={1} px={1} className={'formbutton-right'}>
                <Button className={'formbutton-tight'}
                  id='resetForm' onClick={handleReset}
                  type='button'
                  intent={Intent.NONE} large fill
                  text={'Reset Form'} />
              </Box>
              <Box w={1} px={1} className={'formbutton-right'}>
                <Button className={'formbutton-tight'}
                  id='saveCar' onClick={this.handleSaveRace}
                  type='button'
                  intent={Intent.PRIMARY} large fill
                  text={isSubmitting ? 'Saving...' : 'Save race'} />
              </Box>
            </Flex>
          </Box>
        </Flex>

        <Flex w={1} wrap column={false}>
          <Box w={this.state.addPanelIsOpen ? 14 / 20 : 19 / 20}>
            <Flex wrap>
              <CarListField
                fieldname='cars'
                values={values}
                handleChange={this.modifyCarList}
                raceToEdit={raceToEdit}
                user={user}
                allCars={values.allCars}
                urlprefix={urlprefix}
                refreshToggle={refreshToggle}
                addClickHandler={this.addClickHandler}
                removeClickHandler={this.removeClickHandler}
                columns={this.state.addPanelIsOpen ? 3 : 4}
              />
            </Flex>
          </Box>
          <Box w={1 / 20}>
            <Flex column className='drawercontainer'
              justify='flex-start' align='flex-end'>
              <Box w={1} className='drawerspacer' py={2} px={1} />
              <Box w={1} className='drawerbutton' py={2} px={1}
                onClick={this.openAddPanel} >
                <Icon icon={this.state.addPanelIsOpen
                  ? 'chevron-right'
                  : 'chevron-left'}
                />
              </Box>
            </Flex>
          </Box>
          <Box w={this.state.addPanelIsOpen ? 5 / 20 : 0}
            style={drawerStyle}>
            <Flex column>
              <RemainingCarPool
                fieldname='cars'
                values={values}
                handleChange={this.modifyCarList}
                raceToEdit={raceToEdit}
                user={user}
                allCars={values.allCars}
                urlprefix={urlprefix}
                refreshToggle={refreshToggle}
                addClickHandler={this.addClickHandler}
                removeClickHandler={this.removeClickHandler}
                columns={this.state.addPanelIsOpen ? 3 : 4}
              />
            </Flex>
          </Box>
        </Flex>
      </Form>
    )
  }
}

class RaceEditor extends Component {
  constructor (props) {
    super(props)
    this.defaultState = {
      'id': '',
      'description': '',
      'lanes': 4,
      'countCars': 0,
      'rounds': 1,
      'raceStatus': '-',
      'cars': [],
      'startAt': 1,
      'finalists': 7,
      'newrace': true
    }
    this.state = this.defaultState
  }

  componentDidMount () {
    console.log('RaceEditor: mounted.')
    this.memoizeGetRace(this.props.raceToEdit, this.props.refreshToggle)
  }

  componentDidUpdate () {
    console.log('RaceEditor: updated')
    this.memoizeGetRace(this.props.raceToEdit, this.props.refreshToggle)
    console.log('RaceEditor::componentDidUpdate: state is', this.state)
  }


  memoizeGetRace = memoizeOne(
    (p) => {
      console.log('RaceEditor::memoizedGetRace: submitted race is', p)
      this.editRace(this.props.raceToEdit)
    }
  )

  editRace = async (id) => {
    console.log('RaceEditor::editRace: getting race from server')
    let allCars
    let race
    if (id === null) {
      // this is a request to clear the form
      this.setState(this.defaultState)
    } else {
      // try to get a race to edit
      try {
        if (!this.props.user) {
          console.log('RaceEditor::editRace: not logged in, cannot get!')
          throw (new Error('Not Logged In'))
        }
        let config = {
          headers: { 'Authorization': 'Bearer ' + this.props.user.token }
        }
        let response = await axios.get(
          this.props.urlprefix + '/race/' + id, config)
        // we got one race object in response.data
        race = response.data
        race.newrace = false
        race.id = id
      } catch (err) {
        console.log('RaceEditor::editRace: Error getting race ', err)
        return false
      }
    }
    console.log('RaceEditor::editRace: getting cars from server')
    try {
      if (!this.props.user) {
        console.log('RaceEditor::editRace: not logged in, cannot get!')
        return false
      }
      let config = {
        headers: { 'Authorization': 'Bearer ' + this.props.user.token }
      }
      let response = await axios.get(
        this.props.urlprefix + '/car', config)
      // we got an array of car objects in response.data
      allCars = response.data.reduce((acc, cur, i) => {
        acc[Object.keys(cur)[0]] = Object.values(cur)[0]
        return acc
      })
    } catch (err) {
      console.log('RaceEditor::editRace: Error getting car list: ', err)
      return false
    }
    // allCars is a dictionary with the rfid as key
    this.setState({ 'allCars': allCars, ...race })
  }

  async saveRace (race) {
    try {
      if (!this.props.user) {
        console.log('RaceEditor::saveRace: not logged in, cannot save!')
        throw (new Error('Not Logged In'))
      }
      console.log('RaceEditor::saveRace: saving a race: ' + race)
      let config = {
        headers: { 'Authorization': 'Bearer ' + this.props.user.token }
      }
      // delete temporary additions
      let raceToSave = { ...race }
      delete raceToSave.allCars
      delete raceToSave.newrace
      let response
      if (this.state.newrace) {
        response = await axios.post(
          this.props.urlprefix + '/race/' + race.id, raceToSave, config)
      } else {
        // TODO: Change this back to put and add update function
        response = await axios.post(
          this.props.urlprefix + '/race/' + race.id, raceToSave, config)
      }
      console.log('RaceEditor::saveRace: stored race:', response)
      this.setState(race)
      return true
    } catch (err) {
      console.log('RaceEditor::saveRace: error storing application settings: ', err)
      return false
    }
  }

  onSubmit = async (values, actions) => {
    try {
      if (await this.saveRace(values)) {
        this.showToast('Successfully saved the race',
          Intent.SUCCESS, 'tick-circle', 2000)
      } else {
        this.showToast('Failed to save the race',
          Intent.DANGER, 'warning-sign', 5000)
      }
      actions.setSubmitting(false)
    } catch (err) {
      this.showToast('Failed to submit the race',
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
    const functions = {
      addClickHandler: this.addClickHandler,
      removeClickHandler: this.removeClickHandler
    }

    return (
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        onSubmit={this.onSubmit}
        component={
          (formikProps) => <RaceForm
            {...formikProps}
            {...this.props}
            {...functions}
          />
        }
      />
    )
  }
}

export default RaceEditor
