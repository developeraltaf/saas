import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Badge, Row, Col } from 'reactstrap'
import { NavLink } from 'react-router-dom'

import {} from 'components'
import axios from 'axios'
import Parser from 'html-react-parser'
import NotificationAlert from 'react-notification-alert'

import Mailmenu from './Menu.jsx'
import Mailcategory from './Category.jsx'

//var IMGDIR = process.env.REACT_APP_IMGDIR

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Mailview extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.toggle = this.toggle.bind(this)
    this.state = {
      dropdownOpen: false,
      from_user_id: '',
      to_user_id: '',
      from_user: [],
      to_user: [],
      title: '',
      message: '',
      attachment: [],
      attachment_disp: [],
      response: '',
      id: '',
      catslist: [],
      mail_category: '',
      thread_id: '',
      data: [],
      star_toggle: true,
      pagetype: '',
      user_id: '',
    }

    this.loadData = this.loadData.bind(this)
    this.toggleStar = this.toggleStar.bind(this)
    this.toggleRead = this.toggleRead.bind(this)
    this.set_as_unread = this.set_as_unread.bind(this)
    this.fetchCategories = this.fetchCategories.bind(this)
    this.toggleTrash = this.toggleTrash.bind(this)
    this.toggle_trash_row = this.toggle_trash_row.bind(this)
    this.toggleMailView = this.toggleMailView.bind(this)
    this.notify = this.notify.bind(this)
  }

  toggle() {
    this._isMounted &&
      this.setState((prevState) => ({
        dropdownOpen: !prevState.dropdownOpen,
      }))
  }

  async componentDidMount() {
    // console.log('view componentDidMount')

    this._isMounted = true

    this.fetchCategories()

    var getuser = ACL.getUser()
    var user_id = getuser.id

    const search = window.location.search
    const params = new URLSearchParams(search)

    var loadtype = params.get('type')
    if (params.get('type') === 'trash') {
      loadtype = 'trash'
    }

    if (params.get('user_id') !== null) {
      user_id = params.get('user_id')
    }

    this._isMounted &&
      this.setState({ user_id: user_id, pagetype: loadtype }, () => {
        //const getid = "";
        //console.log(params.has('id'));
        //console.log(this.props.location.search);
        if (params.has('id')) {
          const getid = params.get('id')
          const get_thread_id = params.get('thread')
          //console.log(getid);
          this._isMounted && this.setState({ id: getid })
          this._isMounted && this.setState({ thread_id: get_thread_id })
          //console.log("true");
          this.loadData(getid, get_thread_id, loadtype)
        } else {
          //console.log("false");
        }
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

  loadData(id, thread_id, loadtype) {
    //console.log(id);
    //event.preventDefault();
    //this._isMounted && this.setState({ response: ""});
    //console.log(this.state);
    //console.log(this.state.image);

    const url = REACT_APP_RESTAPI + 'modules/mail/mail.php'
    let user = ACL.getUser()
    let tzoffset = ACL.getUserTimeZone()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-thread')
    formData.append('display', 'userimage')
    formData.append('mail_category', 'name')
    formData.append('mark_read', 'true')
    formData.append('id', id)
    formData.append('thread_id', thread_id)
    formData.append('user_id', this.state.user_id)
    formData.append('loadtype', loadtype)
    formData.append('time', tzoffset)
    formData.append('source', 'admin')

    axios({
      method: 'post',
      url: url,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        //handle success
        // console.log(response.data)
        //console.log(response.data.attachment);

        if (response.data.success === true) {
          this._isMounted && this.setState({ data: response.data.data })
          this._isMounted && this.setState({ title: this.state.data[0].title })
          this._isMounted &&
            this.setState({
              mail_category: this.state.data[0].mail_category_name,
            })
          //console.log(this.state.data[0].title);
        }
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
      })
  }

  toggleMailView(e) {
    e.preventDefault()
    var id = e.currentTarget.dataset.id
    //console.log(this.state.data)

    const data = this.state.data.map((item, index) => {
      // console.log(item.id + '' + id + '' + item.open)
      if (item.id === id) {
        return Object.assign({}, item, {
          open: !item.open,
        })
      }
      return item
    })
    //console.log(data)

    this._isMounted &&
      this.setState(
        {
          data,
        },
        () => {
          // console.log(this.state.data)
        },
      )
  }

  toggleStar(e) {
    e.preventDefault()
    var id = e.currentTarget.dataset.id
    //console.log(id);
    var active = e.currentTarget.classList.contains('icon-accent')
    var star = ''
    if (active) {
      star = '0'
      //console.log("set star: 0");
    } else {
      star = '1'
      //console.log("set star: 1");
    }

    const url = REACT_APP_RESTAPI + 'modules/mail/mail.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'star')
    formData.append('index', 'id')
    formData.append('id', id)
    formData.append('thread_id', this.state.thread_id)
    formData.append('star', star)
    formData.append('user_id', this.state.user_id)
    axios({
      method: 'post',
      url: url,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        //handle success
        // console.log(response.data)
        //console.log(response.data.attachment);

        if (response.data.success === true) {
          this.set_star(id, response.data.feature, this.state.user_id)
          //this._isMounted && this.setState({ star_toggle: true });
          //console.log("success"+this.state.star_toggle);
          //console.log(e.currentTarget.classList);
        }
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
      })

    if (this.state.star_toggle) {
      //console.log("toggle: "+this.state.star_toggle);
      //e.currentTarget.classList.toggle('icon-accent');
      //e.currentTarget.classList.toggle('icon-secondary');
      //this._isMounted && this.setState({ star_toggle: false });
    }
  }
  set_star(id, arr, user_id) {
    // console.log(id)
    // console.log(arr)

    let starlen = ''

    if (arr['user-' + user_id + '-star-0'] !== undefined) {
      starlen = ''
      // console.log('star-0')
    } else if (arr['user-' + user_id + '-star-1'] !== undefined) {
      starlen = '|' + user_id + ':1|'
      // console.log('star-1')
    }

    var param = 'star'

    const data = this.state.data.map((item, index) => {
      //console.log("id: "+item.id+" "+id+" ");
      if (item.id === id) {
        return Object.assign({}, item, {
          [param]: starlen,
        })
      }
      return item
    })

    this._isMounted &&
      this.setState(
        {
          data,
        },
        () => {
          // console.log(this.state.data)
        },
      )
  }

  toggleRead(e) {
    e.preventDefault()
    var id = e.currentTarget.dataset.id
    var timestamp = e.currentTarget.dataset.ts
    // console.log(id)
    var mark_read = '0'
    const url = REACT_APP_RESTAPI + 'modules/mail/mail.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'mark_read')
    formData.append('index', 'id')
    formData.append('thread_id', this.state.thread_id)
    formData.append('id', id)
    formData.append('timestamp', timestamp)
    formData.append('mark_read', mark_read)
    formData.append('user_id', this.state.user_id)
    formData.append('fromhere', 'timestamp')
    axios({
      method: 'post',
      url: url,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        console.log(response.data)

        if (response.data.success === true) {
          this.set_as_unread(id, response.data.feature, this.state.user_id)
        }
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
      })
  }

  set_as_unread(id, arr, user_id) {
    // console.log(this.state.data)
    // console.log(arr)
    //console.log(ids);

    var ids = []
    var str = '|' + user_id + ':0|'
    if (arr['user-' + user_id + '-mark_read-0'] !== undefined) {
      ids = arr['user-' + user_id + '-mark_read-0']
    }

    // Change state value mark_read for each id
    let checkid
    // Loop through data state and check id value with ids variable
    const data = this.state.data.map((item, index) => {
      //console.log('loop id: ' + item.id + ' : ' + str)
      // Filter function returns value when condition is true
      checkid = ids.filter(function (cid) {
        if (cid === item.id) {
          return true
        } else {
          return false
        }
      })

      // console.log('check id: ' + item.id + ' ' + checkid)
      if ('' + item.id + '' === '' + checkid + '') {
        //  console.log('mark_read_0: ' + item.id + ' : ' + str)
        return Object.assign({}, item, {
          mark_read: str,
        })
      }
      return item
    })

    this._isMounted &&
      this.setState(
        {
          data,
        },
        () => {
          console.log(this.state.data)
        },
      )
  }

  toggleTrash(e) {
    e.preventDefault()
    var checkmode = App.check_app_mode(e)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      var id = e.currentTarget.dataset.id
      var curr_trash = e.currentTarget.dataset.trash
      //console.log(id+" "+curr_trash);
      //console.log(id);

      var trash = '1'
      if (curr_trash === '1') {
        trash = '0'
      }

      const url = REACT_APP_RESTAPI + 'modules/mail/mail.php'
      let user = ACL.getUser()
      let formData = new FormData()
      formData.append('auth_user', user.id)
      formData.append('auth_type', user.usertype)
      formData.append('auth_token', user.token)
      formData.append('action', 'trash')
      formData.append('index', 'id')
      formData.append('id', id)
      formData.append('thread_id', this.state.thread_id)
      formData.append('trash', trash)
      formData.append('user_id', this.state.user_id)
      axios({
        method: 'post',
        url: url,
        data: formData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
      })
        .then((response) => {
          // console.log(response.data)

          if (response.data.success === true) {
            if (trash === '1') {
              this.toggle_trash_row(id, 'add')
              this.notify('tr', 'Moved to Trash Successfully')
            } else if (trash === '0') {
              this.toggle_trash_row(id, 'remove')
              this.notify('tr', 'Moved back to Inbox Successfully')
            }
          }
        })
        .catch(function (response) {
          //handle error
          //console.log(response)
        })
    } // end check mode
  }

  toggle_trash_row(id, type) {
    var str = '|' + this.state.user_id + ':0|'
    if (type === 'add') {
      str = '|' + this.state.user_id + ':1|'
    }

    const data = this.state.data.map((item, index) => {
      // console.log('check id: ' + item.id + ' ' + id + ' ' + type)
      if (item.id === id) {
        return Object.assign({}, item, {
          trash: str,
        })
        /*if(type === "add"){
                        return Object.assign({}, item, {
                            trash: str,
                        });
                    } else if(type === "remove"){
                        return Object.assign({}, item, {
                            trash: str,
                        });
                    }*/
      }
      return item
    })

    this._isMounted &&
      this.setState(
        {
          data,
        },
        () => {
          // console.log(this.state.data)
        },
      )

    /*if(type === "remove"){
            document.getElementById('mail-view-'+id).classList.remove("trash-mail-view");
        } else if(type === "add"){
            document.getElementById('mail-view-'+id).classList.add("trash-mail-view");
        }*/
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
    var mailboxList = []

    var mail_category_badge = []
    if (this.state.mail_category.length > 0) {
      for (var icat = this.state.mail_category.length - 1; icat >= 0; icat--) {
        mail_category_badge.push(
          <Badge color="primary" className="catbadge" key={icat}>
            {this.state.mail_category[icat]}
          </Badge>,
        )
      }
    }

    this.state.data.map((item, key) => {
      var user_id = this.state.user_id

      // Starred
      var star_length = 0
      if (item.star.indexOf('|' + user_id + ':1|') > -1) {
        star_length = 1
      }

      var itemopen = 'itemclose'
      if (item.open === true) {
        itemopen = 'itemopen'
      }

      //var readtitle = 'Mark as unread from here'
      //var read_class = 'i-envelope'
      var itemread = 'read'
      if (item.mark_read.indexOf('|' + user_id + ':1|') === -1) {
        itemread = 'unread'
      }

      var trash = '0'
      var trash_icon = 'i-trash'
      var trash_title = 'Move to trash'
      if (item.trash.indexOf('|' + user_id + ':1|') > -1) {
        trash = '1'
        trash_icon = 'i-drawer'
        trash_title = 'Move to Inbox'
      }
      var display = true
      if (this.state.pagetype === 'trash') {
        if (trash === '0') {
          display = false
        }
      } else if (this.state.pagetype !== 'trash') {
        if (trash === '1') {
          display = false
        }
      }

      let fromimage = App.get_display_filename(item.from_user['image'], 'thumb')
      let toimage = App.get_display_filename(item.to_user['image'], 'thumb')

      if (display) {
        mailboxList.push(
          <div
            key={key}
            id={'mail-view-' + item.id}
            className={'mail-view ' + itemread + ' ' + itemopen + ' '}
          >
            <div className="col-12 mail_view_info">
              <div
                className="float-left toggle-mailview"
                data-id={item.id}
                onClick={(e) => this.toggleMailView(e)}
              >
                <span className="">
                  <img
                    src={App.filename_url(fromimage)}
                    alt={item.from_user['name']}
                    className="avatar img-inline"
                  />{' '}
                  <strong>{item.from_user['name']}</strong> &nbsp; to &nbsp;
                  &nbsp;{' '}
                  <img
                    src={App.filename_url(toimage)}
                    alt={item.to_user['name']}
                    className="avatar img-inline"
                  />{' '}
                  <strong>{item.to_user['name']}</strong>
                </span>
              </div>
              <div className="view-actions">
                <div className="view-info">
                  <div className="star">
                    <i
                      data-id={item.id}
                      className={
                        'icon-xs ' +
                        (star_length > 0
                          ? 'i-star icon-accent'
                          : 'i-star icon-secondary')
                      }
                      onClick={(e) => this.toggleStar(e)}
                    ></i>
                  </div>
                  <span
                    className="msg_ts text-muted"
                    title={item.disptime.full}
                  >
                    {item.disptime.info}
                  </span>
                  <div className="mark_read">
                    <i
                      className={
                        'icon-xs ' +
                        (itemread === 'read' ? 'i-envelope' : 'i-envelope-open')
                      }
                      id={'read-' + item.id}
                      title={'Mark as unread from here'}
                      data-id={item.id}
                      data-ts={item.timestamp}
                      onClick={(e) => this.toggleRead(e)}
                    ></i>
                  </div>
                </div>

                <div className="mail-view-btns">
                  {(() => {
                    switch (item.status) {
                      case 'draft':
                        return (
                          <NavLink
                            to={
                              'mail-compose?id=' +
                              item.id +
                              '&thread=' +
                              item.thread_id +
                              '&user_id=' +
                              this.state.user_id
                            }
                          >
                            <button
                              type="button"
                              className="btn btn-default btn-icon"
                              data-id="draft"
                              data-color-class="primary"
                              data-animate=" animated fadeIn"
                              data-toggle="tooltip"
                              data-original-title="Draft"
                              data-placement="top"
                            >
                              <i className="i-action-redo icon-xs"></i> Edit
                              Draft
                            </button>
                          </NavLink>
                        )
                      case 'send':
                        return ''
                      default:
                        return ''
                    }
                  })()}

                  <NavLink
                    to={
                      'mail-compose?reply=' +
                      item.id +
                      '&thread=' +
                      item.thread_id +
                      '&user_id=' +
                      this.state.user_id
                    }
                  >
                    <button
                      title="Reply"
                      type="button"
                      className="btn btn-sm"
                      data-id="reply"
                    >
                      <i className="i-action-redo icon-xs"></i>
                    </button>
                  </NavLink>
                  <NavLink
                    to={
                      'mail-compose?forward=' +
                      item.id +
                      '&user_id=' +
                      this.state.user_id
                    }
                  >
                    <button
                      title="Forward"
                      type="button"
                      className="btn btn-sm"
                      data-id="forward"
                    >
                      <i className="i-action-undo icon-xs"></i>
                    </button>
                  </NavLink>
                  <button
                    title={trash_title}
                    type="button"
                    className="btn btn-sm totrash"
                    data-id={item.id}
                    data-trash={trash}
                    onClick={(e) => this.toggleTrash(e)}
                  >
                    <i className={'icon-xs ' + trash_icon}></i>
                  </button>

                  <span
                    className="view-open-toggle"
                    data-id={item.id}
                    onClick={(e) => this.toggleMailView(e)}
                  >
                    <i className={'icon-xs i-arrow-down'}></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="spacer"></div>
            <article className="message">
              <div className="col-12 mail_view">{Parser(item.message)}</div>

              <div className="col-12 mail_view_attach">
                <ul className="list-unstyled list-inline">
                  {item.attachment.map((attach, i) => (
                    <li className="list-inline-item" key={i}>
                      <a
                        href={REACT_APP_RESTAPI + '' + attach.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="file"
                      >
                        <img
                          alt="attachment"
                          src={REACT_APP_RESTAPI + '' + attach.small}
                          className="img-thumbnail"
                        />
                        {/* <br />
                          <div className="title">
                            {attach.name} ({attach.size}) ({attach.type})
                          </div> */}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <div className="mail-separator"></div>
          </div>,
        )
      }
      return ''
    })

    return (
      <div>
        <div className="content">
          <div className="notification-popup">
            <NotificationAlert ref="notificationAlert" />
          </div>

          <Row>
            <Col md={12}>
              <div className="page-title">
                <div className="float-left">
                  <h1 className="title">Mail View</h1>
                </div>
              </div>

              <div className="content-body">
                <div className="row" style={{ margin: '15px 0px 0px 0px' }}>
                  <Mailmenu />

                  <div
                    className="col-lg-10 col-md-9 col-12"
                    style={{ paddingLeft: '0px' }}
                  >
                    <div className="mail_content">
                      <div className="row">
                        <div className="col-12">
                          <div className="col-12 mail_view_title">
                            <div className="float-left">
                              {/* <div>
                                                                {"Loaded View of (" +
                                                                    this.state
                                                                        .user_id +
                                                                    ")"}
                                                            </div> */}
                              <h4>{this.state.title}</h4>
                              {mail_category_badge}
                            </div>

                            <div className="float-right">
                              <Mailcategory
                                type="single_thread"
                                thread_id={this.state.thread_id}
                              />
                            </div>
                          </div>

                          <div className="spacer"></div>

                          {mailboxList}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default Mailview
