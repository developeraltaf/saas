import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
} from 'reactstrap'
//import { NavLink } from 'react-router-dom'
import NotificationAlert from 'react-notification-alert'
import axios from 'axios'

//var BASEDIR = process.env.REACT_APP_BASEDIR

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Mailcategory extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      user_id: '',
      dropdownOpen: false,
      catslist: [],
      thread_id: '',
    }
    this.toggledd = this.toggledd.bind(this)
    this.fetchCategories = this.fetchCategories.bind(this)
    this.savecatdd = this.savecatdd.bind(this)
    this.oncatddCheck = this.oncatddCheck.bind(this)
  }

  fetchCategories() {
    const url1 = REACT_APP_RESTAPI + 'modules/mail/mailcategory.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-all')
    formData.append('addfield', 'checked')
    formData.append('id', '')
    axios({
      method: 'post',
      url: url1,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        // console.log('----------------')
        // console.log('----------------')
        // console.log(response.data.items)
        this._isMounted &&
          this.setState({ catslist: response.data.items }, () => {
            // console.log('|||||||||')
            // console.log(this.state.catslist)
          })
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
      })
  }

  toggledd() {
    /*this.setState(prevState => ({
          dropdownOpen: true
        }));*/

    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }))
  }

  savecatdd(e) {
    var checkmode = App.check_app_mode(e)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      var user_id = this.state.user_id
      var ids = ''
      if (this.props.type === 'multiple_thread') {
        this.props.mailitems.map((item, index) => {
          //console.log(item.id+": "+item.checked);
          if (item.checked) {
            //console.log("---"+item.id);
            ids += item.id + ','
          }
          return ''
        })
      }
      if (this.props.type === 'single_thread') {
        ids = this.state.thread_id
      }

      var idsstr = ''
      this.state.catslist.map((item, index) => {
        //console.log(item.id+": "+item.checked);
        if (item.checked) {
          //console.log("---"+item.id);
          idsstr += 'cat-' + user_id + '-' + item.id + ','
        }
        return ''
      })
      if (ids !== '') {
        const url = REACT_APP_RESTAPI + 'modules/mail/mail.php'
        let user = ACL.getUser()
        let formData = new FormData()
        formData.append('auth_user', user.id)
        formData.append('auth_type', user.usertype)
        formData.append('auth_token', user.token)
        formData.append('action', 'set-category')
        formData.append('index', 'thread_id')
        formData.append('thread_id', ids)
        formData.append('mail_category', idsstr)
        formData.append('multiple', 'mail_category')
        formData.append('user_id', user_id)
        formData.append('multiple', 'mail_category')

        axios({
          method: 'post',
          url: url,
          data: formData,
          config: { headers: { 'Content-Type': 'multipart/form-data' } },
        })
          .then((response) => {
            // console.log(response.data)

            this.notify('tr', response.data.msg)
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          })
          .catch(function (response) {
            //handle error
            //console.log(response)
          })
        // console.log(ids + ' ' + idsstr)
      } // check if ids
    } // end check mode
  }

  oncatddCheck(e) {
    let checkName = e.currentTarget.dataset.id
    let isChecked = e.target.checked
    const checked = isChecked
    let user_id = this.state.user_id
    //console.log(checkName+isChecked);

    const catslist = this.state.catslist.map((item, index) => {
      if ('cat-' + user_id + '-' + item.id === checkName) {
        return Object.assign({}, item, {
          checked,
        })
      }
      return item
    })

    this._isMounted &&
      this.setState({ catslist }, () => {
        // console.log(this.state.catslist)
      })
  }

  async componentDidMount() {
    this._isMounted = true
    //console.log(this.props.user_id);
    //console.log(this.props.mailitems);
    // console.log(this.props.type)

    this.fetchCategories()

    var getuser = ACL.getUser()
    var user_id = getuser.id

    const search = window.location.search
    const params = new URLSearchParams(search)

    if (params.get('user_id') != null) {
      user_id = params.get('user_id')
    }

    const get_thread_id = params.get('thread')

    this._isMounted &&
      this.setState({ thread_id: get_thread_id, user_id: user_id }, () => {
        // console.log('-------||-----')
        // console.log(this.state.user_id)
        // console.log(this.state.thread_id)
        // console.log(this.props.type)
        // console.log(this.props.mailitems)
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
    return (
      <div className="float-left mail-ddcategory">
        <div className="notification-popup">
          <NotificationAlert ref="notificationAlert" />
        </div>

        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggledd}>
          <DropdownToggle caret>Apply Category</DropdownToggle>

          <DropdownMenu>
            {this.state.catslist.map((ci, ck) => (
              <DropdownItem className="" key={ck} toggle={false}>
                <label>
                  <input
                    name={'catdd'}
                    type="checkbox"
                    data-id={'cat-' + this.state.user_id + '-' + ci.id}
                    value={'cat-' + this.state.user_id + '-' + ci.id}
                    checked={ci.checked}
                    onChange={(e) => this.oncatddCheck(e)}
                  />
                  {ci.name}
                </label>
              </DropdownItem>
            ))}
            <DropdownItem className="button-item">
              <Input
                type="button"
                className="btn btn-sm savecatdd"
                data-id="savecatdd"
                onClick={(e) => this.savecatdd(e)}
                value="Apply Category"
              />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    )
  }
}

export default Mailcategory
