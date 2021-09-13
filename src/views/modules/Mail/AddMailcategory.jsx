import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col, Input } from 'reactstrap'

import axios from 'axios'
//import Parser from 'html-react-parser'
import NotificationAlert from 'react-notification-alert'

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class AddMailcategory extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      name: '',
      slug: '',
      brief: '',
      response: '',
      id: '',
      error_msg: '',
    }

    this.notify = this.notify.bind(this)
    this.loadData = this.loadData.bind(this)
  }

  handleFormSubmit(event) {
    event.preventDefault()
    this._isMounted && this.setState({ response: '' })
    //console.log(this.state);
    //console.log(this.state.image);

    // console.log('--------------')
    // console.log(this.state)
    //console.log(this.state.attachment);
    // console.log('--------------')

    var allow_submit = false
    if (this.state.name === '' || this.state.slug === '') {
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
      var getuser = ACL.getUser()

      const url = REACT_APP_RESTAPI + 'modules/mail/mailcategory.php'
      let user = ACL.getUser()
      let formData = new FormData()
      formData.append('auth_user', user.id)
      formData.append('auth_type', user.usertype)
      formData.append('auth_token', user.token)
      formData.append('action', 'save')
      formData.append('id', this.state.id)
      formData.append('name', this.state.name)
      formData.append('slug', this.state.slug)
      formData.append('brief', this.state.brief)
      formData.append('auth_user', getuser.id)
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
              this.props.history.push('mailcategories')
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

    const url = REACT_APP_RESTAPI + 'modules/mail/mailcategory.php'
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
          this._isMounted && this.setState({ slug: response.data.slug })
          this._isMounted && this.setState({ brief: response.data.brief })
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
                  <h1 className="title">Add Mail Category</h1>
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
                                <label htmlFor="inputname41">
                                  URL Slug
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="inputname41"
                                  name="slug"
                                  value={this.state.slug}
                                  onChange={(e) =>
                                    this.setState({
                                      slug: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>
                              <div className="form-group col-md-12">
                                <label htmlFor="inputname5">
                                  Brief Description
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

export default AddMailcategory
