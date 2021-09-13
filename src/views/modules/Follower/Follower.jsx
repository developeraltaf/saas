import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

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

import axios from 'axios'
import NotificationAlert from 'react-notification-alert'

//var IMGDIR = process.env.REACT_APP_IMGDIR;

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Follower extends React.Component {
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
      followers: [],
      isAllSelected: false,
      bulkaction: '',
      bulkaction_ids: '',
      bulkaction_msg: '',
      modal: false,
    }
    this.fetchUsers = this.fetchUsers.bind(this)
    this.onChangeUser = this.onChangeUser.bind(this)
    this.fetch_followers = this.fetch_followers.bind(this)
    this.toggleFollow = this.toggleFollow.bind(this)
    this.change_button = this.change_button.bind(this)
    this.notify = this.notify.bind(this)
    this.onCheckBoxChange = this.onCheckBoxChange.bind(this)
    this.bulkAction = this.bulkAction.bind(this)
    this.performAction = this.performAction.bind(this)
    this.toggle = this.toggle.bind(this)
    this.uncheckAll = this.uncheckAll.bind(this)
  }

  async componentDidMount() {
    this._isMounted = true
    this.fetchUsers()
  }

  toggleFollow(e) {
    e.preventDefault()
    var checkmode = App.check_app_mode(e)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      var id = e.currentTarget.dataset.id
      var action = e.currentTarget.dataset.action
      // console.log(this.state.user_id + ': ' + action + ': ' + id)

      var getuser = ACL.getUser()

      const url = REACT_APP_RESTAPI + 'modules/follower/follower.php'
      let user = ACL.getUser()
      let formData = new FormData()
      formData.append('auth_user', user.id)
      formData.append('auth_type', user.usertype)
      formData.append('auth_token', user.token)
      formData.append('action', 'toggle')
      formData.append('follower', this.state.user_id)
      formData.append('followed', id)
      formData.append('effect', action)
      formData.append('auth_user', getuser.id)
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

            if (action === 'Follow') {
              this.change_button(id, 'add')
              this.notify('tr', userstr + ' is following ' + idstr)
            } else if (action === 'Unfollow') {
              this.change_button(id, 'remove')
              this.notify('tr', userstr + ' unfollowed ' + idstr + '')
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

  change_button(id, type) {
    if (type === 'remove') {
      // remove this id from followers state
      this.setState({
        followers: this.state.followers.filter(function (userid) {
          return id !== userid
        }),
      })
    } else if (type === 'add') {
      // add this id in followers state
      var joined = this.state.followers.concat(id)
      this._isMounted && this.setState({ followers: joined })
    }
    // console.log(this.state.followers)
    //document.getElementById('toggle-button-'+id).innerHTML = txt;
    //document.getElementById('toggle-button-'+id).setAttribute("data-action",txt);
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
    formData.append('addfield', 'checked')

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
      this.setState({ user_id: e.target.value }, () => {
        this.fetch_followers()
      })
  }

  fetch_followers() {
    const url1 = REACT_APP_RESTAPI + 'modules/follower/follower.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-user')
    formData.append('follower', this.state.user_id)
    axios({
      method: 'post',
      url: url1,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        //console.log("----------------");
        this._isMounted && this.setState({ followers: [] })
        // console.log(response.data.items)
        for (var f = response.data.items.length - 1; f >= 0; f--) {
          //console.log("---"+response.data.items[f].followed);
          var joined = this.state.followers.concat(
            response.data.items[f].followed,
          )
          this._isMounted && this.setState({ followers: joined })
        }
        this.uncheckAll()
        // console.log(this.state.followers)
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
      })
  }

  onCheckBoxChange(e) {
    var checkName = e.currentTarget.dataset.id
    var isChecked = e.target.checked
    //console.log(checkName+isChecked);

    let isAllChecked = checkName === 'all' && isChecked
    let isAllUnChecked = checkName === 'all' && !isChecked
    const checked = isChecked
    //console.log(checked);

    const userslist = this.state.userslist.map((item, index) => {
      if (isAllChecked || item.id === checkName) {
        return Object.assign({}, item, {
          checked,
        })
      } else if (isAllUnChecked) {
        return Object.assign({}, item, {
          checked: false,
        })
      }
      return item
    })

    let isAllSelected =
      userslist.findIndex((item) => item.checked === false) === -1 ||
      isAllChecked

    this._isMounted &&
      this.setState({
        userslist,
        isAllSelected,
      })
    this._isMounted && this.setState({ bulkaction: '' })
  }
  uncheckAll() {
    //var checkName = e.currentTarget.dataset.id;
    //var isChecked = e.target.checked;
    //console.log(checkName+isChecked);

    //let isAllChecked = false //(checkName === 'all' && isChecked);
    let isAllUnChecked = true //(checkName === 'all' && !isChecked);
    //const checked = false //isChecked;
    //console.log(checked);

    const userslist = this.state.userslist.map((item, index) => {
      if (isAllUnChecked) {
        return Object.assign({}, item, {
          checked: false,
        })
      }
      return item
    })

    let isAllSelected = false //(userslist.findIndex((item) => item.checked === false) === -1) || isAllChecked;

    this._isMounted &&
      this.setState({
        userslist,
        isAllSelected,
      })
    this._isMounted && this.setState({ bulkaction: '' })
  }

  bulkAction(e) {
    e.preventDefault()
    var action = e.target.value
    //console.log(action);

    var ids = ''
    this.state.userslist.map((item, index) => {
      //console.log(item.id+": "+item.checked);
      if (item.checked) {
        //console.log("---"+item.id);
        ids += item.id + ','
      }
      return ''
    })

    var msg = ''
    if (action === 'follow') {
      msg = 'Are you sure you want to follow selected users?'
    } else if (action === 'unfollow') {
      msg = 'Are you sure you want to unfollow selected users?'
    }
    //return item;
    //console.log(action);
    //console.log(ids);

    if (ids !== '' && action !== '' && action !== '0') {
      this._isMounted &&
        this.setState({
          bulkaction: action,
          bulkaction_ids: ids,
          bulkaction_msg: msg,
          modal: !this.state.modal,
        })
    } else if (action === '0') {
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
      var ids = this.state.bulkaction_ids
      // console.log('--------------------')
      // console.log(bulkaction)
      // console.log(ids)
      this.performAction(bulkaction, ids, e)
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

  performAction(effect, ids, e) {
    var checkmode = App.check_app_mode(e)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      App.ajaxloading()
      // console.log(effect)
      // console.log(ids)

      var getuser = ACL.getUser()

      const url1 = REACT_APP_RESTAPI + 'modules/follower/follower.php'
      let user = ACL.getUser()
      let formData = new FormData()
      formData.append('auth_user', user.id)
      formData.append('auth_type', user.usertype)
      formData.append('auth_token', user.token)
      formData.append('action', 'bulk')
      formData.append('effect', effect)
      formData.append('followed', ids)
      formData.append('follower', this.state.user_id)
      formData.append('auth_user', getuser.id)
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

            if (effect === 'follow') {
              this.notify('tr', userstr + ' is now following selected users')
            } else if (effect === 'unfollow') {
              this.notify('tr', userstr + ' has unfollowed selected users')
            }

            // Re-fetch followers list
            this.fetch_followers()
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

      this.state.userslist.map((item, i) => {
        if (item.id !== this.state.user_id) {
          button = 'Follow'
          if (this.state.followers.indexOf(item.id) > -1) {
            button = 'Unfollow'
          }
          // var image = item.image.name
          // if (item.image.name === '') {
          //   image = 'images/user-bg.jpg'
          // }
          let filename = App.get_display_filename(item.image, 'thumb')

          var itemid = item.id
          var itemchecked = '' //item.checked;

          if (item.checked === 'false') {
            itemchecked = false
          } else {
            itemchecked = item.checked
          }

          tableRowList.push(
            <div
              className="col-12 col-xl-6 col-lg-12 col-md-12 col-sm-12"
              id={'thread-row-' + item.id}
              key={i}
            >
              <div className="user-row">
                <div className="user-check user-col">
                  <div key={i}>
                    <label>
                      <input
                        name={itemid}
                        type="checkbox"
                        data-id={itemid}
                        value={itemid}
                        checked={itemchecked || false}
                        onChange={(e) => this.onCheckBoxChange(e)}
                      />
                    </label>
                  </div>
                </div>
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
                    className="btn-sm btn"
                    id={'toggle-button-' + item.id}
                    data-id={item.id}
                    data-action={button}
                    onClick={(e) => this.toggleFollow(e)}
                  >
                    {button}
                  </Button>
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
                    <h1 className="title">Follower</h1>
                  </div>
                </div>

                <div className="col-xl-12">
                  <section className="box ">
                    <header className="panel_header">
                      <h2 className="title float-left">User Followers</h2>
                    </header>
                    <div className="content-body">
                      <div className="row">
                        <div className="col-8">
                          <div className="form-group">
                            <Label htmlFor="inputname6">
                              Load Followers of User
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
                            <Label htmlFor="inputname6">Bulk Action</Label>
                            <Input
                              type="select"
                              data-id="bulkaction"
                              name="bulkaction"
                              value={this.state.bulkaction}
                              onChange={(e) => this.bulkAction(e)}
                            >
                              <option value="0">Select</option>
                              <option value="follow">
                                Follow selected Users
                              </option>
                              <option value="unfollow">
                                Unfollow selected Users
                              </option>
                            </Input>
                          </div>
                        </div>
                        <div className="col-12">
                          {this.state.user_id !== '' ? (
                            <div className="form-group">
                              <label className="user-select-all">
                                <input
                                  name={'select-all'}
                                  type="checkbox"
                                  data-id={'all'}
                                  value={'all'}
                                  checked={this.state.isAllSelected || false}
                                  onChange={(e) => this.onCheckBoxChange(e)}
                                />
                                {'Select all'}
                              </label>
                            </div>
                          ) : (
                            ''
                          )}
                          <div className="user-connect row user-follower">
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

export default Follower

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
