import React from 'react'
import { connect } from 'react-redux'
import { actions as requestActions } from '../redux/modules/requests'
import RequestForm from '../forms/RequestForm'

class AddRequestContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }
  static propTypes = {
    params: React.PropTypes.object,
    addRequest: React.PropTypes.func.isRequired,
    initialValues: React.PropTypes.object
  }
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  onFormSubmit(values) {
    this.props.addRequest(values)
    this.context.router.push('/')
  }

  render() {
    const { initialValues } = this.props
    return (
      <div>
        <h3>
          Add New Request
        </h3>
        <RequestForm
          form='AddForm'
          handleRequestSubmit={this.onFormSubmit}
          initialValues={initialValues}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: {status: 'Pending'}
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addRequest: (formValues) => {
      dispatch(requestActions.addRequest(formValues))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRequestContainer)
