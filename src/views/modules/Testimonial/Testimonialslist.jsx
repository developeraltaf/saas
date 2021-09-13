import React from 'react'
import { App } from 'components'

//import { DropdownMenu, DropdownItem, } from 'reactstrap';
// used for making the prop types of this component
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import NotificationAlert from 'react-notification-alert'

//var BASEDIR = process.env.REACT_APP_BASEDIR;

//var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Testimonialslist extends React.Component {
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
        this.props.history.push('delete-testimonial?id=' + this.state.deleteid)
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
    //console.log( this.props.testimonials);
    var testimonialsList = []
    if (this.props.testimonials.length === 0) {
      testimonialsList.push(
        <div className="col-xs-12 padding-15" key="nodata">
          No Data Found
        </div>,
      )
    }
    for (var i = 0; i < this.props.testimonials.length; i++) {
      let filename = App.get_display_filename(
        this.props.testimonials[i].image,
        'thumb',
      )

      testimonialsList.push(
        <div
          className="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6"
          key={this.props.testimonials[i].id}
        >
          <div className="testimonial">
            <div className="testimonial-msg">
              <h4>&quot;{this.props.testimonials[i].message}&quot;</h4>
            </div>
            <div className="testimonial-user">
              <div className="testimonial-img">
                <img
                  className="img-fluid"
                  src={App.filename_url(filename)}
                  alt=""
                />
              </div>
              <div className="testimonial-info">
                <h5 className="name">{this.props.testimonials[i].name}</h5>
                <p className="position">
                  {this.props.testimonials[i].position}
                </p>
              </div>

              <div className="testi-actions">
                <NavLink
                  className="editlink btn btn-xs"
                  to={'add-testimonial?id=' + this.props.testimonials[i].id}
                >
                  Edit
                </NavLink>
                <span
                  className="text-danger textlink btn btn-xs"
                  value={this.props.testimonials[i].id}
                  data-id={this.props.testimonials[i].id}
                  data-title={this.props.testimonials[i].name}
                  onClick={(e) => this.toggle(e)}
                >
                  Delete
                </span>
              </div>
            </div>
          </div>
        </div>,
      )
    }
    return (
      <div className="row">
        {testimonialsList}
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
              Are you sure you want to delete testimonial by:{' '}
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

Testimonialslist.propTypes = {
  testimonials: PropTypes.arrayOf(PropTypes.object),
}

export default Testimonialslist
