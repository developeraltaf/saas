import React from 'react'
//import { DropdownMenu, DropdownItem, } from 'reactstrap';
// used for making the prop types of this component
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { App } from 'components'
import NotificationAlert from 'react-notification-alert'

//var BASEDIR = process.env.REACT_APP_BASEDIR;

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Portfolioslist extends React.Component {
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
    let action = e.currentTarget.dataset.id
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
        this.props.history.push('delete-portfolio?id=' + this.state.deleteid)
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
    //console.log( this.props.portfolios);
    var portfoliosList = []
    if (this.props.portfolios.length === 0) {
      portfoliosList.push(
        <div className="col-xs-12 padding-15" key="nodata">
          No Data Found
        </div>,
      )
    }
    for (var i = 0; i < this.props.portfolios.length; i++) {
      portfoliosList.push(
        <div
          className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-data"
          key={this.props.portfolios[i].id}
        >
          <div className="user card">
            <NavLink
              className=""
              to={'add-portfolio?id=' + this.props.portfolios[i].id}
            >
              <div
                className="user-img"
                style={{
                  backgroundImage:
                    'url(' +
                    REACT_APP_RESTAPI +
                    '' +
                    this.props.portfolios[i].image.name +
                    ')',
                }}
              ></div>
            </NavLink>

            <div className="user-info">
              <NavLink
                className=""
                to={'add-portfolio?id=' + this.props.portfolios[i].id}
              >
                <h4>{this.props.portfolios[i].name}</h4>
              </NavLink>
              <p>Location: {this.props.portfolios[i].location}</p>
              <NavLink
                className="editlink btn btn-xs"
                to={'add-portfolio?id=' + this.props.portfolios[i].id}
              >
                Edit
              </NavLink>
              <NavLink
                className="managelink btn btn-xs"
                to={'manage-portfolio?id=' + this.props.portfolios[i].id}
              >
                Manage
              </NavLink>
              <span
                className="text-danger textlink dellink btn btn-xs"
                value={this.props.portfolios[i].id}
                data-title={this.props.portfolios[i].name}
                data-id={this.props.portfolios[i].id}
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
        {portfoliosList}
        <div>
          <div className="notification-popup">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggle}>Confirm Delete</ModalHeader>
            <ModalBody>
              Are you sure you want to delete Portfolio:{' '}
              {this.state.deletetitle} ?
            </ModalBody>
            <ModalFooter>
              <Button
                className="btn-sm btn"
                color="danger"
                data-id="submit"
                onClick={this.toggle}
              >
                Delete
              </Button>
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

Portfolioslist.propTypes = {
  portfolios: PropTypes.arrayOf(PropTypes.object),
}

export default Portfolioslist
