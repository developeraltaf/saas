import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col, Label, Input } from 'reactstrap'

import {} from 'components'
import Mailmenu from './Menu.jsx'
import axios from 'axios'
//import Parser from 'html-react-parser'
import NotificationAlert from 'react-notification-alert'

//Wysiwyg Editor
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
} from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
//import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
//import { convertFromRaw } from 'draft-js'

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Mailcompose extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      from_user_id: '',
      to_user_id: '',
      title: '',
      message: '',
      attachment: [],
      attachment_disp: [],
      //old_attachment: "",
      response: '',
      id: '',
      userslist: [],
      editorState: EditorState.createEmpty(),
      readOnlyTitle: false,
      parent_id: '',
      thread_id: '',
      mail_category: '',
      error_msg: '',
      user_id: '',
    }
    this.onImageChange = this.onImageChange.bind(this)
    this.notify = this.notify.bind(this)
    this.loadData = this.loadData.bind(this)
    this.fetchUsers = this.fetchUsers.bind(this)
    this.onEditorStateChange = this.onEditorStateChange.bind(this)
    this.deleteAttachment = this.deleteAttachment.bind(this)
  }

  onEditorStateChange(content) {
    this._isMounted &&
      this.setState({
        editorState: content,
        message: draftToHtml(convertToRaw(content.getCurrentContent())),
      })
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

  handleFormSubmit(event) {
    event.preventDefault()
    var checkmode = App.check_app_mode(event)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      this._isMounted && this.setState({ response: '' })
      // console.log('--------------')
      // console.log(this.state)
      // console.log(this.state.attachment)
      // console.log('--------------')

      var status = event.currentTarget.dataset.id
      // console.log(status)

      var allow_submit = false
      if (
        this.state.title === '' ||
        this.state.from_user_id === '' ||
        this.state.to_user_id === '' ||
        this.state.message === ''
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

      if (allow_submit) {
        App.ajaxloading()
        var getuser = ACL.getUser()

        var old_attachment = this.get_old_attachment()

        const url = REACT_APP_RESTAPI + 'modules/mail/mail.php'
        let user = ACL.getUser()
        let formData = new FormData()
        formData.append('auth_user', user.id)
        formData.append('auth_type', user.usertype)
        formData.append('auth_token', user.token)
        formData.append('action', 'save')

        if (this.state.parent_id === '') {
          formData.append('id', this.state.id)
        } else {
          formData.append('id', '')
          formData.append('parent_id', this.state.parent_id)
        }
        //console.log(this.state.old_attachment);
        formData.append('auth_user', getuser.id)
        formData.append('from_user_id', this.state.from_user_id)
        formData.append('to_user_id', this.state.to_user_id)
        formData.append('title', this.state.title)
        formData.append('message', this.state.message)
        //formData.append('old_attachment', this.state.old_attachment)
        formData.append('status', status)
        formData.append('thread_id', this.state.thread_id)
        formData.append('mark_read', '0')
        formData.append('mail_category', this.state.mail_category)

        formData.append('old_attachment', old_attachment)
        for (let i = 0; i < this.state.attachment.length; i++) {
          formData.append('attachment[]', this.state.attachment[i])
        }
        //formData.append('attachment', this.state.attachment)
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
                this.props.history.push(
                  'mail-inbox?user_id=' + this.state.user_id,
                )
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

    var getuser = ACL.getUser()
    var user_id = getuser.id

    const search = window.location.search
    const params = new URLSearchParams(search)

    if (params.get('user_id') !== null) {
      user_id = params.get('user_id')
    }

    //const getid = "";
    //console.log(params.has('id'));
    //console.log(this.props.location.search);
    if (params.has('id')) {
      const getid = params.get('id')
      const get_thread_id = params.get('thread')
      //console.log(getid);
      this._isMounted &&
        this.setState({
          id: getid,
          thread_id: get_thread_id,
          user_id: user_id,
        })
      //console.log("true");
      this.loadData(getid, 'fetch')
    } else if (params.has('reply')) {
      const getid = params.get('reply')
      const get_thread_id = params.get('thread')
      //console.log(getid+get_thread_id);
      this._isMounted &&
        this.setState({
          id: getid,
          thread_id: get_thread_id,
          user_id: user_id,
        })
      //console.log("true");
      this.loadData(getid, 'reply')
    } else if (params.has('forward')) {
      const getid = params.get('forward')
      //console.log(getid+get_thread_id);
      this._isMounted && this.setState({ id: '', user_id: user_id })
      //console.log("true");
      this.loadData(getid, 'forward')
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

  loadData(id, type) {
    //event.preventDefault();
    //this._isMounted && this.setState({ response: ""});
    //console.log(this.state);
    //console.log(this.state.image);

    const url = REACT_APP_RESTAPI + 'modules/mail/mail.php'
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
        // console.log('------------')
        // console.log(response.data)

        if (response.data.success === true) {
          if (type === 'fetch') {
            this._isMounted &&
              this.setState({
                from_user_id: response.data.from_user_id,
              })
            this._isMounted &&
              this.setState({
                to_user_id: response.data.to_user_id,
              })
            this._isMounted && this.setState({ title: response.data.title })
            this._isMounted && this.setState({ message: response.data.message })
            this._isMounted &&
              this.setState({
                attachment: response.data.attachment,
              })
            this._isMounted &&
              this.setState({
                attachment_disp: response.data.attachment,
              })
            //this._isMounted && this.setState({ old_attachment: response.data.old_attachment });
            //this._isMounted && this.setState({ parent_id: response.data.parent_id });
            //console.log(response.data.old_attachment);

            if (response.data.parent_id !== '0') {
              this._isMounted && this.setState({ readOnlyTitle: true })
            }

            if (response.data.message !== '') {
              this._isMounted &&
                this.setState(() => ({
                  editorState: EditorState.createWithContent(
                    ContentState.createFromBlockArray(
                      convertFromHTML(response.data.message),
                    ),
                  ),
                }))
            }
          } else if (type === 'reply') {
            // console.log('------- repy --------')
            var user_id = this.state.user_id
            var from_user_id = response.data.from_user_id
            var to_user_id = response.data.to_user_id

            if (user_id !== from_user_id) {
              to_user_id = from_user_id
            }

            this._isMounted && this.setState({ from_user_id: user_id })
            this._isMounted && this.setState({ to_user_id: to_user_id })
            this._isMounted &&
              this.setState({
                mail_category: response.data.mail_category,
              })
            this._isMounted && this.setState({ title: response.data.title })
            this._isMounted && this.setState({ parent_id: response.data.id })
            this._isMounted && this.setState({ readOnlyTitle: true })
          } else if (type === 'forward') {
            this._isMounted && this.setState({ title: response.data.title })
            this._isMounted && this.setState({ message: response.data.message })
            this._isMounted &&
              this.setState({
                attachment: response.data.attachment,
              })
            this._isMounted &&
              this.setState({
                attachment_disp: response.data.attachment,
              })
            //this._isMounted && this.setState({ old_attachment: response.data.old_attachment });

            if (response.data.message !== '') {
              this._isMounted &&
                this.setState(() => ({
                  editorState: EditorState.createWithContent(
                    ContentState.createFromBlockArray(
                      convertFromHTML(response.data.message),
                    ),
                  ),
                }))
            }
            //console.log("id: ");// console.log(this.state.id);
            //console.log("parent id: ");// console.log(this.state.parent_id);
            //console.log("thread id: ");// console.log(this.state.thread_id);
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
    const { editorState } = this.state

    return (
      <div>
        <div className="content">
          <Row>
            <Col md={12}>
              <div className="page-title">
                <div className="float-left">
                  <h1 className="title">Mail Compose</h1>
                </div>
              </div>

              <div className="notification-popup">
                <NotificationAlert ref="notificationAlert" />
              </div>

              <div className="content-body">
                <div className="row" style={{ margin: '15px 0px 0px 0px' }}>
                  <Mailmenu />

                  <div
                    className="col-lg-10 col-md-9 col-12"
                    style={{ paddingLeft: '0px' }}
                  >
                    <div className="mail_content">
                      <div className="row">
                        <div className="col-12">
                          {/* <div>
                            {'Loaded View of (' + this.state.user_id + ')'}
                          </div> */}
                          <h3 className="mail_head">Compose</h3>

                          {/* <i className="i-refresh icon-primary icon-xs icon-accent mail_head_icon float-right"></i>
                          <i className="i-magnifier icon-primary icon-xs icon-accent mail_head_icon float-right"></i>
                          <i className="i-settings icon-primary icon-xs icon-accent mail_head_icon float-right"></i> */}
                        </div>
                        <div className="spacer"></div>
                        <form style={{ width: '100%' }}>
                          <div className="col-12 mail_view_info">
                            <div className="form-group">
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
                                    {item.name} ({item.username})
                                  </option>
                                ))}
                              </Input>
                            </div>

                            <div className="form-group">
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
                                    {item.name} ({item.username})
                                  </option>
                                ))}
                              </Input>
                            </div>

                            <div className="form-group">
                              <label htmlFor="inputname51">
                                Title
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
                                readOnly={this.state.readOnlyTitle}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label" htmlFor="field-1">
                                Message
                                <sup className="compulsory" title="Mandatory">
                                  *
                                </sup>
                              </label>
                              <div>
                                <Editor
                                  editorState={editorState}
                                  wrapperClassName="demo-wrapper"
                                  editorClassName="demo-editor"
                                  onEditorStateChange={this.onEditorStateChange}
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <Label htmlFor="exampleFile">
                                Attachment (if any)
                              </Label>

                              {this.state.attachment_disp.map((item, key) => (
                                <div
                                  class="profileimg-input"
                                  key={key}
                                  style={{
                                    float: 'left',
                                    width: '200px',
                                    height: '300px',
                                    lineHeight: '23px',
                                  }}
                                >
                                  {item.id !== undefined ? (
                                    <div>
                                      <img
                                        alt="attachment"
                                        src={REACT_APP_RESTAPI + '' + item.name}
                                        className="img-thumbnail"
                                        style={{
                                          width: '120px',
                                        }}
                                      />
                                      <br />
                                      <div className="title">
                                        ({item.id}){' '}
                                        <span className="imginfo">
                                          {item.name} ({item.size}) ({item.type}
                                          ){' '}
                                        </span>
                                        <span
                                          data-id={item.id}
                                          onClick={(e) =>
                                            this.deleteAttachment(e)
                                          }
                                        >
                                          Delete
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      {/* Uploading...{" "}
																			<span className="imginfo">
																				{item.name} ({item.size}) ({item.type}){" "}
																			</span>
																			<span className="deleteimg btn btn-xs deleteimg btn-danger" data-id={item.id} onClick={(e) => this.deleteAttachment(e)}>
																				X
																			</span> */}
                                    </div>
                                  )}
                                </div>
                              ))}

                              <Input
                                accept="image/*"
                                type="file"
                                id="exampleFile"
                                name="attachment"
                                onChange={this.onImageChange.bind(this)}
                                multiple
                              />
                            </div>
                          </div>

                          <div className="form-group col-md-12">
                            <button
                              type="submit"
                              onClick={(e) => this.handleFormSubmit(e)}
                              data-id="send"
                              className="btn btn-primary"
                            >
                              Send
                            </button>
                            <button
                              type="submit"
                              onClick={(e) => this.handleFormSubmit(e)}
                              data-id="draft"
                              className="btn btn-primary"
                            >
                              Save as Draft
                            </button>
                            <div className="text-danger text-small">
                              {this.state.error_msg}
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
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

export default Mailcompose
