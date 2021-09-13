import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col } from 'reactstrap'
import { NavLink } from 'react-router-dom'

import {} from 'components'
import axios from 'axios'
// import Parser from "html-react-parser";
import NotificationAlert from 'react-notification-alert'

var MINPASSWORDLENGTH = 6

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Register extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      username: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      error_msg: '',
      agree: false,
      response: '',
    }

    this.notify = this.notify.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.submitForm = this.submitForm.bind(this)

    /*-------- If User is logged in, then redirect to Dashboard*/
    //console.log("Check authentic user or not: ");
    //console.log(ACL.isUserACLenticated());
    //console.log(ACL.getUser());
    var authentic = ACL.isUserACLenticated()
    if (authentic) {
      this.props.history.push('zak/dashboard')
    }
  }

  handleFormSubmit(event) {
    event.preventDefault()
    var checkmode = App.check_app_mode(event)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      this._isMounted && this.setState({ response: '' })
      //console.log(this.state);
      //console.log(this.state.image);
      var allow_submit = false

      if (
        this.state.name === '' ||
        this.state.email === '' ||
        this.state.phone === '' ||
        this.state.username === '' ||
        this.state.password === '' ||
        this.state.confirm_password === ''
      ) {
        allow_submit = false
        this._isMounted &&
          this.setState({
            error_msg: 'Please enter all the fields correctly',
          })
      } else if (this.state.password !== this.state.confirm_password) {
        allow_submit = false
        this._isMounted &&
          this.setState({
            error_msg: 'Password and Confirm Password must be same.',
          })
      } else if (this.state.password.length < MINPASSWORDLENGTH) {
        allow_submit = false
        this._isMounted &&
          this.setState({
            error_msg:
              'Password must have ' +
              MINPASSWORDLENGTH +
              ' characters or more.',
          })
      } else if (this.state.agree !== true) {
        allow_submit = false
        this._isMounted &&
          this.setState({ error_msg: 'Please check terms & conditions' })
      }
      // Check for uniqueness and availability
      else {
        // Check for uniqueness of username, email and phone
        const url = REACT_APP_RESTAPI + 'modules/user/user.php'
        let user = ACL.getUser()
        let formData = new FormData()
        formData.append('auth_user', user.id)
        formData.append('auth_type', user.usertype)
        formData.append('auth_token', user.token)
        formData.append('action', 'check_available')
        formData.append('username', this.state.username)
        formData.append('email', this.state.email)
        formData.append('phone', this.state.phone)
        axios({
          method: 'post',
          url: url,
          data: formData,
          config: { headers: { 'Content-Type': 'multipart/form-data' } },
        })
          .then((response) => {
            //handle success
            // console.log(response.data)
            if (response.data.success === false) {
              allow_submit = false
              this._isMounted && this.setState({ error_msg: response.data.msg })
              //console.log("error");
            } else {
              allow_submit = true
              this._isMounted && this.setState({ error_msg: '' })
              //console.log("submit");
              this.submitForm()
            }
          })
          .catch(function (response) {
            //handle error
            //console.log(response)
          })
      }

      if (allow_submit) {
      }
    } // end check mode
  }

  submitForm() {
    const url = REACT_APP_RESTAPI + 'modules/user/user.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'save')
    formData.append('name', this.state.name)
    formData.append('username', this.state.username)
    formData.append('password', this.state.password)
    formData.append('email', this.state.email)
    formData.append('phone', this.state.phone)
    formData.append('usertype', 'user')
    formData.append('active', '0')
    axios({
      method: 'post',
      url: url,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        //handle success
        // console.log(response.data)
        this._isMounted && this.setState({ response: response.data })
        if (response.data.success !== false) {
          this.notify('tr', response.data.msg)
          setTimeout(() => {
            //console.log("push to login");
            this.props.history.push('login')
          }, 2000)
        }
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
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
    return (
      <div>
        <div className="">
          <Row>
            <Col xs={12} md={12}>
              <div className="notification-popup">
                <NotificationAlert ref="notificationAlert" />
              </div>

              <div className="container-fluid">
                <div className="register-wrapper row">
                  <div
                    id="register"
                    className="login loginpage offset-xl-4 offset-lg-3 offset-md-3 offset-0 col-12 col-md-6 col-xl-4"
                  >
                    <h1>
                      <a href="#!" title="Login Page" tabIndex="-1">
                        &nbsp;
                      </a>
                    </h1>

                    <form
                      name="loginform"
                      id="loginform"
                      action="#!"
                      method="post"
                    >
                      <p className="user-access-msg">{this.state.error_msg}</p>

                      <p>
                        <label htmlFor="user_login">
                          Full Name
                          <br />
                          <input
                            type="text"
                            className="form-control"
                            id="user_login"
                            name="name"
                            value={this.state.name}
                            onChange={(e) =>
                              this.setState({
                                name: e.target.value,
                              })
                            }
                            placeholder=""
                          />
                        </label>
                      </p>
                      <p>
                        <label htmlFor="user_login2">
                          Email
                          <br />
                          <input
                            type="text"
                            className="form-control"
                            id="user_login2"
                            name="email"
                            value={this.state.email}
                            onChange={(e) =>
                              this.setState({
                                email: e.target.value,
                              })
                            }
                            placeholder=""
                          />
                        </label>
                      </p>
                      <p>
                        <label htmlFor="user_login23">
                          Phone
                          <br />
                          <input
                            type="text"
                            className="form-control"
                            id="user_login23"
                            name="phone"
                            value={this.state.phone}
                            onChange={(e) =>
                              this.setState({
                                phone: e.target.value,
                              })
                            }
                            placeholder=""
                          />
                        </label>
                      </p>
                      <p>
                        <label htmlFor="user_login3">
                          Username
                          <br />
                          <input
                            type="text"
                            className="form-control"
                            id="user_login3"
                            name="username"
                            value={this.state.username}
                            onChange={(e) =>
                              this.setState({
                                username: e.target.value,
                              })
                            }
                            placeholder=""
                          />
                        </label>
                      </p>
                      <p>
                        <label htmlFor="user_pass">
                          Password
                          <br />
                          <input
                            type="password"
                            className="form-control"
                            id="user_pass"
                            name="password"
                            value={this.state.password}
                            onChange={(e) =>
                              this.setState({
                                password: e.target.value,
                              })
                            }
                            placeholder=""
                          />
                        </label>
                      </p>
                      <p>
                        <label htmlFor="user_pass2">
                          Confirm Password
                          <br />
                          <input
                            type="password"
                            className="form-control"
                            id="user_pass2"
                            name="confirm_password"
                            value={this.state.confirm_password}
                            onChange={(e) =>
                              this.setState({
                                confirm_password: e.target.value,
                              })
                            }
                            placeholder=""
                          />
                        </label>
                      </p>

                      <p className="agree">
                        <label className="form-label" htmlFor="agree">
                          <input
                            name="agree"
                            type="checkbox"
                            id="agree"
                            checked={this.state.agree}
                            onChange={(e) =>
                              this.setState({
                                agree: e.target.checked,
                              })
                            }
                          />{' '}
                          I agree to terms to conditions
                        </label>
                      </p>

                      <p className="submit">
                        <button
                          type="submit"
                          onClick={(e) => this.handleFormSubmit(e)}
                          className="btn btn-primary btn-block"
                        >
                          Register
                        </button>
                      </p>

                      <p className="user-access-msg">{this.state.error_msg}</p>
                    </form>

                    <p id="nav">
                      <NavLink to={'forgotpassword'}>Forgot password?</NavLink>{' '}
                      | <NavLink to={'login'}>Login</NavLink>
                    </p>
                    <div className="clearfix"></div>
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

export default Register
