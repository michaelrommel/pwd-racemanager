import { Component } from 'react'

class FormikValidator extends Component {
  constructor (props) {
    super(props)
    this.firstValue = props.values
  }

  componentDidMount () {
    this.props.validateForm()
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.initialValues !== this.props.initialValues) {
      console.log('FormikValidator: initialValues changed')
      // the form has been re-initialized with new values,
      // trigger the validation of the field gotten in props
      this.props.setFieldTouched(this.props.fieldName, true, true)
    }
  }

  render () {
    return null
  }
}

export default FormikValidator
