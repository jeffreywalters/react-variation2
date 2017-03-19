import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import { Link } from 'react-router'
import { OverlayTrigger, Popover, Modal, Button } from 'react-bootstrap'

class RequestTable extends React.Component {
  constructor(props) {
    super(props)
    this.trigger = []
  }
  static propTypes = {
    requests: React.PropTypes.object.isRequired,
    deleteRequest: React.PropTypes.func,
    addRequest: React.PropTypes.func,
    setStatus: React.PropTypes.func,
    filter: React.PropTypes.string
  }

  // use for date sort
  _compareDates(a, b) {
    if (a.get('updatedAt') > b.get('updatedAt')) return -1
    if (a.get('updatedAt') < b.get('updatedAt')) return 1
    return 0
  }

  render(){
    // sort by dates
    const requestsSorted = this.props.requests.sort(this._compareDates)

    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          Requests &nbsp;<span style={{color: '#CCC'}}>({this.props.filter.capitalize()})</span>
          <div style={{ float: 'right' }}>
            <Link to='add' className='btn btn-info btn-xs'>
              <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
              {' '}Add Request
            </Link>
          </div>
        </div>

        <table className='table table-condensed table-hover'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requestsSorted.map( (request) => (
              <tr
                key={request.get('id')}
                data-requestkey={request.get('id')}
                className={this._getRowColor(request.get('status'))}
              >
                <td>{request.get('title')}</td>
                <td>
                  <OverlayTrigger
                    ref={trigger => { this.trigger[request.get('id')] = trigger }}
                    trigger='click'
                    rootClose
                    placement='right'
                    overlay={this._getPopover(request.get('id'), request.get('status'))
                  }>
                    <a role="button" tabIndex="0">{request.get('status').capitalize()}</a>
                  </OverlayTrigger>
                </td>
                <td>{this._formatDate(request.get('updatedAt'))}</td>
                <td>{this._formatDate(request.get('createdAt'))}</td>
                <td>
                  <Link
                    to={`/edit/${request.get('id')}`}
                    className='btn btn-xs btn-primary'
                  >
                    Edit
                  </Link>
                  {' '}
                  <DeleteModal
                    onDelete={() => this._handleDeleteClick(request.get('id'))}
                    requestTitle={request.get('title')}
                  />
                </td>
              </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    )
  }

  _getRowColor(status){
    if (status === 'APPROVED'){ return 'success' }
    if (status === 'DENIED'){ return 'danger' }
    return ''
  }

  _formatDate(str) {
    return moment(+str).format('YYYY-MM-DD')
  }

  _getPopover(requestid, status){
    let statuses = [
      'APPROVED',
      'PENDING',
      'DENIED'
    ]
    const me = this
    statuses = statuses.filter( stat => stat !== status )
    return (
      <Popover id={`popover${requestid}`}>
        {statuses.map((status, i) => (
          <div key={i}>
            <a
              onClick={(e) => { this._handleStatusClick(requestid, status); me.trigger[requestid].hide() }}
            >
              {status.capitalize()}
            </a>
          </div>
        )
        )}
      </Popover>
    )
  }

  _handleStatusClick = (requestid, newstatus) => {
    this.props.setStatus(requestid, newstatus)
  }

  _handleDeleteClick = (id) => {
    this.props.deleteRequest(id)
  }
}


class DeleteModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showModal: false }
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
  }

  static propTypes = {
    onDelete: React.PropTypes.func,
    requestTitle: React.PropTypes.string
  }

  close() {
    this.setState({ showModal: false })
  }

  open() {
    this.setState({ showModal: true })
  }

  render() {
    return (
      <span>
        <Button
          bsStyle="danger"
          bsSize="xsmall"
          onClick={this.open}
        >
          Delete
        </Button>

        <Modal
          show={this.state.showModal}
          onHide={this.close}
          bsSize="small"
          onEnter={() => ReactDOM.findDOMNode(this.confirm).focus()}
        >
          <Modal.Header className="bg-primary" closeButton>
            <Modal.Title>Confirm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Delete Request "<b>{this.props.requestTitle}</b>"?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={this.close}
              bsSize="small"
            >Cancel</Button>
            <Button
              bsStyle="primary"
              bsSize="small"
              onClick={() => { this.props.onDelete(); this.close() }}
              ref={(button) => { this.confirm = button }}
            >Confirm</Button>
          </Modal.Footer>
        </Modal>
      </span>
    )
  }
}

export default RequestTable
