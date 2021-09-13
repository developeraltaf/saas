import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col, Label, Input } from 'reactstrap'

import axios from 'axios'
import NotificationAlert from 'react-notification-alert'
import DateTimePicker from 'react-datetime-picker'

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
// const content = {
//   entityMap: {},
//   blocks: [
//     {
//       key: '637gr',
//       text: 'Initialized from content state.',
//       type: 'unstyled',
//       depth: 0,
//       inlineStyleRanges: [],
//       entityRanges: [],
//       data: {},
//     },
//   ],
// }

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class AddBlog extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      user_id: '',
      title: '',
      brief: '',
      attachment: '',
      attachment_disp: [],
      blog_category: '',
      timestamp: '',
      response: '',
      id: '',
      status: '',
      userslist: [],
      blogcategorylist: [],
      blog_date: new Date(),
      description: '',
      editorState: EditorState.createEmpty(),
      error_msg: '',
    }

    this.onImageChange = this.onImageChange.bind(this)
    this.notify = this.notify.bind(this)
    this.loadData = this.loadData.bind(this)
    this.fetchUsers = this.fetchUsers.bind(this)
    this.changeFromdate = this.changeFromdate.bind(this)
    this.onEditorStateChange = this.onEditorStateChange.bind(this)
    this.deleteAttachment = this.deleteAttachment.bind(this)
  }

  onEditorStateChange(content) {
    this._isMounted &&
      this.setState({
        editorState: content,
        description: draftToHtml(convertToRaw(content.getCurrentContent())),
      })
  }

  changeFromdate(date) {
    this._isMounted && this.setState({ blog_date: date })
    // console.log(this.state.blog_date)
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

  handleFormSubmit(e) {
    e.preventDefault()
    var checkmode = App.check_app_mode(e)
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
        this.state.title === '' ||
        this.state.status === '' ||
        this.state.blog_date === null ||
        this.state.user_id === '' ||
        this.state.brief === '' ||
        this.state.blog_category === '' ||
        this.state.attachment.length === 0 ||
        this.state.description === ''
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

        const url = REACT_APP_RESTAPI + 'modules/blog/blog.php'
        let user = ACL.getUser()
        let formData = new FormData()
        formData.append('auth_user', user.id)
        formData.append('auth_type', user.usertype)
        formData.append('auth_token', user.token)
        formData.append('action', 'save')
        formData.append('auth_user', getuser.id)
        formData.append('id', this.state.id)
        formData.append('user_id', this.state.user_id)
        formData.append('title', this.state.title)
        formData.append('status', this.state.status)
        formData.append('brief', this.state.brief)
        formData.append('blog_category', this.state.blog_category)
        formData.append('attachment', this.state.attachment)
        formData.append('blog_date', this.state.blog_date)
        formData.append('description', this.state.description)
        formData.append('old_attachment', old_attachment)
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
                this.props.history.push('blogs')
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
    this.fetchBlogcategories()

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

  fetchBlogcategories() {
    const url1 = REACT_APP_RESTAPI + 'modules/blog/blogcategory.php'
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
            blogcategorylist: response.data.items,
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

    const url = REACT_APP_RESTAPI + 'modules/blog/blog.php'
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
        // console.log('||||||||||||||')
        // console.log(response.data.attachment)
        // console.log(response.data)

        if (response.data.success === true) {
          this._isMounted && this.setState({ user_id: response.data.user_id })
          this._isMounted && this.setState({ title: response.data.title })
          this._isMounted && this.setState({ status: response.data.status })
          this._isMounted && this.setState({ brief: response.data.brief })
          this._isMounted &&
            this.setState({
              blog_category: response.data.blog_category,
            })
          this._isMounted &&
            this.setState({ attachment: response.data.attachment })
          this._isMounted &&
            this.setState({
              attachment_disp: response.data.attachment,
            })
          this._isMounted &&
            this.setState({
              blog_date: new Date(response.data.blog_date),
            })
          this._isMounted &&
            this.setState({
              description: response.data.description,
            })

          if (response.data.description !== '') {
            this._isMounted &&
              this.setState(() => ({
                editorState: EditorState.createWithContent(
                  ContentState.createFromBlockArray(
                    convertFromHTML(response.data.description),
                  ),
                ),
              }))
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
            <Col xs={12} md={12}>
              <div className="page-title">
                <div className="float-left">
                  <h1 className="title">Add Blog</h1>
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
                                  Blog Title
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
                                  Blog Date/Time
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <div className="controls">
                                  <DateTimePicker
                                    onChange={this.changeFromdate}
                                    value={this.state.blog_date}
                                  />
                                </div>
                              </div>

                              <div className="form-group col-md-12">
                                <Label htmlFor="inputname6">
                                  Blog Owner
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
                                  <option>Select</option>
                                  {this.state.userslist.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </Input>
                              </div>

                              <div className="form-group col-md-12">
                                <label htmlFor="inputname5">
                                  Brief
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
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
                                <Label htmlFor="inputname71">
                                  Blog Category
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname71"
                                  name="blog_category"
                                  value={this.state.blog_category}
                                  onChange={(e) =>
                                    this.setState({
                                      blog_category: e.target.value,
                                    })
                                  }
                                >
                                  <option>Select</option>
                                  {this.state.blogcategorylist.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </Input>
                              </div>

                              <div className="form-group">
                                <label className="form-label" htmlFor="field-1">
                                  Description
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <div>
                                  <Editor
                                    editorState={editorState}
                                    wrapperClassName="demo-wrapper"
                                    editorClassName="demo-editor"
                                    onEditorStateChange={
                                      this.onEditorStateChange
                                    }
                                  />
                                </div>
                              </div>

                              <div className="form-group col-md-12">
                                <Label htmlFor="exampleFile">
                                  Attachment
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>

                                {this.state.attachment_disp.map((item, key) => (
                                  <div class="profileimg-input" key={key}>
                                    <img
                                      alt="attachment"
                                      src={REACT_APP_RESTAPI + '' + item.name}
                                      className="img-thumbnail"
                                    />
                                    <div className="title">
                                      {/* <span className="imginfo">
                                        {item.name} ({item.size}) ({item.type}){' '}
                                      </span>
                                      <span
                                        data-id={item.id}
                                        onClick={(e) =>
                                          this.deleteAttachment(e)
                                        }
                                      >
                                        Delete
                                      </span> */}
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

                              <div className="form-group col-md-12">
                                <Label htmlFor="inputname61">
                                  Status
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname61"
                                  name="status"
                                  value={this.state.status}
                                  onChange={(e) =>
                                    this.setState({
                                      status: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="publish">Publish</option>
                                  <option value="draft">Draft</option>
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

export default AddBlog
