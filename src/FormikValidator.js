import { Component } from 'react'

class FormikValidator extends Component {
  constructor (props) {
    super(props)
    this.firstValue = props.values
  }

  componentDidMount () {
    console.log('FormikValidator::mount calling validateForm()')
    this.props.validateForm()
  }

  componentDidUpdate () {
    console.log('FormikValidator::update:',
      JSON.stringify(this.firstValue, null, 2),
      JSON.stringify(this.props.initialValues, null, 2)
    )
    if (this.firstValue !== this.props.initialValues) {
      // the form has been re-initialized with new values
      this.props.setFieldTouched('rootpwd', true, true)
      this.firstValue = this.props.initialValues
    }
  }

  render () {
    return null
  }
}

export default FormikValidator
