import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col, Label, Input } from 'reactstrap'

import axios from 'axios'
// import Parser from 'html-react-parser'
import NotificationAlert from 'react-notification-alert'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

var MINPASSWORDLENGTH = 6

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class AddUser extends React.Component {
  constructor(props) {
    super(props)

    this._isMounted = false
    this.state = {
      username: '',
      name: '',
      email: '',
      position: '',
      location: '',
      brief: '',
      gender: '',
      phone: '',
      password: '',
      confirm_password: '',
      error_msg: '',
      image: '',
      image_disp: [],
      response: '',
      active: '',
      usertype: '',
      id: '',
      //dob: new Date(),
      dob: moment(),
    }

    this.onImageChange = this.onImageChange.bind(this)
    this.notify = this.notify.bind(this)
    this.loadData = this.loadData.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.deleteAttachment = this.deleteAttachment.bind(this)
    this.changedob = this.changedob.bind(this)
  }

  changedob(date) {
    this._isMounted && this.setState({ dob: moment(date, 'DD/MM/YYYY') })
  }

  onImageChange(e) {
    const files = e.target.files
    this._isMounted && this.setState(() => ({ image: files[0] }))
  }

  deleteAttachment(e) {
    var id = e.currentTarget.dataset.id
    //console.log(id);// console.log(this.state.image_disp);// console.log(this.state.image);
    this._isMounted &&
      this.setState(
        {
          image_disp: this.state.image_disp.filter(function (img) {
            if (img.id === id) {
              return false
            }
            return ''
          }),
        },
        () => {
          this._isMounted &&
            this.setState({ image: this.state.image_disp }, () => {
              //console.log(this.state.image);
            })
        },
      )
  }

  get_old_attachment() {
    var old_image = ''
    if (this.state.image.length > 0) {
      for (var i = this.state.image.length - 1; i >= 0; i--) {
        old_image += this.state.image[i].id + ','
      }
      old_image = old_image.substring(0, old_image.length - 1)
      //console.log(old_image);
    }
    return old_image
  }

  handleFormSubmit(event) {
    event.preventDefault()
    var checkmode = App.check_app_mode(event)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      this._isMounted && this.setState({ response: '' })
      // console.log(this.state)
      //console.log(this.state.image);
      var allow_submit = false

      if (this.state.id === '') {
        if (
          this.state.name === '' ||
          this.state.dob === null ||
          this.state.gender === '' ||
          this.state.email === '' ||
          this.state.phone === '' ||
          this.state.username === '' ||
          this.state.password === '' ||
          this.state.confirm_password === '' ||
          this.state.active === '' ||
          this.state.usertype === '' ||
          this.state.image.length === 0
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
              error_msg:
                'Password and Confirm Password are different. Please enter them again.',
            })
        } else if (this.state.password.length < MINPASSWORDLENGTH) {
          allow_submit = false
          this._isMounted &&
            this.setState({
              error_msg:
                'Password length must be ' +
                MINPASSWORDLENGTH +
                ' characters or more.',
            })
        } else {
          allow_submit = true
        }
      }

      if (this.state.id !== '') {
        if (
          this.state.name === '' ||
          this.state.dob === null ||
          this.state.gender === '' ||
          this.state.email === '' ||
          this.state.phone === '' ||
          this.state.username === '' ||
          this.state.active === '' ||
          this.state.usertype === '' ||
          this.state.image.length === 0
        ) {
          allow_submit = false
          //console.log("4");
          this._isMounted &&
            this.setState({
              error_msg: 'Please enter all the fields correctly',
            })
        } else if (
          this.state.password !== '' ||
          this.state.confirm_password !== ''
        ) {
          if (this.state.password !== this.state.confirm_password) {
            allow_submit = false
            //// console.log("1");
            this._isMounted &&
              this.setState({
                error_msg:
                  'Password and Confirm Password are different. Please enter them again.',
              })
          } else if (this.state.password.length < MINPASSWORDLENGTH) {
            //console.log("2");
            allow_submit = false
            this._isMounted &&
              this.setState({
                error_msg:
                  'Password length must be ' +
                  MINPASSWORDLENGTH +
                  ' characters or more.',
              })
          } else {
            //console.log("3");
            allow_submit = true
            this._isMounted && this.setState({ error_msg: '' })
          }
        } else {
          allow_submit = true
        }
      }
      //console.log(allow_submit);
      // Check for uniqueness and availability
      if (allow_submit) {
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
        formData.append('id', this.state.id) // required for updates
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
              this._isMounted && this.setState({ error_msg: response.data.msg })
              //console.log("error");
            } else {
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
    } // end check mode
  }

  submitForm() {
    App.ajaxloading()
    var getuser = ACL.getUser()

    var old_image = this.get_old_attachment()

    const url = REACT_APP_RESTAPI + 'modules/user/user.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'save')
    formData.append('auth_user', getuser.id)
    formData.append('id', this.state.id)
    formData.append('name', this.state.name)
    formData.append('username', this.state.username)
    formData.append('password', this.state.password)
    formData.append('email', this.state.email)
    formData.append('phone', this.state.phone)
    formData.append('image', this.state.image)
    formData.append('position', this.state.position)
    formData.append('location', this.state.location)
    formData.append('brief', this.state.brief)
    formData.append('gender', this.state.gender)
    formData.append('active', this.state.active)
    formData.append('usertype', this.state.usertype)
    formData.append('old_image', old_image)
    formData.append('dob', this.state.dob)

    axios({
      method: 'post',
      url: url,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        App.ajaxloaded()
        //handle success
        // console.log(response.data)
        if (response.data.success === false) {
          this._isMounted && this.setState({ error_msg: response.data.msg })
        } else {
          this._isMounted && this.setState({ error_msg: '' })
          this.notify('tr', response.data.msg)
          setTimeout(() => {
            this.props.history.push('users')
          }, 2000)
        }
      })
      .catch(function (response) {
        App.ajaxloaded()
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

    const search = window.location.search
    const params = new URLSearchParams(search)
    //const getid = "";
    //console.log(params.has('id'));
    //console.log(this.props.location.search);
    if (params.has('id')) {
      const getid = params.get('id')
      //console.log(getid);
      this._isMounted && this.setState({ id: getid })
      //console.log("true");
      this.loadData(getid)
    } else {
      //console.log("false");
    }

    //console.log(this.state.dob);
  }
  loadData(id) {
    //event.preventDefault();
    //this._isMounted && this.setState({ response: ""});
    //console.log(this.state);
    //console.log(this.state.image);

    var tzoffset = ACL.getUserTimeZone()

    const url = REACT_APP_RESTAPI + 'modules/user/user.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch')
    formData.append('time', tzoffset)
    formData.append('id', id)
    axios({
      method: 'post',
      url: url,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        //handle success
        // console.log(response.data)

        if (response.data.success === true) {
          this._isMounted && this.setState({ username: response.data.username })
          this._isMounted && this.setState({ name: response.data.name })
          this._isMounted && this.setState({ email: response.data.email })
          this._isMounted && this.setState({ position: response.data.position })
          this._isMounted && this.setState({ location: response.data.location })
          this._isMounted && this.setState({ brief: response.data.brief })
          this._isMounted && this.setState({ gender: response.data.gender })
          this._isMounted && this.setState({ phone: response.data.phone })
          this._isMounted && this.setState({ image: response.data.image })
          this._isMounted && this.setState({ image_disp: response.data.image })
          this._isMounted && this.setState({ active: response.data.active })
          this._isMounted && this.setState({ usertype: response.data.usertype })
          if (response.data.dob !== '') {
            this._isMounted && this.setState({ dob: moment(response.data.dob) })
          }
        }
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
      })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    return (
      <div>
        <div className="content">
          <Row>
            <Col xs={12} md={12}>
              <div className="page-title">
                <div className="float-left">
                  <h1 className="title">Add User</h1>
                </div>
              </div>

              <div className="notification-popup">
                <NotificationAlert ref="notificationAlert" />
              </div>

              <div className="row margin-0">
                <div className="col-12">
                  <section className="box ">
                    <header className="panel_header">
                      <h2 className="title float-left">Details</h2>
                    </header>
                    <div className="content-body">
                      <div className="row">
                        <div className="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-8">
                          <form>
                            <div className="form-row">
                              <div className="form-group col-md-12">
                                <label htmlFor="inputname41">
                                  Name
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="inputname41"
                                  name="name"
                                  value={this.state.name}
                                  onChange={(e) =>
                                    this.setState({
                                      name: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>
                              <div className="form-group col-md-12">
                                <label htmlFor="inputname4">
                                  Username
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="inputname4"
                                  name="username"
                                  value={this.state.username}
                                  onChange={(e) =>
                                    this.setState({
                                      username: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>
                              <div className="form-group col-md-12">
                                <label htmlFor="inputname42">
                                  Password (Minimum 6 characters){' '}
                                  {this.state.id !== ''
                                    ? '(Leave blank to unchange)'
                                    : ''}
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  id="inputname42"
                                  name="password"
                                  value={this.state.password}
                                  onChange={(e) =>
                                    this.setState({
                                      password: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>
                              <div className="form-group col-md-12">
                                <label htmlFor="inputname52">
                                  Confirm Password
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  id="inputname52"
                                  name="confirm_password"
                                  value={this.state.confirm_password}
                                  onChange={(e) =>
                                    this.setState({
                                      confirm_password: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>

                              <div className="form-group col-md-12">
                                <label htmlFor="inputname5">
                                  Email
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="inputname5"
                                  name="email"
                                  value={this.state.email}
                                  onChange={(e) =>
                                    this.setState({
                                      email: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>
                              <div className="form-group col-md-12">
                                <label htmlFor="inputname5">
                                  Phone
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="inputname5"
                                  name="phone"
                                  value={this.state.phone}
                                  onChange={(e) =>
                                    this.setState({
                                      phone: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">
                                  Date of Birth
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <div className="controls">
                                  <DatePicker
                                    dateFormat="DD/MM/YYYY"
                                    selected={this.state.dob}
                                    onChange={this.changedob}
                                  />
                                </div>
                              </div>

                              <div className="form-group col-md-12">
                                <Label htmlFor="inputname607">
                                  Gender
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname607"
                                  name="gender"
                                  value={this.state.gender}
                                  onChange={(e) =>
                                    this.setState({
                                      gender: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                  <option value="other">Other</option>
                                </Input>
                              </div>

                              <div className="form-group col-md-12">
                                <Label htmlFor="exampleFile">
                                  Image
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>

                                {this.state.image_disp.map((item, key) => (
                                  <div className="profileimg-input" key={key}>
                                    <img
                                      alt="attachment"
                                      src={App.filename_url(item.name)}
                                      className="img-thumbnail"
                                    />
                                    {/* <br />
                                    <div className="title">
                                      <span className="imginfo">
                                        {item.name} ({item.size}) ({item.type}){' '}
                                      </span>
                                      <span
                                        className="deleteimg btn btn-xs deleteimg btn-danger"
                                        data-id={item.id}
                                        onClick={(e) =>
                                          this.deleteAttachment(e)
                                        }
                                      >
                                        X
                                      </span>
                                    </div> */}
                                  </div>
                                ))}

                                <Input
                                  accept="image/*"
                                  type="file"
                                  id="exampleFile"
                                  name="image"
                                  onChange={this.onImageChange.bind(this)}
                                />
                              </div>
                              <div className="form-group col-md-12">
                                <label htmlFor="inputname5">Position</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="inputname5"
                                  name="position"
                                  value={this.state.position}
                                  onChange={(e) =>
                                    this.setState({
                                      position: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>
                              <div className="form-group col-md-12">
                                <label htmlFor="inputname5">Location</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="inputname5"
                                  name="location"
                                  value={this.state.location}
                                  onChange={(e) =>
                                    this.setState({
                                      location: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>
                              <div className="form-group col-md-12">
                                <label htmlFor="inputname523">Brief</label>
                                <Input
                                  type="textarea"
                                  className="form-control"
                                  id="inputname523"
                                  name="brief"
                                  value={this.state.brief}
                                  onChange={(e) =>
                                    this.setState({
                                      brief: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>

                              <div className="form-group col-md-12">
                                <Label htmlFor="inputname60">
                                  Active
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname60"
                                  name="active"
                                  value={this.state.active}
                                  onChange={(e) =>
                                    this.setState({
                                      active: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="1">Active</option>
                                  <option value="0">Inactive</option>
                                </Input>
                              </div>

                              <div className="form-group col-md-12">
                                <Label htmlFor="inputname61">
                                  User Type
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname61"
                                  name="usertype"
                                  value={this.state.usertype}
                                  onChange={(e) =>
                                    this.setState({
                                      usertype: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="user">User</option>
                                  <option value="admin">Administrator</option>
                                </Input>
                              </div>
                            </div>
                            <button
                              type="submit"
                              onClick={(e) => this.handleFormSubmit(e)}
                              className="btn btn-primary"
                            >
                              Save
                            </button>
                            <div className="text-danger text-small">
                              {this.state.error_msg}
                            </div>

                            {this.state.response}
                          </form>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default AddUser
