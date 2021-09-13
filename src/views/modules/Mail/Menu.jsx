import React from 'react'
import { ACL } from 'components'

import { NavLink } from 'react-router-dom'
import axios from 'axios'

var BASEDIR = process.env.REACT_APP_BASEDIR

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Mailmenu extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      catslist: [],
      user_id: '',
    }
    this.fetchCategories = this.fetchCategories.bind(this)
  }

  async componentDidMount() {
    this._isMounted = true

    this.fetchCategories()

    var getuser = ACL.getUser()
    var user_id = getuser.id

    const search = window.location.search
    const params = new URLSearchParams(search)
    if (params.get('user_id') != null) {
      user_id = params.get('user_id')
    }

    this._isMounted &&
      this.setState({ user_id: user_id }, () => {
        // this.loadData();
      })
  }

  fetchCategories() {
    const url1 = REACT_APP_RESTAPI + 'modules/mail/mailcategory.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-all')
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
        this._isMounted &&
          this.setState({
            catslist: response.data.items,
            isLoaded: true,
          })
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
      <div className="col-lg-2 col-md-3 col-12 mail_tabs_wrap">
        <ul className="list-unstyled mail_tabs">
          <li className="compose">
            <NavLink
              to={BASEDIR + '/zak/mail-compose?user_id=' + this.state.user_id}
            >
              <i className="i-envelope"></i> Compose
            </NavLink>
          </li>
          <li className="li-divider"></li>
          <li className="">
            <a href={BASEDIR + '/zak/mail-inbox?user_id=' + this.state.user_id}>
              <i className="i-drawer"></i> Inbox
            </a>
          </li>
          <li className="">
            <a
              href={
                BASEDIR +
                '/zak/mail-inbox?type=sent&user_id=' +
                this.state.user_id
              }
            >
              <i className="i-paper-plane"></i> Sent
            </a>
          </li>
          <li className="">
            <a
              href={
                BASEDIR +
                '/zak/mail-inbox?type=draft&user_id=' +
                this.state.user_id
              }
            >
              <i className="i-pencil"></i> Drafts
            </a>
          </li>
          <li className="">
            <a
              href={
                BASEDIR +
                '/zak/mail-inbox?type=unread&user_id=' +
                this.state.user_id
              }
            >
              <i className="i-envelope"></i> Unread
            </a>
          </li>
          <li className="">
            <a
              href={
                BASEDIR +
                '/zak/mail-inbox?type=star&user_id=' +
                this.state.user_id
              }
            >
              <i className="i-star"></i> Starred
            </a>
          </li>
          <li className="">
            <a
              href={
                BASEDIR +
                '/zak/mail-inbox?type=trash&user_id=' +
                this.state.user_id
              }
            >
              <i className="i-trash"></i> Trash
            </a>
          </li>
          {this.state.catslist.length > 0 ? (
            <li className="li-divider"></li>
          ) : (
            ''
          )}

          {this.state.catslist.map((item) => (
            <li className="" key={item.id}>
              <a
                href={
                  BASEDIR +
                  '/zak/mail-inbox?cat=' +
                  item.slug +
                  '&user_id=' +
                  this.state.user_id
                }
              >
                <i className="i-tag"></i> {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default Mailmenu
