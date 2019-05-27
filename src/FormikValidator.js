import { Component } from 'react'

class FormikValidator extends Component {
  constructor (props) {
    super(props)
    this.firstValue = props.values
  }

  componentDidMount () {
    this.props.validateForm()
  }

  componentDidUpdate () {
    if (this.firstValue !== this.props.initialValues) {
      // the form has been re-initialized with new values
      this.props.setFieldTouched(this.props.fieldName, true, true)
      this.firstValue = this.props.initialValues
    }
  }

  render () {
    return null
  }
}

export default FormikValidator
