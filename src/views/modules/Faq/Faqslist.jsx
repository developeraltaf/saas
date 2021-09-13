import React from 'react'
import { App } from 'components'

//import { DropdownMenu, DropdownItem, } from 'reactstrap';
// used for making the prop types of this component
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import NotificationAlert from 'react-notification-alert'

//var BASEDIR = process.env.REACT_APP_BASEDIR;

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Faqslist extends React.Component {
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
        this.props.history.push('delete-faq?id=' + this.state.deleteid)
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
    //console.log( this.props.faqs);
    var faqsList = []
    if (this.props.faqs.length === 0) {
      faqsList.push(
        <div className="col-xs-12 padding-15" key="nodata">
          No Data Found
        </div>,
      )
    }

    for (var i = 0; i < this.props.faqs.length; i++) {
      faqsList.push(
        <div
          className="col-xs-12 col-sm-12 col-md-12 col-lg-10 col-xl-10"
          key={this.props.faqs[i].id}
        >
          <div className="faq">
            <div className="faq-img">
              <img
                className="img-fluid"
                src={REACT_APP_RESTAPI + '' + this.props.faqs[i].image}
                alt=""
              />
            </div>
            <div className="faq-info">
              <NavLink to={'add-faq?id=' + this.props.faqs[i].id}>
                <h3>{this.props.faqs[i].question}</h3>
              </NavLink>
              <p>{this.props.faqs[i].answer}</p>
              <NavLink
                className="editlink btn btn-xs"
                to={'add-faq?id=' + this.props.faqs[i].id}
              >
                Edit
              </NavLink>{' '}
              <span
                className="text-danger textlink btn btn-xs"
                value={this.props.faqs[i].id}
                data-id={this.props.faqs[i].id}
                data-title={this.props.faqs[i].question}
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
        {faqsList}
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
              Are you sure you want to delete faq: {this.state.deletetitle} ?
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                className="btn btn-sm"
                data-id="submit"
                onClick={this.toggle}
              >
                Delete
              </Button>{' '}
              <Button
                color="secondary"
                className="btn btn-sm"
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

Faqslist.propTypes = {
  faqs: PropTypes.arrayOf(PropTypes.object),
}

export default Faqslist
