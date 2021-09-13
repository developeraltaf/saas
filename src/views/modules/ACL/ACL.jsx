import React from 'react'
import { App } from 'components'

var AUTHEXPIREMILLISECONDS = 86400000

class ACL extends React.Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
  }

  /*--------------------------------------------------*/

  static authenticateUser(user) {
    if (user.usertype === 'admin') {
      // console.log('authenticateUser')
      // console.log('authenticateUser')
      //console.log(user);
      var d = new Date()
      var ts = d.getTime()

      let image = App.get_display_filename(user.image[0], 'thumb')

      localStorage.setItem('id', user.id)
      localStorage.setItem('name', user.name)
      localStorage.setItem('username', user.username)
      localStorage.setItem('image', image)
      localStorage.setItem('usertype', user.usertype)
      localStorage.setItem('account_type', user.account_type)
      localStorage.setItem('logints', ts) // when user logged in
      localStorage.setItem('token', user.token)

      // console.log(localStorage)
    } else {
      // console.log('Unauthorized User')
    }
  }

  static isUserACLenticated() {
    var authentic = localStorage.getItem('username') !== null
    // console.log('isUserACLenticated: ' + authentic)
    return authentic
  }

  static isACLExpired() {
    var d = new Date()
    var ts = d.getTime()
    var logints = ''

    var diff = AUTHEXPIREMILLISECONDS
    // var diff = 10000
    var expire = true

    if (localStorage.getItem('logints') !== null) {
      logints = localStorage.getItem('logints')
      if (ts - logints < diff) {
        expire = false
      }
    }

    // console.log('isACLExpired: ' + expire)
    return expire
  }

  static deauthenticateUser() {
    // console.log('deauthenticateUser')
    localStorage.removeItem('id')
    localStorage.removeItem('name')
    localStorage.removeItem('username')
    localStorage.removeItem('image')
    localStorage.removeItem('usertype')
    localStorage.removeItem('account_type')
    localStorage.removeItem('logints')
    localStorage.removeItem('token')
  }

  static getUser() {
    var user = {}
    user['id'] = localStorage.getItem('id')
    user['name'] = localStorage.getItem('name')
    user['username'] = localStorage.getItem('username')
    user['image'] = localStorage.getItem('image')
    user['usertype'] = localStorage.getItem('usertype')
    user['account_type'] = localStorage.getItem('account_type')
    user['logints'] = localStorage.getItem('logints')
    user['token'] = localStorage.getItem('token')

    // console.log(user)

    return user
  }

  static getUserTimeZone() {
    let tzoffset = new Date().getTimezoneOffset()
    return tzoffset
  }

  static getToken() {
    return localStorage.getItem('token')
  }

  static authenticateGuest(token) {
    // console.log('authenticateGuest')
    localStorage.setItem('token', token)
  }

  static deauthenticateGuest() {
    // console.log('deauthenticateGuest')
    localStorage.removeItem('token')
  }

  render() {
    return ''
  }
}
export default ACL
