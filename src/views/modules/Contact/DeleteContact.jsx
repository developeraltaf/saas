import React from 'react'
import { ACL } from 'components'
//import { App } from 'components'

import { Row, Col } from 'reactstrap'

import axios from 'axios'
import NotificationAlert from 'react-notification-alert'

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class DeleteContact extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      name: '',
      position: '',
      gender: '',
      image: '',
      image_disp: '',
      response: '',
      id: '',
    }

    this.notify = this.notify.bind(this)
    this.deleteData = this.deleteData.bind(this)
  }

  /*
    handleFormSubmit( event ) {
        event.preventDefault();
        this._isMounted && this.setState({ response: ""});
        //console.log(this.state);
        //console.log(this.state.image);

        const url = REACT_APP_RESTAPI + 'modules/contact/contact.php';
        let user = ACL.getUser();
            let formData = new FormData();
            formData.append("auth_user", user.id);
            formData.append("auth_type", user.usertype);
            formData.append("auth_token", user.token);
        formData.append('action', 'save')
        formData.append('id', this.state.id)
        formData.append('name', this.state.name)
        formData.append('position', this.state.position)
        formData.append('gender', this.state.gender)
        formData.append('image', this.state.image)
        axios({
                    method: 'post',
                    url: url,
                    data: formData,
                    config: { headers: {'Content-Type': 'multipart/form-data' }}
                })
                .then((response) => {
                    //handle success
                    //console.log(response.data);
                    this._isMounted && this.setState({ response: response.data });
                    this.notify("tr",response.data);
                    setTimeout(() => {
                        this.props.history.push('contacts');
                    }, 2000);
                })
                .catch(function (response) {
                    //handle error
                    //console.log(response)
                });
    }*/

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
      this.deleteData(getid)
    } else {
      //console.log("false");
    }
  }
  deleteData(id) {
    //event.preventDefault();
    //this._isMounted && this.setState({ response: ""});
    //console.log(this.state);
    //console.log(this.state.image);

    const url = REACT_APP_RESTAPI + 'modules/contact/contact.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'delete')
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
          this.notify('tr', response.data.msg)
          setTimeout(() => {
            this.props.history.push('contacts')
          }, 2000)
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
                  <h1 className="title">Delete Contact</h1>
                </div>
              </div>

              <div className="notification-popup">
                <NotificationAlert ref="notificationAlert" />
              </div>

              <div className="row margin-0">
                <div className="col-12">
                  <section className="box ">
                    <header className="panel_header">
                      <h2 className="title float-left">Perform Delete</h2>
                    </header>
                    <div className="content-body">
                      <div className="row">
                        <div className="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-8">
                          Deleting Contact ID: {this.state.id}
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

export default DeleteContact
