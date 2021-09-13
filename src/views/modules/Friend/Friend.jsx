import React from 'react'
import { ACL } from 'components'
import { App } from 'components'
//
import {
  Row,
  Col,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
// //
import axios from 'axios'
import NotificationAlert from 'react-notification-alert'

//var IMGDIR = process.env.REACT_APP_IMGDIR;

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Friend extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      fetch: [],
      error: null,
      isLoaded: false,
      userslist: [],
      useridname: [],
      user_id: '',
      friendby: [],
      friendto: [],
      bulkaction: '',
      bulkaction_msg: '',
      modal: false,
    }
    this.fetchUsers = this.fetchUsers.bind(this)
    this.onChangeUser = this.onChangeUser.bind(this)
    this.fetch_friends = this.fetch_friends.bind(this)
    this.toggleFriend = this.toggleFriend.bind(this)
    this.change_button = this.change_button.bind(this)
    this.notify = this.notify.bind(this)
    this.bulkAction = this.bulkAction.bind(this)
    this.performAction = this.performAction.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  async componentDidMount() {
    this._isMounted = true
    this.fetchUsers()
  }

  toggleFriend(e) {
    e.preventDefault()
    var checkmode = App.check_app_mode(e)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      var id = e.currentTarget.dataset.id
      var action = e.currentTarget.dataset.action
      // console.log(this.state.user_id + ': ' + action + ': ' + id)

      var getuser = ACL.getUser()

      const url = REACT_APP_RESTAPI + 'modules/friend/friend.php'
      let user = ACL.getUser()
      let formData = new FormData()
      formData.append('auth_user', user.id)
      formData.append('auth_type', user.usertype)
      formData.append('auth_token', user.token)
      formData.append('action', 'toggle')
      formData.append('effect', action)
      formData.append('auth_user', getuser.id)

      if (action === 'send_friend_request') {
        formData.append('friendby', this.state.user_id)
        formData.append('friendto', id)
        formData.append('status', 'pending')
      } else if (action === 'delete_friend_request') {
        formData.append('friendby', this.state.user_id)
        formData.append('friendto', id)
        formData.append('status', 'pending')
      } else if (action === 'accept_friend_request') {
        formData.append('friendby', id)
        formData.append('friendto', this.state.user_id)
        formData.append('status', 'accept')
      } else if (action === 'reject_friend_request') {
        formData.append('friendby', id)
        formData.append('friendto', this.state.user_id)
        formData.append('status', 'pending')
      } else if (action === 'delete_friend') {
        formData.append('friend1', this.state.user_id)
        formData.append('friend2', id)
        formData.append('status', 'accept')
      }

      axios({
        method: 'post',
        url: url,
        data: formData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
      })
        .then((response) => {
          // console.log(response.data)

          if (response.data.success === true) {
            var userstr =
              this.state.useridname[this.state.user_id]['name'] +
              ' (' +
              this.state.useridname[this.state.user_id]['username'] +
              ')'
            var idstr =
              this.state.useridname[id]['name'] +
              ' (' +
              this.state.useridname[id]['username'] +
              ')'

            if (action === 'send_friend_request') {
              this.change_button(id, action)
              this.notify(
                'tr',
                userstr +
                  ' has sent friend request to ' +
                  idstr +
                  ' successfully',
              )
            } else if (action === 'delete_friend_request') {
              this.change_button(id, action)
              this.notify(
                'tr',
                userstr + ' has deleted friend request to ' + idstr + '',
              )
            } else if (action === 'accept_friend_request') {
              this.change_button(id, action)
              this.notify(
                'tr',
                userstr +
                  ' has accepted friend request of ' +
                  idstr +
                  ' successfully',
              )
            } else if (action === 'reject_friend_request') {
              this.change_button(id, action)
              this.notify(
                'tr',
                userstr +
                  ' has rejected friend request of ' +
                  idstr +
                  ' successfully',
              )
            } else if (action === 'delete_friend') {
              this.change_button(id, action)
              this.notify('tr', userstr + ' is not friend of ' + idstr + '')
            }
            //this._isMounted && this.setState({ star_toggle: true });
            //console.log("success"+this.state.star_toggle);
            //console.log(e.currentTarget.classList);
          }
        })
        .catch(function (response) {
          //handle error
          //console.log(response)
        })
    } // end check mode
  }

  change_button(id, txt) {
    // console.log('-----||------')
    // console.log(id + ' ' + txt)
    // console.log('friendby')
    // console.log(this.state.friendby)
    // console.log('friendto')
    // console.log(this.state.friendto)
    // console.log('-----||------')

    if (txt === 'send_friend_request') {
      // add pending id in friendy state
      var joined = this.state.friendby.concat(id + '-pending')
      this._isMounted && this.setState({ friendby: joined })
    } else if (txt === 'delete_friend_request') {
      // delete pending id in friendy state
      this.setState({
        friendby: this.state.friendby.filter(function (userid) {
          return id + '-pending' !== userid
        }),
      })
    } else if (txt === 'accept_friend_request') {
      // remove pending id in friendto state
      this.setState({
        friendto: this.state.friendto.filter(function (userid) {
          return id + '-pending' !== userid
        }),
      })
      // add accept id in friendto state
      joined = this.state.friendto.concat(id + '-accept')
      this._isMounted && this.setState({ friendto: joined })
    } else if (txt === 'reject_friend_request') {
      // delete pending id in friento state
      this.setState({
        friendto: this.state.friendto.filter(function (userid) {
          return id + '-pending' !== userid
        }),
      })
    } else if (txt === 'delete_friend') {
      // remove accept id in friendto state
      this.setState({
        friendto: this.state.friendto.filter(function (userid) {
          return id + '-accept' !== userid
        }),
      })
      // remove accept id in friendby state
      this.setState({
        friendby: this.state.friendby.filter(function (userid) {
          return id + '-accept' !== userid
        }),
      })
    }

    // console.log('======||=======')
    // console.log('friendby')
    // console.log(this.state.friendby)
    // console.log('friendto')
    // console.log(this.state.friendto)
    // console.log('=======||=======')
  }

  fetchUsers() {
    const url1 = REACT_APP_RESTAPI + 'modules/user/user.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-all')
    formData.append('format', 'useridname')
    formData.append('active', '1')
    //formData.append('addfield', 'checked')

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
        // console.log(response.data.useridname)
        this._isMounted &&
          this.setState({
            userslist: response.data.items,
            useridname: response.data.useridname,
            isLoaded: true,
          })
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
      })
  }

  onChangeUser(e) {
    // console.log(e.target.value)
    this._isMounted &&
      this.setState({ user_id: e.target.value, bulkaction: '' }, () => {
        this.fetch_friends()
      })
  }

  fetch_friends() {
    //this.fetchUsers();

    const url1 = REACT_APP_RESTAPI + 'modules/friend/friend.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-user')
    formData.append('friendby', this.state.user_id)
    formData.append('friendto', this.state.user_id)
    axios({
      method: 'post',
      url: url1,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        // console.log('--------Friendby--------')
        this._isMounted && this.setState({ friendby: [] })
        // console.log(response.data.friendby)
        for (var f = response.data.friendby.length - 1; f >= 0; f--) {
          //console.log("---"+response.data.friendby[f].friendto);
          var joined = this.state.friendby.concat(
            response.data.friendby[f].friendto +
              '-' +
              response.data.friendby[f].status,
          )
          this._isMounted && this.setState({ friendby: joined })
        }
        // console.log(this.state.friendby)

        // console.log('-------Friendto---------')
        this._isMounted && this.setState({ friendto: [] })
        // console.log(response.data.friendto)
        for (f = response.data.friendto.length - 1; f >= 0; f--) {
          //console.log("---"+response.data.friendto[f].friendby);
          joined = this.state.friendto.concat(
            response.data.friendto[f].friendby +
              '-' +
              response.data.friendto[f].status,
          )
          this._isMounted && this.setState({ friendto: joined })
        }
        // console.log(this.state.friendto)
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
      })
  }

  bulkAction(e) {
    e.preventDefault()
    var action = e.target.value
    //console.log(action);

    var msg = ''
    if (action === 'send_all_friend_request') {
      msg = 'Are you sure you want to Send All Friend Requests?'
    } else if (action === 'delete_all_friend_request') {
      msg = 'Are you sure you want to Delete All Friend Requests?'
    } else if (action === 'accept_all_friend_request') {
      msg = 'Are you sure you want to Accept All Friend Requests?'
    } else if (action === 'reject_all_friend_request') {
      msg = 'Are you sure you want to Reject All Friend Requests?'
    } else if (action === 'delete_all_friend') {
      msg = 'Are you sure you want to Delete All Friends?'
    }
    //return item;
    //console.log(action);
    //console.log(ids);
    if (this.state.user_id !== '') {
      if (action !== '' && action !== '0') {
        this._isMounted &&
          this.setState({
            bulkaction: action,
            bulkaction_msg: msg,
            modal: !this.state.modal,
          })
      } else if (action === '0') {
        this._isMounted &&
          this.setState({
            bulkaction: '',
          })
      }
    } else {
      this._isMounted &&
        this.setState({
          bulkaction: '',
        })
    }
  }

  toggle(e) {
    var action = e.currentTarget.dataset.id
    if (action === 'submit') {
      var bulkaction = this.state.bulkaction
      // console.log('--------------------')
      // console.log(bulkaction)
      this.performAction(bulkaction, e)
    } else if (action === 'cancel') {
      this._isMounted &&
        this.setState({
          bulkaction: '',
        })
    }
    this._isMounted &&
      this.setState({
        modal: !this.state.modal,
      })
  }

  performAction(effect, e) {
    var checkmode = App.check_app_mode(e)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      App.ajaxloading()
      // console.log(effect)

      var getuser = ACL.getUser()

      const url1 = REACT_APP_RESTAPI + 'modules/friend/friend.php'
      let user = ACL.getUser()
      let formData = new FormData()
      formData.append('auth_user', user.id)
      formData.append('auth_type', user.usertype)
      formData.append('auth_token', user.token)
      formData.append('action', 'bulk')
      formData.append('effect', effect)
      formData.append('auth_user', getuser.id)
      formData.append('user_id', this.state.user_id)
      formData.append('user_friendby', this.state.friendby)
      formData.append('user_friendto', this.state.friendto)
      axios({
        method: 'post',
        url: url1,
        data: formData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
      })
        .then((response) => {
          App.ajaxloaded()
          // console.log('-------||---------')
          // console.log(response.data)
          if (response.data.success === true) {
            var userstr =
              this.state.useridname[this.state.user_id]['name'] +
              ' (' +
              this.state.useridname[this.state.user_id]['username'] +
              ')'

            if (effect === 'send_all_friend_request') {
              this.notify(
                'tr',
                userstr + ' has sent friend request to all users',
              )
            } else if (effect === 'delete_all_friend_request') {
              this.notify('tr', userstr + ' has deleted all friend requests.')
            } else if (effect === 'accept_all_friend_request') {
              this.notify('tr', userstr + ' has accepted all friend requests.')
            } else if (effect === 'reject_all_friend_request') {
              this.notify('tr', userstr + ' has rejected all friend requests.')
            } else if (effect === 'delete_all_friend') {
              this.notify('tr', userstr + ' has deleted all friends.')
            }

            this._isMounted &&
              this.setState({
                bulkaction: '',
              })
            // Re-fetch friends list
            this.fetch_friends()
          }
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
        </div>
      ),
      type: type,
      icon: '',
      autoDismiss: 5,
    }
    this.refs.notificationAlert.notificationAlert(options)
  }
  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    //const {records, isLoading} = this.state;
    const { error, isLoaded } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div></div>
    } else {
      var tableRowList = []
      var button = ''
      var button2 = ''
      var buttonid = ''
      var button2id = ''
      var all_buttons = []
      all_buttons['send_friend_request'] = 'Send Friend Request'
      all_buttons['delete_friend_request'] = 'Delete Friend Request'
      all_buttons['accept_friend_request'] = 'Accept Friend Request'
      all_buttons['reject_friend_request'] = 'Reject Friend Request'
      all_buttons['delete_friend'] = 'Delete Friend'

      this.state.userslist.map((item, i) => {
        if (item.id !== this.state.user_id) {
          buttonid = 'send_friend_request'
          button = all_buttons[buttonid]

          button2id = ''
          button2 = ''

          if (this.state.friendby.indexOf(item.id + '-pending') > -1) {
            buttonid = 'delete_friend_request'
            button = all_buttons[buttonid]
            button2id = ''
            button2 = ''
          }
          if (this.state.friendto.indexOf(item.id + '-pending') > -1) {
            buttonid = 'accept_friend_request'
            button = all_buttons[buttonid]
            button2id = 'reject_friend_request'
            button2 = all_buttons[button2id]
          }
          if (this.state.friendby.indexOf(item.id + '-accept') > -1) {
            buttonid = 'delete_friend'
            button = all_buttons[buttonid]
            button2id = ''
            button2 = ''
          }
          if (this.state.friendto.indexOf(item.id + '-accept') > -1) {
            buttonid = 'delete_friend'
            button = all_buttons[buttonid]
            button2id = ''
            button2 = ''
          }

          /*var image = item.image.name;
                if(item.image.name === ""){
                    image = "images/user-bg.jpg";
                }*/

          //var itemid = item.id
          let filename = App.get_display_filename(item.image, 'thumb')

          tableRowList.push(
            <div
              className="col-12 col-xl-6 col-lg-12 col-md-12 col-sm-12"
              id={'thread-row-' + item.id}
              key={i}
            >
              <div className="user-row">
                <div className="user-img user-col">
                  <img
                    src={App.filename_url(filename)}
                    alt="user avatar"
                    className="avatar-image img-inline"
                  />
                </div>
                <div className="user-name user-col">{item.name}</div>
                <div className="user-actions user-col">
                  <Button
                    color="primary"
                    className="btn-xs btn"
                    id={'toggle-button-' + item.id}
                    data-id={item.id}
                    data-action={buttonid}
                    onClick={(e) => this.toggleFriend(e)}
                  >
                    {button}
                  </Button>
                  {button2id !== '' ? (
                    <Button
                      color="primary"
                      className="btn-xs btn button2"
                      id={'toggle-button-' + item.id}
                      data-id={item.id}
                      data-action={button2id}
                      onClick={(e) => this.toggleFriend(e)}
                    >
                      {button2}
                    </Button>
                  ) : (
                    ''
                  )}
                </div>
                <div className="divider"></div>
              </div>
            </div>,
          )
        }
        return ''
      })

      return (
        <div>
          <div className="content mail_list ">
            <div className="notification-popup">
              <NotificationAlert ref="notificationAlert" />
            </div>

            <div>
              <Modal
                isOpen={this.state.modal}
                toggle={this.toggle}
                className={this.props.className}
              >
                <ModalHeader toggle={this.toggle}>Confirm Action</ModalHeader>
                <ModalBody>{this.state.bulkaction_msg}</ModalBody>
                <ModalFooter>
                  <Button
                    className="btn btn-sm"
                    color="primary"
                    data-id="submit"
                    onClick={this.toggle}
                  >
                    Submit
                  </Button>{' '}
                  <Button
                    className="btn btn-sm"
                    color="secondary"
                    data-id="cancel"
                    onClick={this.toggle}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
            </div>

            <Row>
              <Col xs={12} md={12}>
                <div className="page-title">
                  <div className="float-left">
                    <h1 className="title">Friends</h1>
                  </div>
                </div>

                <div className="col-xl-12">
                  <section className="box ">
                    <header className="panel_header">
                      <h2 className="title float-left">User Friends</h2>
                    </header>
                    <div className="content-body">
                      <div className="row">
                        <div className="col-8">
                          <div className="form-group">
                            <Label htmlFor="inputname6">
                              Load Friends of User
                            </Label>
                            <Input
                              className="select-user"
                              type="select"
                              id="inputname6"
                              name="user_id"
                              value={this.state.user_id}
                              onChange={(e) => this.onChangeUser(e)}
                            >
                              <option value="">Select</option>
                              {this.state.userslist.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </Input>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="form-group">
                            <Label htmlFor="inputname6">Bulk Actions</Label>
                            <Input
                              type="select"
                              data-id="bulkaction"
                              name="bulkaction"
                              value={this.state.bulkaction}
                              onChange={(e) => this.bulkAction(e)}
                            >
                              <option value="0">Select</option>
                              <option value="send_all_friend_request">
                                Send Friend Request to All
                              </option>
                              <option value="delete_all_friend_request">
                                Delete All Friend Requests
                              </option>
                              <option value="accept_all_friend_request">
                                Accept All Friend Requests
                              </option>
                              <option value="reject_all_friend_request">
                                Reject All Friend Requests
                              </option>
                              <option value="delete_all_friend">
                                Delete All Friends
                              </option>
                            </Input>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="user-connect row">
                            {this.state.user_id === '' ? (
                              <div className="col-12">
                                Please select a user above to load friends of.
                              </div>
                            ) : (
                              tableRowList
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )
    }
  }
}

export default Friend

//{items.map(item => (
//<li key={item.name}>
// {item.name} {item.position}
//</li>
//))}

//  {this.state.fetch.map(item => (
//    <li key={item.name}>
//      {item.name} {item.position}
//    </li>
//  ))}
