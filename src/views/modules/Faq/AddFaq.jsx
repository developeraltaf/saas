import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col, Label, Input } from 'reactstrap'

import axios from 'axios'
//import Parser from 'html-react-parser'
import NotificationAlert from 'react-notification-alert'

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class AddFaq extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      question: '',
      answer: '',
      active: '',
      response: '',
      id: '',
      error_msg: '',
    }

    this.notify = this.notify.bind(this)
    this.loadData = this.loadData.bind(this)
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

      var allow_submit = false
      if (
        this.state.question === '' ||
        this.state.answer === '' ||
        this.state.active === ''
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

        const url = REACT_APP_RESTAPI + 'modules/faq/faq.php'
        let user = ACL.getUser()
        let formData = new FormData()
        formData.append('auth_user', user.id)
        formData.append('auth_type', user.usertype)
        formData.append('auth_token', user.token)
        formData.append('action', 'save')
        formData.append('auth_user', getuser.id)
        formData.append('id', this.state.id)
        formData.append('question', this.state.question)
        formData.append('answer', this.state.answer)
        formData.append('active', this.state.active)
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
                this.props.history.push('faqs')
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

    const url = REACT_APP_RESTAPI + 'modules/faq/faq.php'
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
          this._isMounted && this.setState({ question: response.data.question })
          this._isMounted && this.setState({ answer: response.data.answer })
          this._isMounted && this.setState({ active: response.data.active })
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
                  <h1 className="title">Add Faq</h1>
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
                                  Question
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
                                <Input
                                  type="textarea"
                                  className="form-control"
                                  id="inputname4"
                                  name="question"
                                  value={this.state.question}
                                  onChange={(e) =>
                                    this.setState({
                                      question: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>
                              <div className="form-group col-md-12">
                                <label htmlFor="inputname5">
                                  Answer
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </label>
                                <Input
                                  type="textarea"
                                  className="form-control"
                                  id="inputname5"
                                  name="answer"
                                  value={this.state.answer}
                                  onChange={(e) =>
                                    this.setState({
                                      answer: e.target.value,
                                    })
                                  }
                                  placeholder=""
                                />
                              </div>
                              <div className="form-group col-md-12">
                                <Label htmlFor="inputname6">
                                  Active
                                  <sup className="compulsory" title="Mandatory">
                                    *
                                  </sup>
                                </Label>
                                <Input
                                  type="select"
                                  id="inputname6"
                                  name="active"
                                  value={this.state.active}
                                  onChange={(e) =>
                                    this.setState({
                                      active: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="active">Active</option>
                                  <option value="inactive">Inactive</option>
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

export default AddFaq
