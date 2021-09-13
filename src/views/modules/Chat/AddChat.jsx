import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col, Label, Input } from 'reactstrap'

import axios from 'axios'
//import Parser from 'html-react-parser'
import NotificationAlert from 'react-notification-alert'

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class AddChat extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      from_user_id: '',
      to_user_id: '',
      message: '',
      attachment: '',
      attachment_disp: [],
      timestamp: '',
      response: '',
      id: '',
      userslist: [],
      error_msg: '',
    }

    this.onImageChange = this.onImageChange.bind(this)
    this.notify = this.notify.bind(this)
    this.loadData = this.loadData.bind(this)
    this.fetchUsers = this.fetchUsers.bind(this)
    this.deleteAttachment = this.deleteAttachment.bind(this)
  }

  onImageChange(e) {
    const files = e.target.files
    this._isMounted && this.setState(() => ({ attachment: files[0] }))
  }

  deleteAttachment(e) {
    var id = e.currentTarget.dataset.id
    //console.log(id);// console.log(this.state.attachment_disp);// console.log(this.state.attachment);
    this._isMounted &&
      this.setState(
        {
          attachment_disp: this.state.attachment_disp.filter(function (img) {
            if (img.id === id) {
              return false
            }
            return ''
          }),
        },
        () => {
          this._isMounted &&
            this.setState({ attachment: this.state.attachment_disp }, () => {
              //console.log(this.state.attachment);
            })
        },
      )
  }

  get_old_attachment() {
    var old_attachment = ''
    if (this.state.attachment.length > 0) {
      for (var i = this.state.attachment.length - 1; i >= 0; i--) {
        old_attachment += this.state.attachment[i].id + ','
      }
      old_attachment = old_attachment.substring(0, old_attachment.length - 1)
      //console.log(old_attachment);
    }
    return old_attachment
  }

  handleFormSubmit(event) {
    event.preventDefault()
    var checkmode = App.check_app_mode(event)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      this._isMounted && this.setState({ response: '' })
      //console.log(this.state);
      //console.log(this.state.attachment);

      // console.log('--------------')
      // console.log(this.state)
      //console.log(this.state.attachment);
      // console.log('--------------')

      var allow_submit = false
      if (
        this.state.from_user_id === '' ||
        this.state.to_user_id === '' ||
        this.state.message === ''
      ) {
        allow_submit = false
        this._isMounted &&
          this.setState({
            error_msg: 'Please enter all the mandatory (*) fields.',
          })
      } else if (this.state.from_user_id === this.state.to_user_id) {
        allow_submit = false
        this._isMounted &&
          this.setState({
            error_msg: 'From User and To User cannot be same',
          })
      } else {
        allow_submit = true
        this._isMounted && this.setState({ error_msg: '' })
      }

      if (allow_submit) {
        App.ajaxloading()
        var old_attachment = this.get_old_attachment()

        var getuser = ACL.getUser()

        const url = REACT_APP_RESTAPI + 'modules/chat/chat.php'
        let user = ACL.getUser()
        let formData = new FormData()
        formData.append('auth_user', user.id)
        formData.append('auth_type', user.usertype)
        formData.append('auth_token', user.token)
        formData.append('action', 'save')
        formData.append('auth_user', getuser.id)
        formData.append('id', this.state.id)
        formData.append('from_user_id', this.state.from_user_id)
        formData.append('to_user_id', this.state.to_user_id)
        formData.append('message', this.state.message)
        formData.append('old_attachment', old_attachment)
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
              setTimeout(() => {
                this.props.history.push('chats')
              }, 2000)
            }
          })
          .catch(function (response) {
            App.ajaxloaded()
            //handle error
            //console.log(response)
          })
      } // end allow submit
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

  loadData(id) {
    //event.preventDefault();
    //this._isMounted && this.setState({ response: ""});
    //console.log(this.state);
    //console.log(this.state.image);

    const url = REACT_APP_RESTAPI + 'modules/chat/chat.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch')
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
          this._isMounted &&
            this.setState({
              from_user_id: response.data.from_user_id,
            })
          this._isMounted &&
            this.setState({ to_user_id: response.data.to_user_id })
          this._isMounted && this.setState({ message: response.data.message })
          this._isMounted &&
            this.setState({ attachment: response.data.attachment })
          this._isMounted &&
            this.setState({
              attachment_disp: response.data.attachment,
            })
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
                  <h1 className="title">Add Chat</h1>
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
                                <Label htmlFor="inputname6">
                                  From User
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname6"
                                  name="from_user_id"
                                  value={this.state.from_user_id}
                                  onChange={(e) =>
                                    this.setState({
                                      from_user_id: e.target.value,
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
                                <Label htmlFor="inputname6">
                                  To User
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname6"
                                  name="to_user_id"
                                  value={this.state.to_user_id}
                                  onChange={(e) =>
                                    this.setState({
                                      to_user_id: e.target.value,
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
                                <label htmlFor="inputname5">
                                  Message
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <Input
                                  type="textarea"
                                  className="form-control"
                                  id="inputname5"
                                  name="message"
                                  value={this.state.message}
                                  onChange={(e) =>
                                    this.setState({
                                      message: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>

                              <div className="form-group col-md-12">
                                <Label htmlFor="exampleFile">
                                  Attachment (if any)
                                </Label>

                                {this.state.attachment_disp.map((item, key) => (
                                  <div class="profileimg-input" key={key}>
                                    <img
                                      alt="attachment"
                                      src={REACT_APP_RESTAPI + '' + item.name}
                                      className="img-thumbnail"
                                    />
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
                                    </div>
                                  </div>
                                ))}

                                <Input
                                  accept="image/*"
                                  type="file"
                                  id="exampleFile"
                                  name="attachment"
                                  onChange={this.onImageChange.bind(this)}
                                />
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

export default AddChat
