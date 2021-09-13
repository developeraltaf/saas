import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { NavLink } from 'react-router-dom'
// used for making the prop types of this component
import PropTypes from 'prop-types'
import axios from 'axios'
import NotificationAlert from 'react-notification-alert'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Badge,
} from 'reactstrap'
//import Parser from 'html-react-parser'
import Mailcategory from './Category.jsx'

//var BASEDIR = process.env.REACT_APP_BASEDIR;

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Mailbox extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      mailitems: [],
      star_toggle: true,
      read_toggle: true,
      isAllSelected: false,
      bulkaction: '',
      bulkaction_ids: '',
      bulkaction_msg: '',
      modal: false,
      pagetype: '',
      user_id: '',
    }

    this.toggleStar = this.toggleStar.bind(this)
    this.toggleRead = this.toggleRead.bind(this)
    this.set_unread_badge = this.set_unread_badge.bind(this)
    this.set_star = this.set_star.bind(this)
    this.toggleTrash = this.toggleTrash.bind(this)
    this.toggle_trash_row = this.toggle_trash_row.bind(this)
    this.notify = this.notify.bind(this)
    this.onCheckBoxChange = this.onCheckBoxChange.bind(this)
    this.bulkAction = this.bulkAction.bind(this)
    this.performAction = this.performAction.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  toggleStar(e) {
    e.preventDefault()
    var id = e.currentTarget.dataset.id
    //console.log(id);

    var active = e.currentTarget.classList.contains('icon-accent')
    var star = ''
    if (active) {
      star = '0'
      //e.currentTarget.setAttribute("title","No starred");
      //console.log("set star: 0 - "+id);
    } else {
      star = '1'
      //e.currentTarget.setAttribute("title","All starred");
      //console.log("set star: 1 - "+id);
    }

    const url = REACT_APP_RESTAPI + 'modules/mail/mail.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'star')
    formData.append('index', 'thread_id')
    formData.append('thread_id', id)
    formData.append('star', star)
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

    //if(this.state.star_toggle){
    //console.log("toggle: "+this.state.star_toggle);
    //e.currentTarget.classList.toggle('icon-accent');
    //e.currentTarget.classList.toggle('icon-secondary');
    //this._isMounted && this.setState({ star_toggle: false });
    //}
  }

  toggleRead(e) {
    e.preventDefault()
    var id = e.currentTarget.dataset.id
    // console.log(id)

    //console.log("innerHTML:"+e.currentTarget.querySelector('.badge').innerHTML);

    var has_unread = e.currentTarget.classList.contains('i-envelope-open')
    var mark_read = ''
    if (has_unread) {
      mark_read = '1'
      //e.currentTarget.setAttribute("title","Mark as Unread");
      //console.log("set star: 0 - "+id);
    } else {
      mark_read = '0'
      //e.currentTarget.setAttribute("title","Mark as read");
      //console.log("set star: 1 - "+id);
    }

    const url = REACT_APP_RESTAPI + 'modules/mail/mail.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'mark_read')
    formData.append('index', 'thread_id')
    formData.append('thread_id', id)
    formData.append('mark_read', mark_read)
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
          this._isMounted && this.setState({ read_toggle: true })
          //console.log(response.data.count);
          this.set_unread_badge(id, response.data.feature, this.state.user_id)
          //console.log("success"+this.state.read_toggle);
          //console.log(e.currentTarget.classList);
        }
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
      })

    /*if(this.state.read_toggle){
                    e.currentTarget.classList.toggle('i-envelope-open');
                    e.currentTarget.classList.toggle('i-envelope');
                    e.currentTarget.classList.toggle('hidecount');
                    this._isMounted && this.setState({ read_toggle: false });
                }*/
  }

  set_star(id, arr, user_id) {
    // console.log(id)
    // console.log(arr)

    let starlen = []

    if (arr['user-' + user_id + '-star-0'] !== undefined) {
      // console.log('star-0')
    } else if (arr['user-' + user_id + '-star-1'] !== undefined) {
      starlen = arr['user-' + user_id + '-star-1']
      // console.log('star-1')
    }

    var param = 'star-' + user_id

    const mailitems = this.state.mailitems.map((item, index) => {
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
          mailitems,
        },
        () => {
          // console.log(this.state.mailitems)
        },
      )

    //document.getElementById('badge-'+id).innerHTML = count;
    //document.getElementById('badge-'+id).setAttribute("title",count+" unread");
  }

  set_unread_badge(id, arr, user_id) {
    // console.log(id)
    // console.log(arr)

    let unreadlen = []

    if (arr['user-' + user_id + '-mark_read-0'] !== undefined) {
      unreadlen = arr['user-' + user_id + '-mark_read-0']
      // console.log('mark_read-0')
    } else if (arr['user-' + user_id + '-mark_read-1'] !== undefined) {
      // console.log('mark_read-1')
    }

    //var param = "unread-"+user_id;
    var param = 'unread-' + user_id

    const mailitems = this.state.mailitems.map((item, index) => {
      //console.log("id: "+item.id+" "+id+" ");
      if (item.id === id) {
        return Object.assign({}, item, {
          [param]: unreadlen,
        })
      }
      return item
    })

    this._isMounted &&
      this.setState(
        {
          mailitems,
        },
        () => {
          // console.log(this.state.mailitems)
        },
      )

    //document.getElementById('badge-'+id).innerHTML = count;
    //document.getElementById('badge-'+id).setAttribute("title",count+" unread");
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
      formData.append('index', 'thread_id')
      formData.append('thread_id', id)
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
            this.toggle_trash_row(id, trash)
            if (trash === '1') {
              this.notify('tr', 'Moved to Trash Successfully')
            } else if (trash === '0') {
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

  toggle_trash_row(id, trash) {
    const mailitems = this.state.mailitems.map((item, index) => {
      // console.log('trash id: ' + item.id + ' ' + id + ' ' + trash)
      if (item.id === id) {
        return Object.assign({}, item, {
          trash: trash,
        })
      }
      return item
    })

    this._isMounted &&
      this.setState(
        {
          mailitems,
        },
        () => {
          // console.log(this.state.mailitems)
        },
      )

    //document.getElementById('thread-row-'+id).classList.add("trash_toggle");
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

  updateMailboxItems = () => {
    // console.log('---------||----------')
    this._isMounted &&
      this.setState({
        mailitems: this.props.mailbox,
        isAllSelected: false,
        bulkaction: '',
        bulkaction_ids: '',
        bulkaction_msg: '',
        user_id: this.props.user_id,
      })
  }

  async componentDidMount() {
    this._isMounted = true

    //console.log("-------------------");
    //console.log(this.props.mailbox);

    const search = window.location.search
    const params = new URLSearchParams(search)
    var pagetype = ''
    if (params.get('type') === 'trash') {
      pagetype = 'trash'
    } else if (params.get('type') === 'star') {
      pagetype = 'star'
    }
    this._isMounted &&
      this.setState({
        mailitems: this.props.mailbox,
        isAllSelected: false,
        bulkaction: '',
        bulkaction_ids: '',
        bulkaction_msg: '',
        pagetype: pagetype,
        user_id: this.props.user_id,
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

    const mailitems = this.state.mailitems.map((item, index) => {
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
      mailitems.findIndex((item) => item.checked === false) === -1 ||
      isAllChecked

    this._isMounted &&
      this.setState({
        mailitems,
        isAllSelected,
      })
    this._isMounted && this.setState({ bulkaction: '' })
  }

  bulkAction(e) {
    e.preventDefault()
    var action = e.target.value

    var ids = ''
    this.state.mailitems.map((item, index) => {
      //console.log(item.id+": "+item.checked);
      if (item.checked) {
        //console.log("---"+item.id);
        ids += item.id + ','
      }
      return ''
    })

    var msg = ''
    if (action === 'star') {
      msg = 'Are you sure you want to star selected threads?'
    } else if (action === 'unstar') {
      msg = 'Are you sure you want to unstar selected threads?'
    } else if (action === 'read') {
      msg = 'Are you sure you want to mark selected threads as read?'
    } else if (action === 'unread') {
      msg = 'Are you sure you want to mark selected threads as unread?'
    } else if (action === 'trash') {
      msg = 'Are you sure you want to move selected threads to trash?'
    } else if (action === 'inbox') {
      msg = 'Are you sure you want to move selected threads back to inbox?'
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

  performAction(type, ids, event) {
    var checkmode = App.check_app_mode(event)
    if (!checkmode['allow']) {
      this.notify('tr', checkmode['msg'], false)
    } else {
      // console.log(type)
      // console.log(ids)

      const url1 = REACT_APP_RESTAPI + 'modules/mail/mail.php'
      let user = ACL.getUser()
      let formData = new FormData()
      formData.append('auth_user', user.id)
      formData.append('auth_type', user.usertype)
      formData.append('auth_token', user.token)
      formData.append('action', 'bulk')
      formData.append('type', type)
      formData.append('ids', ids)
      formData.append('index', 'thread_id')
      formData.append('user_id', this.state.user_id)

      axios({
        method: 'post',
        url: url1,
        data: formData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
      })
        .then((response) => {
          //console.log("----------------");
          //console.log(response.data);
          this.notify('tr', response.data.msg)
          setTimeout(() => {
            this.props.history.push('mail-inbox?user_id=' + this.state.user_id)
            window.location.reload()
          }, 2000)
        })
        .catch(function (response) {
          //handle error
          //console.log(response)
        })
    } // end check mode
  }
  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    var mailboxList = []

    this.state.mailitems.map((item, i) => {
      //for (var i = 0; i < this.props.mailbox.length; i++) {
      //var item = this.props.mailbox[i];
      var user_id = this.state.user_id
      var image = item.from_user['image']
      var name = item.from_user['name']
      if (item.from_user_id === user_id) {
        image = item.to_user['image']
        name = item.to_user['name']
      }
      let fileimage = App.get_display_filename(image, 'thumb')

      // Read/Unread
      var unread_count = ''
      var unread = ''
      var unread_disp = 'hidecount'
      var unread_length = 0
      var is_unread = ''
      if (
        item['unread-' + user_id] !== undefined &&
        item['unread-' + user_id].length > 0
      ) {
        unread_length = item['unread-' + user_id].length
        unread_count = unread_length + ' unread'
        unread_disp = ''
        is_unread = 'is-unread'
      }
      unread = (
        <span
          className={'badge badge-primary badge-small '}
          title={unread_count}
          id={'badge-' + item.id}
        >
          {item['unread-' + user_id].length}
        </span>
      )

      // Starred

      var star_count = 'No starred'
      var star_length = 0
      if (
        item['star-' + user_id] !== undefined &&
        item['star-' + user_id].length > 0
      ) {
        star_length = item['star-' + user_id].length
        star_count = star_length + ' starred'
      }
      // console.log('user_id' + this.state.user_id)
      //console.log(item["star-"+user_id]);

      // Mail Category
      var mail_category_badge = []
      var icat
      if (item.mail_category_name.length > 0) {
        for (icat = item.mail_category_name.length - 1; icat >= 0; icat--) {
          mail_category_badge.push(
            <Badge color="primary" className="catbadge" key={icat}>
              {item.mail_category_name[icat]}
            </Badge>,
          )
        }
      }

      var itemid = item.id
      var itemchecked = '' //item.checked;

      if (item.checked === 'false') {
        itemchecked = false
      } else {
        itemchecked = item.checked
      }
      //itemchecked = false;
      //console.log(item.id+item.checked);

      // This is for toggle row on move to trash / move to inbox button
      var trash = '0'
      var trash_icon = 'i-trash'
      var trash_title = 'Move to trash'
      var trash_count = ''
      if (
        item['trash-' + user_id] !== undefined &&
        item['trash-' + user_id].length > 0
      ) {
        var trash_arr = item['trash-' + user_id]
        if (trash_arr.indexOf(item.id) > -1) {
          // item is in trash
          trash = '1'
          trash_icon = 'i-drawer'
          trash_title = 'Move to Inbox'
        }

        if (this.state.pagetype === 'trash') {
          trash_count = '' + trash_arr.length + ' trash mail'
          if (trash_arr.length > 1) {
            trash_count = '' + trash_arr.length + ' trash mails'
          }
        }
      }

      if (this.state.pagetype === 'trash') {
        trash = '1'
        trash_icon = 'i-drawer'
        trash_title = 'Move to Inbox'
      }

      var pushRow = true
      if (item.trash === '0' && this.state.pagetype === 'trash') {
        pushRow = false
      } else if (item.trash === '1' && this.state.pagetype === '') {
        pushRow = false
      }

      if (pushRow) {
        mailboxList.push(
          <tr
            className={'' + is_unread + ''}
            id={'thread-row-' + item.id}
            key={i}
          >
            <td className="check">
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
            </td>
            <td className="user-img">
              <img
                src={App.filename_url(fileimage)}
                alt={name}
                className="avatar-image img-inline"
              />
            </td>
            <td className="open-view mail-row-data">
              <div className="mail-title">
                <span className="msgtext">
                  <NavLink
                    to={
                      'mail-view?id=' +
                      item.id +
                      '&thread=' +
                      item.thread_id +
                      '&user_id=' +
                      user_id
                    }
                  >
                    <span>{item.title}</span>
                  </NavLink>
                </span>
                <span className="msgby">{name}</span>
                {mail_category_badge}
              </div>
              <div className="mail-more">
                <span className="msg_time" title={item.latest.disptime.full}>
                  {item.latest.disptime.info}
                </span>
                {item.latest.attachment.length > 0 ? (
                  <span className="has-attachment">
                    <i className="i-paper-clip icon-xs"></i>
                  </span>
                ) : (
                  ''
                )}
                <div className="star">
                  <i
                    className={
                      'icon-xs ' +
                      (star_length > 0
                        ? 'i-star icon-accent'
                        : 'i-star icon-secondary')
                    }
                    title={star_count}
                    data-id={item.id}
                    onClick={(e) => this.toggleStar(e)}
                  ></i>
                </div>
                <span className="trash">
                  <i
                    className={'icon-xs ' + trash_icon}
                    title={trash_title}
                    data-id={item.id}
                    data-trash={trash}
                    onClick={(e) => this.toggleTrash(e)}
                  ></i>
                </span>
                <span className="mark_read">
                  <i
                    className={
                      'icon-xs ' +
                      unread_disp +
                      ' ' +
                      (unread_length > 0 ? 'i-envelope-open' : 'i-envelope')
                    }
                    title={
                      unread_length > 0 ? 'Mark as read' : 'Mark as Unread'
                    }
                    data-id={item.id}
                    onClick={(e) => this.toggleRead(e)}
                  >
                    {unread}
                  </i>{' '}
                </span>
              </div>
              <article className="message">{item.latest.short_msg}</article>

              {this.state.pagetype === 'trash' ? (
                <div className="trash-count">{trash_count}</div>
              ) : (
                ''
              )}
            </td>
          </tr>,
        )
      }
      //}
      return ''
    })

    return (
      <div className="mail_list col-12">
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
                color="primary"
                className="btn btn-sm"
                data-id="submit"
                onClick={this.toggle}
              >
                Submit
              </Button>{' '}
              <Button
                color="secondary"
                className="btn btn-sm"
                data-id="cancel"
                onClick={this.toggle}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        <div className="mail-select-row">
          <div className="float-left mail-select-all">
            <label>
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
          <div className="float-left mail-bulkselect">
            <Input
              type="select"
              data-id="bulkaction"
              name="bulkaction"
              value={this.state.bulkaction}
              onChange={(e) => this.bulkAction(e)}
            >
              <option value="0">Select</option>
              <option value="star">Star selected</option>
              <option value="unstar">Unstar selected</option>
              <option value="read">Mark as Read</option>
              <option value="unread">Mark as Unread</option>
              {this.state.pagetype === 'trash' ? (
                <option value="inbox">Move to Inbox</option>
              ) : (
                <option value="trash">Move to Trash</option>
              )}
            </Input>
          </div>
          <Mailcategory
            type="multiple_thread"
            mailitems={this.state.mailitems}
          />
        </div>

        <table className="table mailbox-table">
          <tbody>
            {this.state.user_id === '' ? (
              <tr>
                <td>Please Select a user above to load mailbox of.</td>
              </tr>
            ) : (
              ''
            )}
            {this.state.mailitems.length === 0 ? (
              <tr>
                <td>No Mails Found.</td>
              </tr>
            ) : (
              mailboxList
            )}
          </tbody>
        </table>
      </div>
    )
  }
}

Mailbox.propTypes = {
  mailbox: PropTypes.arrayOf(PropTypes.object),
}

export default Mailbox
