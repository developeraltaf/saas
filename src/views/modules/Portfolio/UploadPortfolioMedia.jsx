import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col, Label, Input } from 'reactstrap'

import axios from 'axios'
// import Parser from 'html-react-parser'
import NotificationAlert from 'react-notification-alert'

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class UploadPortfolioMedia extends React.Component {
  constructor(props) {
    super(props)

    this._isMounted = false
    this.state = {
      error_msg: '',
      response: '',
      attachment: [],
      attachment_disp: [],
      attachmentlen: 0,
      fileKey: '',
    }

    this.onImageChange = this.onImageChange.bind(this)
    this.notify = this.notify.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.deleteAttachment = this.deleteAttachment.bind(this)
  }

  onImageChange(e) {
    //this._isMounted && this.setState({ attachment: [] })
    const files = e.target.files
    // console.log(files)
    for (let i = 0; i < files.length; i++) {
      // console.log(files[i].name)
      //console.log(files.item(i).name);
      this._isMounted && this.state.attachment.push(files[i])
    }
    // console.log(this.state.attachment)
    this._isMounted &&
      this.setState({ attachmentlen: this.state.attachment.length })
    // reset input type=file key, so that it react regenerates the field again
    let randomString = Math.random().toString(36)
    this._isMounted && this.setState({ fileKey: randomString })
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

  handleFormSubmit(event) {
    event.preventDefault()
    var checkmode = App.check_app_mode(event)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      this._isMounted && this.setState({ response: '' })
      // console.log(this.state)

      var allow_submit = false

      if (this.state.attachment.length === 0) {
        allow_submit = false
        this._isMounted &&
          this.setState({
            error_msg: 'Please select some media files for upload.',
          })
      } else {
        allow_submit = true
      }

      // Check for uniqueness and availability
      if (allow_submit) {
        //event.target.value = null;
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

    formData.append('action', 'save-media')
    formData.append('auth_user', getuser.id)
    formData.append('old_attachment', '')
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
        // console.log(response.data)
        if (response.data.success === false) {
          this._isMounted && this.setState({ error_msg: response.data.msg })
        } else {
          // reset input type=file key, so that it react regenerates the field again
          let randomString = Math.random().toString(36)
          this._isMounted && this.setState({ fileKey: randomString })

          this._isMounted &&
            this.setState({ attachment: [], attachment_disp: [] })

          this._isMounted && this.setState({ error_msg: '' })
          this.notify('tr', response.data.msg)
          setTimeout(() => {
            this.props.history.push('portfoliomedia')
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
                  <h1 className="title">Bulk Upload Portfolio Media</h1>
                </div>
              </div>

              <div className="notification-popup">
                <NotificationAlert ref="notificationAlert" />
              </div>

              <div className="row margin-0">
                <div className="col-12">
                  <section className="box ">
                    <header className="panel_header">
                      <h2 className="title float-left">Select & Upload</h2>
                    </header>
                    <div className="content-body">
                      <div className="row">
                        <div className="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-8">
                          <form>
                            <div className="form-row">
                              <div className="form-group">
                                <Label htmlFor="exampleFile">
                                  Attachments
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>
                                <Input
                                  accept="image/*"
                                  type="file"
                                  key={this.state.fileKey || ''}
                                  id="exampleFile"
                                  name="attachment"
                                  onChange={this.onImageChange.bind(this)}
                                  multiple
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
                            {this.state.attachmentlen > 0 ? (
                              <span>
                                ( {this.state.attachmentlen} files attached )
                              </span>
                            ) : (
                              <span></span>
                            )}

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

export default UploadPortfolioMedia
