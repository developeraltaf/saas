import React from 'react'
import { ACL } from 'components'
import { App } from 'components'
//
import { Row, Col, Label, Input } from 'reactstrap'

import axios from 'axios'
//import Parser from 'html-react-parser'
import NotificationAlert from 'react-notification-alert'

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class AddPortfolio extends React.Component {
  constructor(props) {
    super(props)

    this._isMounted = false
    this.state = {
      name: '',
      brief: '',
      location: '',
      error_msg: '',
      response: '',
      active: '',

      column_class: '',
      display_content: '',
      display_type: '',
      equal_height: '',
      fullwidth: '',
      circular: '',
      carousel_column: '',
      carousel_height: '',
      carousel_align: '',

      id: '',
      userslist: [],
      user_id: '',
      attachment: [],
      attachmentlist: [],
      attachmentname: [],
    }

    this.notify = this.notify.bind(this)
    this.loadData = this.loadData.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.fetchUsers = this.fetchUsers.bind(this)
    this.selectAttachment = this.selectAttachment.bind(this)
  }

  selectAttachment(e) {
    //console.log(e);
    var options = e.target.options
    var value = []
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value)
      }
    }
    // console.log(value)
    this._isMounted && this.setState({ attachment: value })
  }

  handleFormSubmit(event) {
    event.preventDefault()
    var checkmode = App.check_app_mode(event)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      this._isMounted && this.setState({ response: '' })
      // console.log(this.state)

      var allow_submit = false

      if (
        this.state.name === '' ||
        this.state.active === '' ||
        this.state.user_id === '' ||
        this.state.attachment.length === 0
      ) {
        allow_submit = false
        this._isMounted &&
          this.setState({
            error_msg: 'Please enter all the fields correctly',
          })
      } else {
        allow_submit = true
      }

      // Check for uniqueness and availability
      if (allow_submit) {
        this.submitForm()
      }
    } // end check mode
  }

  submitForm() {
    App.ajaxloading()
    var getuser = ACL.getUser()
    const url = REACT_APP_RESTAPI + 'modules/portfolio/portfolio.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)

    formData.append('action', 'save')
    formData.append('auth_user', getuser.id)
    formData.append('id', this.state.id)
    formData.append('name', this.state.name)
    formData.append('user_id', this.state.user_id)
    formData.append('brief', this.state.brief)
    formData.append('location', this.state.location)
    formData.append('active', this.state.active)

    formData.append('column_class', this.state.column_class)
    formData.append('display_content', this.state.display_content)
    formData.append('display_type', this.state.display_type)
    formData.append('equal_height', this.state.equal_height)
    formData.append('fullwidth', this.state.fullwidth)
    formData.append('circular', this.state.circular)
    formData.append('carousel_column', this.state.carousel_column)
    formData.append('carousel_height', this.state.carousel_height)
    formData.append('carousel_align', this.state.carousel_align)

    formData.append('attachment', this.state.attachment)

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
          if (response.data.id !== '') {
            setTimeout(() => {
              this.props.history.push('manage-portfolio?id=' + response.data.id)
            }, 2000)
          } else {
            setTimeout(() => {
              this.props.history.push('portfolios')
            }, 2000)
          }
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

    this.fetchUsers()
    this.fetchAttachment()

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

  fetchAttachment() {
    const url1 = REACT_APP_RESTAPI + 'modules/file/file.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-all')
    formData.append('module', 'portfolio')
    formData.append('id', '')
    axios({
      method: 'post',
      url: url1,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        // console.log('----------------')
        //console.log(response.data.items);
        //console.log(response.data.attachmentname);
        this._isMounted &&
          this.setState({
            attachmentlist: response.data.items,
            isLoaded: true,
          })
        this._isMounted &&
          this.setState(
            {
              attachmentname: response.data.attachmentname,
              isLoaded: true,
            },
            () => {
              // console.log(this.state.attachmentname)
            },
          )
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

    const url = REACT_APP_RESTAPI + 'modules/portfolio/portfolio.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch')
    formData.append('attachment', 'array')
    formData.append('id', id)
    axios({
      method: 'post',
      url: url,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        //handle success
        //console.log(response.data);
        // console.log('-----||------')
        // console.log(response.data.attachment_arr)

        if (response.data.success === true) {
          this._isMounted &&
            this.setState({ attachment: response.data.attachment_arr }, () => {
              // console.log(this.state.attachment)
            })

          this._isMounted && this.setState({ name: response.data.name })
          this._isMounted && this.setState({ brief: response.data.brief })
          this._isMounted && this.setState({ location: response.data.location })

          this._isMounted && this.setState({ active: response.data.active })
          this._isMounted && this.setState({ user_id: response.data.user_id })

          this._isMounted &&
            this.setState({
              column_class: response.data.column_class,
            })
          this._isMounted &&
            this.setState({
              display_content: response.data.display_content,
            })
          this._isMounted &&
            this.setState({
              display_type: response.data.display_type,
            })
          this._isMounted &&
            this.setState({
              equal_height: response.data.equal_height,
            })
          this._isMounted &&
            this.setState({ fullwidth: response.data.fullwidth })
          this._isMounted && this.setState({ circular: response.data.circular })
          this._isMounted &&
            this.setState({
              carousel_column: response.data.carousel_column,
            })
          this._isMounted &&
            this.setState({
              carousel_height: response.data.carousel_height,
            })
          this._isMounted &&
            this.setState({
              carousel_align: response.data.carousel_align,
            })
        }
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
      })
  }

  fetchUsers() {
    const url1 = REACT_APP_RESTAPI + 'modules/user/user.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-all')
    formData.append('active', '1')
    formData.append('id', '')
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
                  <h1 className="title">Add Portfolio</h1>
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
                                <Label htmlFor="inputname7">
                                  Select Attachment
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname7"
                                  multiple
                                  name="attachment"
                                  onChange={(e) => this.selectAttachment(e)}
                                  value={this.state.attachment}
                                >
                                  <option value="">Select</option>
                                  {this.state.attachmentlist.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.id} - {item.name} ({item.title})
                                    </option>
                                  ))}
                                </Input>

                                {this.state.attachment.map((item, key) => (
                                  <div
                                    className="multiimg-input portimg-input profileimg-input"
                                    key={key}
                                  >
                                    {this.state.attachmentname[item] !==
                                    undefined ? (
                                      <div>
                                        <img
                                          alt="attachment"
                                          src={
                                            REACT_APP_RESTAPI +
                                            '' +
                                            this.state.attachmentname[item]
                                          }
                                          className="img-thumbnail"
                                        />
                                      </div>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                ))}
                              </div>

                              <div className="form-group col-md-12">
                                <Label htmlFor="inputname6">
                                  Portfolio Owner
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname6"
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
                                  Display Type
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname60"
                                  name="display_type"
                                  value={this.state.display_type}
                                  onChange={(e) =>
                                    this.setState({
                                      display_type: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="grid">
                                    Grid Portfolio (default)
                                  </option>
                                  <option value="masonry">
                                    Masonry Portfolio
                                  </option>
                                  <option value="carousel">
                                    Carousel (Auto Slide) Portfolio
                                  </option>
                                </Input>
                              </div>

                              <div
                                className={
                                  'form-group col-md-12 ' +
                                  (this.state.display_type === 'carousel'
                                    ? ''
                                    : 'hide')
                                }
                              >
                                <Label htmlFor="inputname601">
                                  Carousel Columns
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname601"
                                  name="carousel_column"
                                  value={this.state.carousel_column}
                                  onChange={(e) =>
                                    this.setState({
                                      carousel_column: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="single">
                                    Single column (default)
                                  </option>
                                  <option value="multi">
                                    Multiple columns
                                  </option>
                                </Input>
                              </div>

                              <div
                                className={
                                  'form-group col-md-12 ' +
                                  (this.state.display_type === 'carousel'
                                    ? ''
                                    : 'hide')
                                }
                              >
                                <label htmlFor="inputname431">
                                  Carousel Height
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="inputname431"
                                  name="carousel_height"
                                  value={this.state.carousel_height}
                                  onChange={(e) =>
                                    this.setState({
                                      carousel_height: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>

                              <div
                                className={
                                  'form-group col-md-12 ' +
                                  (this.state.display_type === 'carousel'
                                    ? ''
                                    : 'hide')
                                }
                              >
                                <Label htmlFor="inputname611">
                                  Carousel Content Align
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname611"
                                  name="carousel_align"
                                  value={this.state.carousel_align}
                                  onChange={(e) =>
                                    this.setState({
                                      carousel_align: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="center-align">
                                    Center Align Content (default)
                                  </option>
                                  <option value="left-align">
                                    Left Align Content
                                  </option>
                                  <option value="right-align">
                                    Right Align Content
                                  </option>
                                </Input>
                              </div>

                              <div
                                className={
                                  'form-group col-md-12 ' +
                                  (this.state.display_type === 'carousel'
                                    ? 'hide'
                                    : '')
                                }
                              >
                                <Label htmlFor="inputname60">Columns</Label>
                                <Input
                                  type="select"
                                  id="inputname60"
                                  name="column_class"
                                  value={this.state.column_class}
                                  onChange={(e) =>
                                    this.setState({
                                      column_class: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="s12">
                                    Single column (default)
                                  </option>
                                  <option value="s6">2 columns</option>
                                  <option value="s4">3 columns</option>
                                </Input>
                              </div>

                              <div className="form-group col-md-12">
                                <Label htmlFor="inputname60">Content</Label>
                                <Input
                                  type="select"
                                  id="inputname60"
                                  name="display_content"
                                  value={this.state.display_content}
                                  onChange={(e) =>
                                    this.setState({
                                      display_content: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="none">
                                    No Content (default)
                                  </option>
                                  <option value="showcontent">
                                    Show Content (Title and Text)
                                  </option>
                                  <option value="showtitle">Show Title</option>
                                </Input>
                              </div>

                              <div className="form-group col-md-12">
                                <Label htmlFor="inputname60">
                                  Full Width Portfolio
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname60"
                                  name="fullwidth"
                                  value={this.state.fullwidth}
                                  onChange={(e) =>
                                    this.setState({
                                      fullwidth: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="1">
                                    Yes (Full Screen Width)
                                  </option>
                                  <option value="0">
                                    No (Spaced Portfolio) (default)
                                  </option>
                                </Input>
                              </div>

                              <div
                                className={
                                  'form-group col-md-12 ' +
                                  (this.state.display_type === 'carousel'
                                    ? 'hide'
                                    : '')
                                }
                              >
                                <Label htmlFor="inputname60">
                                  Circular Portfolio Items
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname60"
                                  name="circular"
                                  value={this.state.circular}
                                  onChange={(e) =>
                                    this.setState({
                                      circular: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="1">
                                    Yes (Circular Items)
                                  </option>
                                  <option value="0">No (Default)</option>
                                </Input>
                              </div>

                              <div
                                className={
                                  'form-group col-md-12 ' +
                                  (this.state.display_type === 'carousel'
                                    ? 'hide'
                                    : '')
                                }
                              >
                                <Label htmlFor="inputname60">
                                  Equal Height Columns
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname60"
                                  name="equal_height"
                                  value={this.state.equal_height}
                                  onChange={(e) =>
                                    this.setState({
                                      equal_height: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="1">Yes (Equal Height)</option>
                                  <option value="0">No (Default)</option>
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

export default AddPortfolio
