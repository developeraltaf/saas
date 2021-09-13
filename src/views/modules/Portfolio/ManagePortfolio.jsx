import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col, Input } from 'reactstrap'

import axios from 'axios'
// import Parser from 'html-react-parser'
import NotificationAlert from 'react-notification-alert'

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class ManagePortfolio extends React.Component {
  constructor(props) {
    super(props)

    this._isMounted = false
    this.state = {
      error_msg: '',
      response: '',
      id: '',
      cover_image: '',
      attachment: [],
    }

    this.onDataChange = this.onDataChange.bind(this)
    this.notify = this.notify.bind(this)
    this.loadData = this.loadData.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.onCheckBoxChange = this.onCheckBoxChange.bind(this)
  }

  onCheckBoxChange(e) {
    var checkId = e.currentTarget.dataset.id
    //var isChecked = e.target.checked
    // console.log(checkId + isChecked)

    this._isMounted &&
      this.setState(
        {
          cover_image: checkId,
        },
        () => {
          // console.log(this.state.cover_image)
        },
      )
  }
  onDataChange(e) {
    // console.log(this.state.attachment)
    var value = e.target.value
    var id = e.currentTarget.dataset.id
    var field = e.currentTarget.dataset.field
    // console.log(id + ': ' + value + ': ' + field)
    var param = field

    const attachment = this.state.attachment.map((item, index) => {
      //console.log("id: "+item.id+" "+id+" ");
      if (item.id === id) {
        return Object.assign({}, item, {
          [param]: value,
        })
      }
      return item
    })

    this._isMounted &&
      this.setState(
        {
          attachment,
        },
        () => {
          // console.log(this.state.attachment)
        },
      )
  }

  handleFormSubmit(event) {
    event.preventDefault()
    var checkmode = App.check_app_mode(event)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      App.ajaxloading()
      this._isMounted && this.setState({ response: '' })
      // console.log(this.state)

      const url = REACT_APP_RESTAPI + 'modules/portfolio/portfolio.php'
      let user = ACL.getUser()
      let formData = new FormData()
      formData.append('auth_user', user.id)
      formData.append('auth_type', user.usertype)
      formData.append('auth_token', user.token)

      formData.append('action', 'save-attachment')
      formData.append('id', this.state.id)
      formData.append('cover_image', this.state.cover_image)

      for (let i = 0; i < this.state.attachment.length; i++) {
        //var obj = this.state.attachment[i]
        var str =
          this.state.attachment[i].id +
          '|#|#|' +
          this.state.attachment[i].title +
          '|#|#|' +
          this.state.attachment[i].brief
        formData.append('attachment[]', str)
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
          this._isMounted && this.setState({ response: response.data.msg })
          if (response.data.success === true) {
            this.notify('tr', response.data.msg)
            setTimeout(() => {
              this.props.history.push('portfolios')
            }, 2000)
          }
          //this._isMounted && this.setState({ response: response.data });
        })
        .catch(function (response) {
          App.ajaxloaded()
          //handle error
          //console.log(response)
        })
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

    const url = REACT_APP_RESTAPI + 'modules/portfolio/portfolio.php'
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
              attachment: response.data.attachment,
              cover_image: response.data.cover_image,
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
                  <h1 className="title">Manage Portfolio</h1>
                </div>
              </div>

              <div className="notification-popup">
                <NotificationAlert ref="notificationAlert" />
              </div>

              <div className="row margin-0">
                <div className="col-12">
                  <section className="box ">
                    <header className="panel_header">
                      <h2 className="title float-left">Portfolio Media</h2>
                    </header>
                    <div className="content-body">
                      <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                          <form>
                            <div className="form-group manage-wrap row">
                              {this.state.attachment.map((item, key) => (
                                <div
                                  className="profileimg-input col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6"
                                  key={key}
                                >
                                  <div className="file-img">
                                    <img
                                      alt="attachment"
                                      src={REACT_APP_RESTAPI + '' + item.name}
                                      className="img-thumbnail"
                                    />
                                  </div>
                                  <div className="file-info">
                                    <div className="file-title">
                                      {/* {item.id}
																		{item.name} ({item.size}) ({item.type}) */}
                                      <input
                                        type="text"
                                        name=""
                                        data-id={item.id}
                                        data-field={'title'}
                                        value={item.title}
                                        onChange={this.onDataChange.bind(this)}
                                      />
                                    </div>
                                    <div className="file-desc">
                                      <Input
                                        type="textarea"
                                        name=""
                                        data-id={item.id}
                                        data-field={'brief'}
                                        value={item.brief}
                                        onChange={this.onDataChange.bind(this)}
                                      />
                                    </div>
                                    <div className="file-cover">
                                      <label htmlFor={'file-item-' + item.id}>
                                        <input
                                          id={'file-item-' + item.id}
                                          type="checkbox"
                                          name=""
                                          data-id={item.id}
                                          value={item.id}
                                          checked={
                                            this.state.cover_image === item.id
                                              ? true
                                              : false
                                          }
                                          onChange={(e) =>
                                            this.onCheckBoxChange(e)
                                          }
                                        />
                                        Make Portfolio Cover
                                      </label>
                                    </div>
                                  </div>
                                  <div className="divider"></div>
                                </div>
                              ))}
                            </div>

                            {this.state.attachment.length > 0 ? (
                              <div>
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
                              </div>
                            ) : (
                              'No Files found in this portfolio'
                            )}
                            {this.state.response}
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

export default ManagePortfolio
