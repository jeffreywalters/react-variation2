import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { Link } from 'react-router'
import moment from 'moment'

class RequestForm extends React.Component {
  static propTypes = {
    handleSubmit: React.PropTypes.func.isRequired,
    pristine: React.PropTypes.bool,
    reset: React.PropTypes.func,
    submitting: React.PropTypes.bool,
    handleRequestSubmit: React.PropTypes.func.isRequired
  }

  render() {
    const { handleSubmit, pristine, reset, submitting, handleRequestSubmit } = this.props

    return (
      <form
        onSubmit={handleSubmit(handleRequestSubmit)}
        className="form-horizontal"
      >
        <Field
          name='id'
          id='id'
          label='ID'
          className='form-control'
          type='text'
          disabled
          component={renderField}
        />
        <Field
          name='title'
          id='title'
          label='Title'
          type='text'
          className='form-control'
          component={renderField}
        />
        <Field
          name='updatedAt'
          id='updatedAt'
          label='Updated At'
          className='form-control'
          type='text'
          disabled
          format={(value, name) => moment(+value).format('YYYY-MM-DD')}
          component={renderField}
        />
        <Field
          name='createdAt'
          id='createdAt'
          label='Created At'
          className='form-control'
          type='text'
          disabled
          format={(value, name) => moment(+value).format('YYYY-MM-DD')}
          component={renderField}
        />
        <Field
          name='status'
          id='status'
          label='Status'
          component={renderField}
          className='form-control'
          type='select'
        >
          <option value="APPROVED">Approved</option>
          <option value="DENIED">Denied</option>
          <option value="PENDING">Pending</option>
        </Field>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button
              type='submit'
              className='btn btn-primary'
              disabled={pristine || submitting}
            >
              <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
              {' '}
              Save
            </button>
            {' '}
            <button
              type="button"
              className='btn btn-warn'
              disabled={pristine || submitting}
              onClick={reset}
            >
              <span className="glyphicon glyphicon-repeat" aria-hidden="true"></span>
              {' '}
              Reset Values
            </button>
            {' '}
            <Link to='/' className='btn btn-warning'>
              <span className="glyphicon glyphicon-backward" aria-hidden="true"></span>
              {' '}
              Cancel
            </Link>
          </div>
        </div>
      </form>
    )
  }
}

const renderField = ({ input, label, type, children, meta: { touched, error, warning }, ...inputProps }) => (
  <div className={`form-group ${touched && error ? 'has-error has-feedback' : ''}`}>
    <label htmlFor="title" className="col-sm-2 control-label">{label}</label>
    <div className="col-sm-10">
      {type === 'select'
        ? <select {...inputProps} {...input}>{children}</select>
        : <input type={type} {...inputProps} {...input} />
      }
      {touched && (error && [
        <span key={0} className="glyphicon glyphicon-remove form-control-feedback"></span>,
        <div key={1} className='text-danger bg-warning' style={{ padding: 2, marginBottom: 0 }}>
          &nbsp;
          <span className="glyphicon glyphicon-warning-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>
      ])}
    </div>
  </div>
)
renderField.propTypes = {
  input: React.PropTypes.object,
  label: React.PropTypes.string,
  type: React.PropTypes.string,
  children: React.PropTypes.node,
  meta: React.PropTypes.object
}

const validate = (values) => {
  const errors = {}
  if (!values.title) {
    errors.title = 'Enter a Title'
  }
  return errors
}

const RequestFormWithReduxform = reduxForm({
  validate
})(RequestForm)

export default RequestFormWithReduxform
