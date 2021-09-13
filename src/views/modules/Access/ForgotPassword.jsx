import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col } from 'reactstrap'

import { NavLink } from 'react-router-dom'

import {} from 'components'
import axios from 'axios'
import NotificationAlert from 'react-notification-alert'

var MINPASSWORDLENGTH = 6
var REACT_APP_URL = process.env.REACT_APP_URL
var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      phone: '',
      email: '',
      username: '',
      code: '',
      password: '',
      confirm_password: '',
      error_msg: '',
      response: '',
      code_sent: false,
    }

    this.handleFormSubmit = this.handleFormSubmit.bind(this)

    /*-------- If User is logged in, then redirect to Dashboard*/
    //console.log("Check authentic user or not: ");
    //console.log(ACL.isUserACLenticated());
    //console.log(ACL.getUser());
    var authentic = ACL.isUserACLenticated()
    if (authentic) {
      this.props.history.push('zak/dashboard')
    }
  }

  async componentDidMount() {
    this._isMounted = true

    const search = window.location.search
    const params = new URLSearchParams(search)
    if (params.get('type') === 'code_sent') {
      this._isMounted && this.setState({ code_sent: true })
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

      var action = event.currentTarget.dataset.id
      // console.log(action)

      var allow_submit = false

      if (
        action === 'sendcode' &&
        (this.state.username === '' ||
          this.state.email === '' ||
          this.state.phone === '')
      ) {
        allow_submit = false
        this._isMounted &&
          this.setState({
            error_msg: 'Please enter all the fields correctly',
          })
      } else if (action === 'setpassword') {
        if (
          this.state.username === '' ||
          this.state.email === '' ||
          this.state.phone === '' ||
          this.state.code === '' ||
          this.state.password === '' ||
          this.state.confirm_password === ''
        ) {
          // console.log('empty')
          allow_submit = false
          this._isMounted &&
            this.setState({
              error_msg: 'Please enter all the fields correctly',
            })
        } else if (this.state.password !== this.state.confirm_password) {
          // console.log('same error')
          allow_submit = false
          this._isMounted &&
            this.setState({
              error_msg: 'Password and Confirm Password must be same.',
            })
        } else if (this.state.password.length < MINPASSWORDLENGTH) {
          // console.log('length error')
          allow_submit = false
          this._isMounted &&
            this.setState({
              error_msg:
                'Password must have ' +
                MINPASSWORDLENGTH +
                ' characters or more.',
            })
        } else {
          allow_submit = true
        }
      } else {
        allow_submit = true
      }

      if (allow_submit) {
        const url = REACT_APP_RESTAPI + 'modules/user/user.php'
        let user = ACL.getUser()
        let formData = new FormData()
        formData.append('auth_user', user.id)
        formData.append('auth_type', user.usertype)
        formData.append('auth_token', user.token)
        formData.append('action', 'forgotpassword')
        formData.append('username', this.state.username)
        formData.append('email', this.state.email)
        formData.append('phone', this.state.phone)
        formData.append('code', this.state.code)
        formData.append('password', this.state.password)
        formData.append('confirm_password', this.state.confirm_password)
        formData.append('code_sent', this.state.code_sent)
        formData.append(
          'set_password_url',
          REACT_APP_URL + '/forgotpassword?type=code_sent',
        )

        this._isMounted && this.setState({ error_msg: 'Loading...' })

        axios({
          method: 'post',
          url: url,
          data: formData,
          config: { headers: { 'Content-Type': 'multipart/form-data' } },
        })
          .then((response) => {
            //handle success
            //this._isMounted && this.setState({ response: response.data });
            //console.log("------------");
            // console.log(response.data)
            if (action === 'setpassword') {
              this._isMounted && this.setState({ error_msg: response.data.msg })

              if (response.data.success === true) {
                // notify and redirect
                this.notify('tr', response.data.msg)
                setTimeout(() => {
                  this.props.history.push('login')
                }, 2000)
              }
            }
            // Check for entered account details and code sent response
            else if (action === 'sendcode') {
              this._isMounted && this.setState({ error_msg: response.data.msg })
              this.notify('tr', response.data.msg)

              if (response.data.success === true) {
                this._isMounted &&
                  this.setState({
                    code_sent: response.data.code_sent,
                  })
                /*this._isMounted && this.setState({ code_sent: response.data.code_sent }, () => {
                               // console.log(this.state.code_sent);
                               // console.log(this.state.error_msg);
                            });*/
              }
            }
          })
          .catch(function (response) {
            //handle error
            //console.log(response)
          })
      }
    } // end check mode
  }

  notify(place, msg, redirect = true) {
    var type = 'primary'
    var options = {}
    options = {
      place: place,
      message: (
        <div className="notification-msg">
          <div>{msg}</div>
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
                    className="login loginpage offset-xl-4 offset-lg-3 offset-md-3 offset-0 col-12 col-md-6 col-xl-4"
                  >
                    <h1>
                      <a href="#!" title="ForgotPassword Page" tabIndex="-1">
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

                      {this.state.code_sent !== true ? (
                        <div>
                          <p className="submit">
                            <button
                              type="submit"
                              onClick={(e) => this.handleFormSubmit(e)}
                              data-id={'sendcode'}
                              className="btn btn-primary btn-block"
                            >
                              Send Verification Code
                            </button>
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p>
                            <label htmlFor="user_pass11">
                              Verification Code
                              <br />
                              <input
                                type="text"
                                className="form-control"
                                id="user_pass11"
                                name="code"
                                value={this.state.code}
                                onChange={(e) =>
                                  this.setState({
                                    code: e.target.value,
                                  })
                                }
                                placeholder=""
                              />
                            </label>
                          </p>
                          <p>
                            <label htmlFor="user_pass">
                              New Password
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
                              Confirm New Password
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
                          <p className="submit">
                            <button
                              type="submit"
                              onClick={(e) => this.handleFormSubmit(e)}
                              data-id={'setpassword'}
                              className="btn btn-primary btn-block"
                            >
                              Set Password
                            </button>
                          </p>
                        </div>
                      )}

                      <p className="user-access-msg">{this.state.error_msg}</p>
                    </form>

                    <p id="nav">
                      <NavLink to={'login'}>Login</NavLink> &nbsp;|&nbsp;&nbsp;
                      <NavLink to={'register'}>Register</NavLink>
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

export default ForgotPassword
