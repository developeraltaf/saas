import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col, Label, Input } from 'reactstrap'

import axios from 'axios'
// import Parser from 'html-react-parser'
import NotificationAlert from 'react-notification-alert'
import DateTimePicker from 'react-datetime-picker'

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class AddEvent extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      users: [],
      contacts: [],
      title: '',
      brief: '',
      location: '',
      attachment: [],
      attachment_disp: [],
      event_category: '',
      timestamp: '',
      response: '',
      id: '',
      userslist: [],
      contactslist: [],
      eventcategorylist: [],
      from_date: new Date(),
      to_date: new Date(),
      error_msg: '',
      active: '',
      eventtype: '',
      user_id: '',
    }

    this.onImageChange = this.onImageChange.bind(this)
    this.notify = this.notify.bind(this)
    this.loadData = this.loadData.bind(this)
    this.fetchUsers = this.fetchUsers.bind(this)
    this.changeFromdate = this.changeFromdate.bind(this)
    this.changeTodate = this.changeTodate.bind(this)
    this.selectContacts = this.selectContacts.bind(this)
    this.selectUsers = this.selectUsers.bind(this)
    this.deleteAttachment = this.deleteAttachment.bind(this)
  }

  changeFromdate(date) {
    this._isMounted && this.setState({ from_date: date })
  }
  changeTodate(date) {
    this._isMounted && this.setState({ to_date: date })
  }

  onImageChange(e) {
    const files = e.target.files
    // console.log(files)
    for (let i = 0; i < files.length; i++) {
      // console.log(files[i].name)
      //console.log(files.item(i).name);
      this.state.attachment.push(files[i])
    }
    // console.log(this.state.attachment)
  }

  deleteAttachment(e) {
    var id = e.currentTarget.dataset.id
    // console.log(id)
    // console.log(this.state.attachment_disp)
    // console.log(this.state.attachment)

    // remove this id from attachment state
    this.setState(
      {
        attachment_disp: this.state.attachment_disp.filter(function (arr) {
          return id !== arr.id
        }),
      },
      () => {
        this._isMounted &&
          this.setState({ attachment: this.state.attachment_disp }, () => {
            // console.log(this.state.attachment)
          })
      },
    )
  }

  get_old_attachment() {
    var old_attachment = ''
    if (this.state.attachment.length > 0) {
      for (var i = this.state.attachment.length - 1; i >= 0; i--) {
        if (this.state.attachment[i].id !== undefined) {
          old_attachment += this.state.attachment[i].id + ','
        }
      }
      old_attachment = old_attachment.substring(0, old_attachment.length - 1)
      //console.log(old_attachment);
    }
    return old_attachment
  }
  selectContacts(e) {
    //console.log(e);
    var options = e.target.options
    var value = []
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value)
      }
    }
    // console.log(value)
    this._isMounted && this.setState({ contacts: value })
  }

  selectUsers(e) {
    //console.log(e);
    var options = e.target.options
    var value = []
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value)
      }
    }
    // console.log(value)
    this._isMounted &&
      this.setState({ users: value }, () => {
        // console.log(this.state.users)
      })
  }

  handleFormSubmit(event) {
    event.preventDefault()
    var checkmode = App.check_app_mode(event)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      // console.log('--------------')

      this._isMounted && this.setState({ response: '' })

      // console.log(this.state)
      //console.log(this.state.attachment);
      // console.log('--------------')

      var allow_submit = false
      if (
        this.state.title === '' ||
        this.state.user_id === '' ||
        this.state.from_date === null ||
        this.state.to_date === null ||
        this.state.location === '' ||
        this.state.active === '' ||
        this.state.eventtype === ''
      ) {
        allow_submit = false
        this._isMounted &&
          this.setState({
            error_msg: 'Please enter all the mandatory (*) fields.',
          })
      } else {
        allow_submit = true
        this._isMounted && this.setState({ error_msg: '' })
      }

      //allow_submit = false;

      if (allow_submit) {
        App.ajaxloading()
        var old_attachment = this.get_old_attachment()

        var getuser = ACL.getUser()

        const url = REACT_APP_RESTAPI + 'modules/event/event.php'
        let user = ACL.getUser()
        let formData = new FormData()
        formData.append('auth_user', user.id)
        formData.append('auth_type', user.usertype)
        formData.append('auth_token', user.token)
        formData.append('action', 'save')
        formData.append('auth_user', getuser.id)
        formData.append('id', this.state.id)
        formData.append('users', this.state.users)
        formData.append('contacts', this.state.contacts)
        formData.append('title', this.state.title)
        formData.append('brief', this.state.brief)
        formData.append('location', this.state.location)
        formData.append('event_category', this.state.event_category)
        formData.append('from_date', this.state.from_date)
        formData.append('to_date', this.state.to_date)
        formData.append('active', this.state.active)
        formData.append('eventtype', this.state.eventtype)
        formData.append('user_id', this.state.user_id)

        formData.append('old_attachment', old_attachment)
        for (let i = 0; i < this.state.attachment.length; i++) {
          formData.append('attachment[]', this.state.attachment[i])
        }

        axios({
          method: 'post',
          url: url,
          data: formData,
          config: { headers: { 'Content-Type': 'multipart/form-data' } },
        })
          .then((response) => {
            App.ajaxloaded()
            //handle success
            //console.log(response.data)
            if (response.data.success === false) {
              this._isMounted && this.setState({ error_msg: response.data.msg })
            } else {
              this._isMounted && this.setState({ error_msg: '' })
              this.notify('tr', response.data.msg)
              setTimeout(() => {
                this.props.history.push('events')
              }, 2000)
            }
          })
          .catch(function (response) {
            App.ajaxloaded()
            //handle error
            //console.log(response)
          })
      } // end allow submit
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
      autoDismiss: 50000,
    }
    this.refs.notificationAlert.notificationAlert(options)
  }

  async componentDidMount() {
    this._isMounted = true

    this.fetchUsers()
    this.fetchContacts()
    this.fetchEventcategories()

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
  }

  fetchUsers() {
    const url1 = REACT_APP_RESTAPI + 'modules/user/user.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-all')
    formData.append('id', '')
    formData.append('active', '1')
    axios({
      method: 'post',
      url: url1,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        //console.log("----------------");
        //console.log(response.data.items);
        this._isMounted &&
          this.setState({
            userslist: response.data.items,
            isLoaded: true,
          })
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
      })
  }

  fetchContacts() {
    const url1 = REACT_APP_RESTAPI + 'modules/contact/contact.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-all')
    formData.append('id', '')
    axios({
      method: 'post',
      url: url1,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        //console.log("----------------");
        // console.log(response.data.items)
        this._isMounted &&
          this.setState({
            contactslist: response.data.items,
            isLoaded: true,
          })
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
      })
  }

  fetchEventcategories() {
    const url1 = REACT_APP_RESTAPI + 'modules/event/eventcategory.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-all')
    formData.append('id', '')
    axios({
      method: 'post',
      url: url1,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        //console.log("----------------");
        // console.log(response.data.items)
        this._isMounted &&
          this.setState({
            eventcategorylist: response.data.items,
            isLoaded: true,
          })
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
      })
  }

  loadData(id) {
    //event.preventDefault();
    //this._isMounted && this.setState({ response: ""});
    //console.log(this.state);
    //console.log(this.state.image);

    var tzoffset = ACL.getUserTimeZone()

    const url = REACT_APP_RESTAPI + 'modules/event/event.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch')
    formData.append('time', tzoffset)
    formData.append('users', 'array')
    formData.append('contacts', 'array')
    formData.append('id', id)
    axios({
      method: 'post',
      url: url,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        //handle success
        // console.log('---------')
        // console.log(response.data)
        // console.log(response.data.users_arr)
        // console.log(response.data.contacts_arr)
        // console.log('---------')
        if (response.data.success === true) {
          this._isMounted &&
            this.setState({ users: response.data.users_arr }, () => {
              // console.log(this.state.users)
            })
          this._isMounted &&
            this.setState({ contacts: response.data.contacts_arr }, () => {
              // console.log(this.state.contacts)
            })
          this._isMounted && this.setState({ title: response.data.title })
          this._isMounted && this.setState({ brief: response.data.brief })
          this._isMounted && this.setState({ location: response.data.location })
          this._isMounted &&
            this.setState({
              event_category: response.data.event_category,
            })
          this._isMounted &&
            this.setState({ attachment: response.data.attachment })
          this._isMounted &&
            this.setState({
              attachment_disp: response.data.attachment,
            })
          this._isMounted && this.setState({ user_id: response.data.user_id })

          if (response.data.from_date !== '') {
            this._isMounted &&
              this.setState({
                from_date: new Date(response.data.from_date),
              })
          }
          if (response.data.to_date !== '') {
            this._isMounted &&
              this.setState({
                to_date: new Date(response.data.to_date),
              })
          }
          this._isMounted && this.setState({ active: response.data.active })
          this._isMounted &&
            this.setState({ eventtype: response.data.eventtype })
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
                  <h1 className="title">Add Event</h1>
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
                                <label htmlFor="inputname51">
                                  Event Title
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="inputname51"
                                  name="title"
                                  value={this.state.title}
                                  onChange={(e) =>
                                    this.setState({
                                      title: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">
                                  From Date/Time
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <div className="controls">
                                  <DateTimePicker
                                    onChange={this.changeFromdate}
                                    value={this.state.from_date}
                                  />
                                </div>
                              </div>

                              <div className="form-group">
                                <label className="form-label">
                                  To Date/Time
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <div className="controls">
                                  <DateTimePicker
                                    onChange={this.changeTodate}
                                    value={this.state.to_date}
                                  />
                                </div>
                              </div>

                              <div className="form-group col-md-12">
                                <Label htmlFor="inputname6">
                                  Select Users Involved
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname6"
                                  multiple
                                  name="users"
                                  onChange={(e) => this.selectUsers(e)}
                                  value={this.state.users}
                                >
                                  <option value="">Select</option>
                                  {this.state.userslist.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </Input>
                              </div>

                              <div className="form-group col-md-12">
                                <Label htmlFor="inputname7">
                                  Select Contacts Involved
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname7"
                                  multiple
                                  name="contacts"
                                  onChange={(e) => this.selectContacts(e)}
                                  value={this.state.contacts}
                                >
                                  <option value="">Select</option>
                                  {this.state.contactslist.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </Input>
                              </div>

                              <div className="form-group col-md-12">
                                <label htmlFor="inputname5">Brief</label>
                                <Input
                                  type="textarea"
                                  className="form-control"
                                  id="inputname5"
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
                                <label htmlFor="inputname51">
                                  Event Location
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="inputname51"
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
                                <Label htmlFor="inputname71">
                                  Event Category
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname71"
                                  name="event_category"
                                  value={this.state.event_category}
                                  onChange={(e) =>
                                    this.setState({
                                      event_category: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  {this.state.eventcategorylist.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </Input>
                              </div>

                              <div className="form-group">
                                <Label htmlFor="Attachments">Attachments</Label>
                                <div className="multiimg-wrap">
                                  {this.state.attachment_disp.map(
                                    (item, key) => (
                                      <div
                                        className="multiimg-input profileimg-input"
                                        key={key}
                                      >
                                        {item.id !== undefined ? (
                                          <div>
                                            <img
                                              alt="attachment"
                                              src={
                                                REACT_APP_RESTAPI +
                                                '' +
                                                item.name
                                              }
                                              className="img-thumbnail"
                                            />
                                            <br />
                                            <div className="title">
                                              <span className="imginfo">
                                                ({item.id}) {item.name} (
                                                {item.size}) ({item.type}){' '}
                                              </span>
                                              <span
                                                className="deleteimg btn btn-xs btn-danger"
                                                data-id={item.id}
                                                onClick={(e) =>
                                                  this.deleteAttachment(e)
                                                }
                                              >
                                                X
                                              </span>
                                            </div>
                                          </div>
                                        ) : (
                                          <div>
                                            {/* Uploading... {item.name} (
                                            {item.size}) ({item.type}){' '}
                                            <span
                                              data-id={item.id}
                                              onClick={(e) =>
                                                this.deleteAttachment(e)
                                              }
                                            >
                                              Delete
                                            </span> */}
                                          </div>
                                        )}
                                      </div>
                                    ),
                                  )}
                                </div>

                                <Input
                                  accept="image/*"
                                  type="file"
                                  id="exampleFile"
                                  name="attachment"
                                  onChange={this.onImageChange.bind(this)}
                                  multiple
                                />
                              </div>

                              <div className="form-group col-md-12">
                                <Label htmlFor="inputname643">
                                  Event Owner
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname643"
                                  name="user_id"
                                  value={this.state.user_id}
                                  onChange={(e) =>
                                    this.setState({
                                      user_id: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  {this.state.userslist.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </Input>
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
                                  Event Type
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname61"
                                  name="eventtype"
                                  value={this.state.eventtype}
                                  onChange={(e) =>
                                    this.setState({
                                      eventtype: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="global">
                                    Global (Show to all users)
                                  </option>
                                  <option value="users">
                                    Only for selected users
                                  </option>
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

export default AddEvent
