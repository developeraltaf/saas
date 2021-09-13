import React from 'react'
import { ACL } from 'components'

import {} from 'reactstrap'

import {} from 'components'

import { NavLink } from 'react-router-dom'
import axios from 'axios'
import NotificationAlert from 'react-notification-alert'

// var IMGDIR = process.env.REACT_APP_IMGDIR;

var REACT_APP_MODE = process.env.REACT_APP_MODE
var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class LockScreen extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      username: '',
      password: '',
      image: '',
      id: '',
      name: '',
      error_msg: '',
      response: '',
    }

    this.handleFormSubmit = this.handleFormSubmit.bind(this)

    /*-------- If User is Not logged in, then redirect to Login Page*/
    //console.log("Check authentic user or not: ");
    //console.log(ACL.isUserACLenticated());
    //console.log(ACL.getUser());
    var authentic = ACL.isUserACLenticated()
    if (!authentic) {
      this.props.history.push('login')
    }
  }

  async componentDidMount() {
    this._isMounted = true

    if (REACT_APP_MODE === 'demo') {
      this._isMounted && this.setState({ password: 'admin' })
    }

    var getuser = ACL.getUser()
    //console.log("--------------------");
    // console.log(getuser)

    this._isMounted &&
      this.setState({
        error_msg: 'Please re-enter your password to continue',
      })

    if (getuser['name'] !== '' && getuser['name'] !== null) {
      this._isMounted && this.setState({ name: getuser['name'] })
    }
    if (getuser['image'] !== '' && getuser['image'] !== null) {
      this._isMounted && this.setState({ image: getuser['image'] })
    }
    if (getuser['username'] !== '' && getuser['username'] !== null) {
      this._isMounted && this.setState({ username: getuser['username'] })
    }
    if (getuser['id'] !== '' && getuser['id'] !== null) {
      this._isMounted &&
        this.setState({ id: getuser['id'] }, () => {
          // console.log(this.state)
        })
    }
  }

  handleFormSubmit(event) {
    event.preventDefault()
    this._isMounted && this.setState({ response: '' })
    //console.log(this.state);
    //console.log(this.state.image);

    // Get redirect back to url
    const search = window.location.search
    const params = new URLSearchParams(search)
    var geturl = ''
    if (params.has('url')) {
      if (params.get('url') !== '') {
        geturl = params.get('url')
      }
    }

    //var allow_submit = false

    if (this.state.password === '') {
      // allow_submit = false
      this._isMounted &&
        this.setState({ error_msg: 'Please enter your password' })
    } else {
      const url = REACT_APP_RESTAPI + 'modules/user/user.php'
      let user = ACL.getUser()
      let formData = new FormData()
      formData.append('auth_user', user.id)
      formData.append('auth_type', user.usertype)
      formData.append('auth_token', user.token)
      formData.append('action', 'login')
      formData.append('from', 'lockscreen')
      formData.append('id', this.state.id)
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
          // console.log(response.data)
          if (response.data.success === false) {
            this._isMounted && this.setState({ error_msg: response.data.msg })
            //console.log("error");
          } else {
            this._isMounted && this.setState({ error_msg: response.data.msg })
            ACL.authenticateUser(response.data.user)
            //console.log("success");
            this.notify('tr', response.data.msg)
            if (geturl !== '') {
              setTimeout(() => {
                this.props.history.push(geturl)
              }, 2000)
            } else {
              setTimeout(() => {
                this.props.history.push('zak/dashboard')
              }, 2000)
            }
          }
        })
        .catch(function (response) {
          //handle error message
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

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    return (
      <div>
        <div className="">
          <div className="container-fluid">
            <div className="row loginpage">
              <div className="col-xl-12">
                <div className="notification-popup">
                  <NotificationAlert ref="notificationAlert" />
                </div>

                <div className="content-body">
                  {' '}
                  <div className="row">
                    <div className="col-12">
                      {this.state.image !== '' ? (
                        <h1 className="lockscreen_info">
                          <img
                            alt=""
                            src={REACT_APP_RESTAPI + '' + this.state.image}
                          />
                        </h1>
                      ) : (
                        ''
                      )}
                      <h1 className="lockscreen_info">
                        {' '}
                        Hello {this.state.name}
                      </h1>
                      <p className="lockscreen_tagline">
                        {this.state.error_msg}
                      </p>

                      {REACT_APP_MODE === 'demo' ? (
                        <div className="demo-login-info">
                          <div>
                            Demo Account Password: <strong>admin</strong>
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                      <div className="row">
                        <div className="col-lg-4 col-md-6 col-8 offset-lg-4 offset-md-3 offset-2 lockscreen_search_area">
                          <form
                            action="#!"
                            method="post"
                            className="lockscreen_search"
                          >
                            <div className="input-group">
                              <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={this.state.password}
                                onChange={(e) =>
                                  this.setState({
                                    password: e.target.value,
                                  })
                                }
                                placeholder="Password"
                              />
                              <button
                                className="btn btn-primary"
                                onClick={(e) => this.handleFormSubmit(e)}
                              >
                                Login Again
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div className="clearfix"></div>
                    </div>
                  </div>
                </div>
                <div className="clearfix"></div>
                <br />
                <p id="nav" className="text-center">
                  <NavLink to={'forgotpassword'}>Forgot password?</NavLink> |{' '}
                  <NavLink to={'register'}>Register</NavLink>
                </p>

                <p id="nav" className="text-center">
                  {this.state.name !== '' ? (
                    <NavLink to={'logout'}>
                      Not {this.state.name}? Login Again
                    </NavLink>
                  ) : (
                    ''
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LockScreen
