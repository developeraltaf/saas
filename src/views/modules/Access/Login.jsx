import React from 'react'
import { ACL } from 'components'

import { Row, Col } from 'reactstrap'

import { NavLink } from 'react-router-dom'

import axios from 'axios'
import NotificationAlert from 'react-notification-alert'

var REACT_APP_MODE = process.env.REACT_APP_MODE
var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Login extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      username: '',
      password: '',
      error_msg: '',
      response: '',
    }
    //console.log(REACT_APP_RESTAPI);

    this.handleFormSubmit = this.handleFormSubmit.bind(this)

    /*-------- If User if logged in, then redirect to Dashboard*/
    //console.log("Check authentic user or not: ");
    //console.log(ACL.isUserACLenticated());
    //console.log(ACL.getUser());
    var authentic = ACL.isUserACLenticated()
    if (authentic) {
      this.props.history.push('zak/dashboard')
    }

    //var user = ACL.getUser()
  }

  handleFormSubmit(event) {
    event.preventDefault()
    this._isMounted && this.setState({ response: '' })
    //console.log(this.state);
    //console.log(this.state.image);
    //var allow_submit = false
    //var user = ACL.getUser()
    // console.log(user)

    if (this.state.username === '' || this.state.password === '') {
      //allow_submit = false
      this._isMounted &&
        this.setState({
          error_msg: 'Please enter both username and password',
        })
    } else {
      const url = REACT_APP_RESTAPI + 'modules/user/user.php'
      let user = ACL.getUser()
      let formData = new FormData()
      formData.append('from', 'admin')
      formData.append('auth_user', user.id)
      formData.append('auth_type', user.usertype)
      formData.append('auth_token', user.token)
      formData.append('action', 'login')
      formData.append('username', this.state.username)
      formData.append('password', this.state.password)
      axios({
        method: 'post',
        url: url,
        data: formData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
      })
        .then((response) => {
          //handle success
          //this._isMounted && this.setState({ response: response.data });
          // console.log('-------||||------')
          //console.log(response.data)
          if (response.data.success === false) {
            this._isMounted && this.setState({ error_msg: response.data.msg })
            //console.log("error");
          } else {
            this._isMounted && this.setState({ error_msg: response.data.msg })
            if (response.data.user.usertype === 'admin') {
              this.notify('tr', response.data.msg)
              ACL.authenticateUser(response.data.user)
              //console.log("success");
              setTimeout(() => {
                this.props.history.push('zak/dashboard')
              }, 1000)
            }
          }
        })
        .catch(function (response) {
          //handle error
          //console.log(response)
        })
    }
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

    if (REACT_APP_MODE === 'demo') {
      this._isMounted && this.setState({ username: 'admin', password: 'admin' })
    }
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
                      <a href="#!" title="Login Page" tabIndex="-1">
                        &nbsp;
                      </a>
                    </h1>
                    {REACT_APP_MODE === 'demo' ? (
                      <div className="demo-login-info">
                        <h5>Demo Account Login</h5>
                        <div>
                          Username: <strong>admin</strong> &nbsp;&nbsp;&nbsp;
                          Password: <strong>admin</strong>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
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
                      <p className="submit">
                        <button
                          type="submit"
                          onClick={(e) => this.handleFormSubmit(e)}
                          className="btn btn-primary btn-block"
                        >
                          Login
                        </button>
                      </p>
                    </form>

                    <p id="nav">
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

export default Login
