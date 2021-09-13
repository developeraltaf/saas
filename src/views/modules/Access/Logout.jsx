import React from 'react'
import { ACL } from 'components'

import { Row, Col } from 'reactstrap'

import { NavLink } from 'react-router-dom'

import {} from 'components'
// import axios from "axios";
import NotificationAlert from 'react-notification-alert'

import Parser from 'html-react-parser'

//var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI;
class Logout extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      message: '',
    }

    this.notify = this.notify.bind(this)
  }
  //Thank You for using our app.<br/>You have been logged out successfully.

  async componentDidMount() {
    this._isMounted = true

    var message = ''

    var getuser = ACL.getUser()
    if (getuser['name'] !== '' && getuser['name'] !== null) {
      message +=
        'Thank You &apos;' + getuser['name'] + '&apos; for using our app.'
    } else {
      message += 'Thank You for using our app.'
    }

    message +=
      'You have been logged out successfully. Redirecting you back to login page'

    message = Parser(message)

    this._isMounted &&
      this.setState({ message: message }, () => {
        ACL.deauthenticateUser()
        this.notify('tr', 'Redirecting back to login page')
        setTimeout(() => {
          this.props.history.push('login')
        }, 4000)
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

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    return (
      <div>
        <div className="">
          <Row>
            <Col xs={12} md={12}>
              <div className="notification-popup">
                <NotificationAlert ref="notificationAlert" />
              </div>

              <div className="container-fluid">
                <div className="login-wrapper row">
                  <div
                    id="login"
                    className="login loginpage offset-xl-3 offset-lg-3 offset-md-2 offset-0 col-12 col-md-8 col-xl-6"
                  >
                    <h1>
                      <a href="#!" title="Logout Page" tabIndex="-1">
                        &nbsp;
                      </a>
                    </h1>
                    <br />
                    <h4 className="text-white text-center">
                      {this.state.message}
                    </h4>
                    <br />
                    <br />
                    <br />
                    <p id="nav">
                      <NavLink to={'login'}>Login</NavLink> &nbsp;|&nbsp;&nbsp;
                      <NavLink to={'forgotpassword'}>Forgot password?</NavLink>
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default Logout
