import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col, Label, Input } from 'reactstrap'

import axios from 'axios'
import Parser from 'html-react-parser'
import NotificationAlert from 'react-notification-alert'

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class AddPortfolioMedia extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      title: '',
      brief: '',
      name: '',
      name_disp: '',
      size: '',
      type: '',
      response: '',
      id: '',
      error_msg: '',
    }

    this.onImageChange = this.onImageChange.bind(this)
    this.notify = this.notify.bind(this)
    this.loadData = this.loadData.bind(this)
    this.deleteAttachment = this.deleteAttachment.bind(this)
  }

  onImageChange(e) {
    const files = e.target.files
    //console.log(this.state.name)
    //console.log(files)
    this._isMounted && this.setState(() => ({ name: files[0] }))
  }

  deleteAttachment(e) {
    //var id = e.currentTarget.dataset.id
    // console.log(id)
    // console.log(this.state.name_disp)
    // console.log(this.state.name)
    this._isMounted &&
      this.setState({ name: '', name_disp: '' }, () => {
        // console.log(this.state.name)
      })
  }

  get_old_attachment() {
    var old_name = ''
    if (this.state.name.length > 0) {
      for (var i = this.state.name.length - 1; i >= 0; i--) {
        old_name += this.state.name[i].id + ','
      }
      old_name = old_name.substring(0, old_name.length - 1)
      //console.log(old_name);
    }
    return old_name
  }

  handleFormSubmit(event) {
    event.preventDefault()
    var checkmode = App.check_app_mode(event)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      this._isMounted && this.setState({ response: '' })
      //console.log(this.state);
      //console.log(this.state.name);
      // console.log('--------------')
      // console.log(this.state)
      //console.log(this.state.name);
      // console.log('--------------')

      var allow_submit = false
      if (this.state.name.length === 0) {
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
        var old_name = this.get_old_attachment()

        var getuser = ACL.getUser()

        const url = REACT_APP_RESTAPI + 'modules/file/file.php'
        let user = ACL.getUser()
        let formData = new FormData()
        formData.append('auth_user', user.id)
        formData.append('auth_type', user.usertype)
        formData.append('auth_token', user.token)
        formData.append('action', 'save')
        formData.append('auth_user', getuser.id)
        formData.append('id', this.state.id)
        formData.append('title', this.state.title)
        formData.append('brief', this.state.brief)
        formData.append('name', this.state.name)
        formData.append('old_name', old_name)
        formData.append('module', 'portfolio')
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
              //console.log(response.msg)
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
    //console.log(this.state.name);

    const url = REACT_APP_RESTAPI + 'modules/file/file.php'
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
          this._isMounted && this.setState({ title: response.data.title })
          this._isMounted && this.setState({ brief: response.data.brief })
          this._isMounted && this.setState({ name_disp: response.data.name })
          this._isMounted && this.setState({ name: response.data.name })
          this._isMounted && this.setState({ size: response.data.size })
          this._isMounted && this.setState({ type: response.data.type })
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
                  <h1 className="title">Add Portfolio Media</h1>
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
                                <label htmlFor="inputname5">Title</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="inputname5"
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
                                <Label htmlFor="exampleFile">
                                  Media
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>

                                {this.state.name_disp !== ''
                                  ? Parser(
                                      '<div class="profileimg-input"><img src="' +
                                        REACT_APP_RESTAPI +
                                        this.state.name_disp +
                                        '" class="img-fluid" style="width:120px"></div>',
                                    )
                                  : ''}
                                {this.state.name_disp !== '' ? (
                                  <div>
                                    {/* {this.state.name} ({this.state.size}) (
                                    {this.state.type}){' '} */}
                                    {/* <span
                                      data-id={this.state.id}
                                      onClick={(e) => this.deleteAttachment(e)}
                                    >
                                      Delete
                                    </span> */}
                                  </div>
                                ) : (
                                  ''
                                )}

                                <Input
                                  accept="image/*"
                                  type="file"
                                  id="exampleFile"
                                  name="name"
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

export default AddPortfolioMedia
