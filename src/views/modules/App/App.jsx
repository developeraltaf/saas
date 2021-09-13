import React from 'react'
import { ACL } from 'components'

// used for making the prop types of this component
//import PropTypes from 'prop-types'
//import { Redirect } from 'react-router'

import axios from 'axios'

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
var REACT_APP_MODE = process.env.REACT_APP_MODE
class App extends React.Component {
  // constructor(props) {
  //   super(props)
  // }

  static generate_app_guest_token() {
    //ACL.deauthenticateUser();
    // console.log('generate user token')
    let token = ACL.getToken()
    // console.log('app_token:' + token)
    if (token === null || token === '') {
      let user = ACL.getUser()
      // console.log(user)

      if (user.id === null || user.id === '') {
        const url = REACT_APP_RESTAPI + 'modules/web-token/web-token.php'
        let user = ACL.getUser()
        let formData = new FormData()
        formData.append('auth_user', user.id)
        formData.append('auth_type', user.usertype)
        formData.append('auth_token', user.token)
        formData.append('action', 'app-guest')
        axios({
          method: 'post',
          url: url,
          data: formData,
          config: {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        })
          .then((response) => {
            //handle success
            // console.log(response.data)
            if (response.data.guest_token !== undefined) {
              ACL.authenticateGuest(response.data.guest_token)
            }
          })
          .catch(function (response) {
            //handle error
            //console.log(response)
          })
      }
    }
  }

  static get_display_filename(obj, type = 'small') {
    let name = obj.name
    let thumb = ''
    let small = ''
    if (obj.thumb !== undefined) {
      thumb = obj.thumb
    }
    if (obj.small !== undefined) {
      small = obj.small
    }

    let filename = small
    if (type === 'thumb') {
      filename = thumb
    }
    if (filename === '') {
      if (type === 'thumb' && small !== '') {
        filename = small
      } else if (type === 'small' && thumb !== '') {
        filename = thumb
      } else if (name !== '') {
        filename = name
      }
    }
    //console_log(obj.name+" thumb:"+thumb+" small:"+small+" filename:"+filename);

    return filename
  }

  static filename_url(file) {
    if (file.indexOf('://') !== -1) {
      return file
    } else {
      return REACT_APP_RESTAPI + file
    }
  }

  static check_app_mode(event, msg = '') {
    let ret = []
    ret['allow'] = true
    ret['msg'] = ''

    /*------------------------------------------------------------
     Comment/Uncomment these lines to enable/disable demo mode
    ------------------------------------------------------------*/
    /*********Start Demo Mode**********/
    let user = ACL.getUser()
    if (REACT_APP_MODE === 'demo' && user.account_type === 'demo') {
      event.preventDefault()
      if (msg === '') {
        msg = 'For security reasons, you cannot update data in this demo.'
      }
      ret['allow'] = false
      ret['msg'] = msg
    }
    /*********End Demo Mode**********/

    return ret
  }

  static ajaxloading() {
    document.body.classList.add('ajaxloading')
  }

  static ajaxloaded() {
    document.body.classList.remove('ajaxloading')
  }

  render() {
    return ''
  }
}
export default App
