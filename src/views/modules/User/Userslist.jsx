import React from 'react'
//import { DropdownMenu, DropdownItem, } from 'reactstrap';
// used for making the prop types of this component
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { App } from 'components'
import NotificationAlert from 'react-notification-alert'

//var BASEDIR = process.env.REACT_APP_BASEDIR;
//var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Userslist extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      modal: false,
      deleteid: '',
      deletetitle: '',
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle(e) {
    var action = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    //console.log(e.currentTarget.dataset.id);
    if (action !== 'submit') {
      this._isMounted &&
        this.setState({
          deleteid: action,
          deletetitle: title,
        })
    }
    if (action === 'submit') {
      var checkmode = App.check_app_mode(e)
      if (!checkmode['allow']) {
        this.notify('tr', checkmode['msg'], false)
      } else {
        this.props.history.push('delete-user?id=' + this.state.deleteid)
      }
    }
    this._isMounted &&
      this.setState({
        modal: !this.state.modal,
      })
  }

  notify(place, msg, redirect = true) {
    var type = 'primary'
    var options = {}
    options = {
      place: place,
      message: (
        <div className="notification-msg">
          <div>{msg}</div>
          {redirect ? <div>Redirecting...</div> : ''}
        </div>
      ),
      type: type,
      icon: '',
      autoDismiss: 5,
    }
    this.refs.notificationAlert.notificationAlert(options)
  }
  async componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    //console.log( this.props.users);
    var usersList = []
    if (this.props.users.length === 0) {
      usersList.push(
        <div className="col-xs-12 padding-15" key="nodata">
          No Data Found
        </div>,
      )
    }

    for (var i = 0; i < this.props.users.length; i++) {
      usersList.push(
        <div
          className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-data"
          key={this.props.users[i].id}
        >
          <div className="user card">
            <NavLink className="" to={'add-user?id=' + this.props.users[i].id}>
              <div
                className="user-img"
                style={{
                  backgroundImage:
                    'url(' +
                    App.filename_url(this.props.users[i].image.name) +
                    ')',
                }}
              ></div>
            </NavLink>
            <div className="user-info">
              <NavLink
                className=""
                to={'add-user?id=' + this.props.users[i].id}
              >
                <h4>{this.props.users[i].name}</h4>
              </NavLink>
              <p>
                Email: {this.props.users[i].email} <br /> Phone:{' '}
                {this.props.users[i].phone}
              </p>
              <NavLink
                className="editlink btn btn-xs"
                to={'add-user?id=' + this.props.users[i].id}
              >
                Edit
              </NavLink>
              <span
                className="text-danger textlink dellink btn btn-xs"
                value={this.props.users[i].id}
                data-id={this.props.users[i].id}
                data-title={this.props.users[i].name}
                onClick={(e) => this.toggle(e)}
              >
                Delete
              </span>
            </div>
          </div>
        </div>,
      )
    }
    return (
      <div className="row">
        {usersList}
        <div>
          <div className="notification-popup">
            <NotificationAlert ref="notificationAlert" />
          </div>

          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggle}>Delete User</ModalHeader>
            <ModalBody>
              Are you sure you want to delete user: {this.state.deletetitle} ?
            </ModalBody>
            <ModalFooter>
              <Button
                className="btn-sm btn"
                color="danger"
                data-id="submit"
                onClick={this.toggle}
              >
                Delete
              </Button>{' '}
              <Button
                className="btn-sm btn"
                color="secondary"
                data-id="cancel"
                onClick={this.toggle}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    )
  }
}

Userslist.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
}

export default Userslist
