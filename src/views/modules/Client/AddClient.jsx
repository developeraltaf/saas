import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col, Label, Input } from 'reactstrap'

import axios from 'axios'
//import Parser from 'html-react-parser'
import NotificationAlert from 'react-notification-alert'

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class AddClient extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      name: '',
      url: '',
      image: '',
      image_disp: [],
      response: '',
      error_msg: '',
      id: '',
    }

    this.onImageChange = this.onImageChange.bind(this)
    this.notify = this.notify.bind(this)
    this.loadData = this.loadData.bind(this)
    this.deleteAttachment = this.deleteAttachment.bind(this)
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
      //console.log(this.state);
      //console.log(this.state.image);
      // console.log('--------------')
      // console.log(this.state)
      //console.log(this.state.image);
      // console.log('--------------')

      var allow_submit = false
      if (this.state.name === '' || this.state.image.length === 0) {
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
        var old_image = this.get_old_attachment()

        var getuser = ACL.getUser()

        const url = REACT_APP_RESTAPI + 'modules/client/client.php'
        let user = ACL.getUser()
        let formData = new FormData()
        formData.append('auth_user', user.id)
        formData.append('auth_type', user.usertype)
        formData.append('auth_token', user.token)
        formData.append('action', 'save')
        formData.append('auth_user', getuser.id)
        formData.append('id', this.state.id)
        formData.append('name', this.state.name)
        formData.append('url', this.state.url)
        formData.append('image', this.state.image)
        formData.append('old_image', old_image)
        axios({
          method: 'post',
          url: url,
          data: formData,
          config: { headers: { 'Content-Type': 'multipart/form-data' } },
        })
          .then((response) => {
            App.ajaxloaded()
            //handle success
            //console.log(response.data);
            if (response.data.success === false) {
              this._isMounted && this.setState({ error_msg: response.data.msg })
            } else {
              this._isMounted && this.setState({ error_msg: '' })
              this.notify('tr', response.data.msg)
              setTimeout(() => {
                this.props.history.push('clients')
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
  loadData(id) {
    //event.preventDefault();
    //this._isMounted && this.setState({ response: ""});
    //console.log(this.state);
    //console.log(this.state.image);

    const url = REACT_APP_RESTAPI + 'modules/client/client.php'
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
        //console.log(response.data);

        if (response.data.success === true) {
          this._isMounted && this.setState({ name: response.data.name })
          this._isMounted && this.setState({ url: response.data.url })
          this._isMounted && this.setState({ image: response.data.image })
          this._isMounted && this.setState({ image_disp: response.data.image })
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
                  <h1 className="title">Add Client</h1>
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
                                <label htmlFor="inputname4">
                                  Name
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <input
                                  type="hidden"
                                  className="form-control"
                                  id="inputname3"
                                  name="id"
                                  value={this.state.id}
                                  onChange={(e) =>
                                    this.setState({
                                      id: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                                <input
                                  type="text"
                                  className="form-control"
                                  id="inputname4"
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
                                <label htmlFor="inputname5">Website URL</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="inputname5"
                                  name="url"
                                  value={this.state.url}
                                  onChange={(e) =>
                                    this.setState({
                                      url: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>
                              <div className="form-group col-md-12">
                                <Label htmlFor="exampleFile">
                                  Image
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>

                                {this.state.image_disp.map((item, key) => (
                                  <div class="profileimg-input" key={key}>
                                    <img
                                      alt="attachment"
                                      src={REACT_APP_RESTAPI + '' + item.name}
                                      className="img-thumbnail"
                                    />
                                    {/* <div className="title">
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

export default AddClient
