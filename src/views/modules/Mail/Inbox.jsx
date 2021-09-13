import React from 'react'
import { ACL } from 'components'

import {
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Input,
} from 'reactstrap'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from 'reactstrap'

import Mailbox from './Mailbox.jsx'
import axios from 'axios'
import NotificationAlert from 'react-notification-alert'

//import { mailbox } from 'variables/general/mailbox.jsx';

import Mailmenu from './Menu.jsx'

var MINSEARCHLENGTH = 5

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Mailinbox extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      fetch: [],
      error: null,
      userslist: [],
      useridname: [],
      isLoaded: false,
      pagetitle: 'Inbox',
      pagetype: 'inbox',
      modal: false,
      pagecount: '10',
      currpage: '1',
      disable_next: false,
      disable_prev: true,
      search: '',
      user_id: '',
    }

    this.fetchUsers = this.fetchUsers.bind(this)
    this.UpdateMailbox = React.createRef()
    this.toggle = this.toggle.bind(this)
    this.notify = this.notify.bind(this)
    this.emptyTrash = this.emptyTrash.bind(this)
    this.loadPage = this.loadPage.bind(this)
    this.loadData = this.loadData.bind(this)
    this.setPageLimit = this.setPageLimit.bind(this)
    this.searchEntered = this.searchEntered.bind(this)
    this.onChangeUser = this.onChangeUser.bind(this)
  }

  async componentDidMount() {
    this._isMounted = true

    var getuser = ACL.getUser()

    this.fetchUsers()
    var user_id = getuser.id

    const search = window.location.search
    const params = new URLSearchParams(search)
    if (params.get('user_id') != null) {
      user_id = params.get('user_id')
    }

    this._isMounted &&
      this.setState({ user_id: user_id }, () => {
        this.loadData()
      })
  }

  onChangeUser(e) {
    // console.log(e.target.value)
    this._isMounted &&
      this.setState({ user_id: e.target.value }, () => {
        this.props.history.push('mail-inbox?user_id=' + this.state.user_id)
        window.location.reload()
        //this.loadData();
      })
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
  loadData() {
    const search = window.location.search
    const params = new URLSearchParams(search)

    if (params.get('type') === 'star') {
      this._isMounted && this.setState({ pagetitle: 'Starred' })
      this._isMounted && this.setState({ pagetype: 'star' })
    } else if (params.get('type') === 'trash') {
      this._isMounted && this.setState({ pagetitle: 'Trash' })
      this._isMounted && this.setState({ pagetype: 'trash' })
    } else if (params.get('cat') !== '' && params.get('cat') != null) {
      this._isMounted &&
        this.setState({
          pagetitle: 'Inbox (' + params.get('cat') + ')',
        })
      this._isMounted && this.setState({ pagetype: 'inbox' })
    }

    //var minlength = 4;
    var searchstr = ''
    // Check for search values
    if (this.state.search.length >= MINSEARCHLENGTH) {
      searchstr = this.state.search
    }

    const url1 = REACT_APP_RESTAPI + 'modules/mail/mail.php'
    let user = ACL.getUser()
    let tzoffset = ACL.getUserTimeZone()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-all')
    formData.append('from', 'userimage')
    formData.append('to', 'userimage')
    formData.append('mail_category', 'name')
    formData.append('parent', 'eq0')
    formData.append('cat', params.get('cat'))
    formData.append('type', params.get('type'))
    formData.append('currpage', this.state.currpage)
    formData.append('pagecount', this.state.pagecount)
    formData.append('search', searchstr)
    formData.append('id', '')
    formData.append('user_id', this.state.user_id)
    formData.append('time', tzoffset)
    formData.append('source', 'admin')
    axios({
      method: 'post',
      url: url1,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        //console.log("----------------");
        // console.log(response.data)
        //console.log(response.data.items);
        //if(response.data.items.length > 0){
        this._isMounted &&
          this.setState({ fetch: response.data.items, isLoaded: true }, () => {
            // This function is necessary to update props on change
            //any button value in Mailbox component
            this.UpdateMailbox.current.updateMailboxItems()

            this.setPageLimit()
          })

        //}
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
      })
  }

  searchEntered(e) {
    var action = e.currentTarget.dataset.id
    //console.log(action);
    //console.log(e.key);
    //var minlength = 4;

    if (action === 'search-input') {
      this._isMounted && this.setState({ search: e.target.value })
      if (e.key === 'Enter') {
        //console.log(e.key+" pressed Load Search: " + this.state.search);
        this.loadData()
      }
    } else if (action === 'search-button') {
      //console.log("Search Button Clicked, Search: " + this.state.search);
      this.loadData()
    }
  }

  loadPage(e) {
    var action = e.currentTarget.dataset.id
    // console.log(action)
    var currpage
    if (action === 'pagecount') {
      this._isMounted &&
        this.setState({ pagecount: e.target.value }, () => this.loadData())
    } else if (action === 'next') {
      // console.log(this.state.currpage)
      currpage = Number(this.state.currpage) + 1
      // console.log(currpage)
      this._isMounted &&
        this.setState({ currpage: currpage }, () => this.loadData())
    } else if (action === 'previous') {
      // console.log(this.state.currpage)
      if (Number(this.state.currpage) > 1) {
        currpage = Number(this.state.currpage) - 1
        // console.log(currpage)
        this._isMounted &&
          this.setState({ currpage: currpage }, () => this.loadData())
      }
    }
  }

  setPageLimit() {
    var currpage = Number(this.state.currpage)
    var pagecount = Number(this.state.pagecount)
    var items = Number(this.state.fetch.length)

    // console.log('Current page: ' + currpage)
    // console.log('Page count: ' + pagecount)
    // console.log('Items: ' + items)

    if (items === pagecount) {
      // console.log('1: Allow Next')
      this._isMounted && this.setState({ disable_next: false })
    } else if (items > 0 && items < pagecount && currpage === 1) {
      // console.log('2: Disable Next')
      // console.log('2: Disable Prev')
      this._isMounted && this.setState({ disable_next: true })
      this._isMounted && this.setState({ disable_prev: true })
    } else if (items > 0 && items < pagecount) {
      // console.log('3: Disable Next')
      // console.log('3: Allow Prev')
      this._isMounted && this.setState({ disable_next: true })
      this._isMounted && this.setState({ disable_prev: false })
    } else if (items === 0 && currpage === 1) {
      // console.log('4: Disable Next')
      // console.log('4: Disable Prev')
      this._isMounted && this.setState({ disable_next: true })
      this._isMounted && this.setState({ disable_prev: true })
      this._isMounted &&
        this.setState({ currpage: '1' }, () => {
          // console.log('No Data to load')
        })
    } else if (items === 0) {
      // console.log('5: Enable Next')
      // console.log('5: Disable Prev')
      this._isMounted && this.setState({ disable_next: false })
      this._isMounted && this.setState({ disable_prev: true })
      this._isMounted &&
        this.setState({ currpage: '1' }, () => {
          this.loadData()
        })
    }

    if (currpage > 1) {
      // console.log('5: Allow Previous')
      this._isMounted && this.setState({ disable_prev: false })
    } else {
      // console.log('6: Disable Previous')
      this._isMounted && this.setState({ disable_prev: true })
    }
  }

  toggle(e) {
    var action = e.currentTarget.dataset.id
    if (action === 'submit') {
      this.emptyTrash(e)
    }
    this._isMounted &&
      this.setState({
        modal: !this.state.modal,
      })
  }

  emptyTrash(e) {
    e.preventDefault()

    const url = REACT_APP_RESTAPI + 'modules/mail/mail.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'emptytrash')
    formData.append('user_id', this.state.user_id)

    axios({
      method: 'post',
      url: url,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        console.log(response.data)

        if (response.data.success === true) {
          this.notify('tr', response.data.msg)
          setTimeout(() => {
            //   window.location.reload()
          }, 2000)
        }
      })
      .catch(function (response) {
        //handle error
        //console.log(response)
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
          <div>Reloading...</div>
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
    const { error, isLoaded } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div></div>
    } else {
      return (
        <div>
          <div className="content">
            <Row>
              <Col md={12}>
                <div className="page-title">
                  <div className="float-left">
                    <h1 className="title">Mailbox</h1>
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
                        <div className="">
                          <div className="row">
                            <div className="form-group col-6">
                              <Label htmlFor="select-user">Select User</Label>
                              <Input
                                className="select-user"
                                type="select"
                                id="select-user"
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

                            <div className="form-group col-6">
                              <Label htmlFor="inputname6">Search</Label>
                              <div
                                className="input-group"
                                title={
                                  'Enter your search and press enter. Minimum ' +
                                  MINSEARCHLENGTH +
                                  ' characters.'
                                }
                              >
                                <input
                                  placeholder="Search"
                                  type="text"
                                  className="form-control"
                                  value={this.state.search}
                                  onKeyUp={(e) => this.searchEntered(e)}
                                  onChange={(e) => this.searchEntered(e)}
                                  data-id={'search-input'}
                                />
                                <div
                                  className="input-group-append"
                                  onClick={(e) => this.searchEntered(e)}
                                  data-id="search-button"
                                >
                                  <span className="input-group-text">
                                    <i className="icon-xs i-magnifier icon-secondary"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-12">
                              <h2 className="mail_head float-left">
                                {this.state.pagetitle}
                              </h2>
                              {/* <div className="float-left">
                                {this.state.pagetype === 'trash' ? (
                                  <button
                                    type="button"
                                    className="btn btn-sm totrash"
                                    onClick={(e) => this.toggle(e)}
                                    title="Delete all trash mails permanently"
                                  >
                                    <i className="i-trash icon-xs"></i> Empty
                                    Trash
                                  </button>
                                ) : (
                                  ''
                                )}
                              </div> */}
                              <div className="mail-pagearrows float-right">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-default btn-icon prevpage"
                                  data-id={'previous'}
                                  onClick={(e) => this.loadPage(e)}
                                  title="Previous"
                                  disabled={this.state.disable_prev}
                                >
                                  <i className="i-arrow-left icon-xs"></i>
                                </button>
                                <span>{this.state.currpage}</span>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-default btn-icon nextpage"
                                  data-id={'next'}
                                  onClick={(e) => this.loadPage(e)}
                                  title="Next"
                                  disabled={this.state.disable_next}
                                >
                                  <i className="i-arrow-right icon-xs"></i>
                                </button>
                              </div>

                              <div className="form-group float-right mail-perpage">
                                Mails Per Page
                                <Input
                                  type="select"
                                  data-id="pagecount"
                                  name="pagecount"
                                  value={this.state.pagecount}
                                  onChange={(e) => this.loadPage(e)}
                                >
                                  <option value="10">10</option>
                                  <option value="20">20</option>
                                  <option value="50">50</option>
                                  <option value="100">100</option>
                                  <option value="200">200</option>
                                </Input>
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="float-left mail_more_btn">
                              <UncontrolledDropdown>
                                <DropdownToggle caret>All</DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem>All</DropdownItem>
                                  <DropdownItem>Read</DropdownItem>
                                  <DropdownItem>Unread</DropdownItem>
                                  <DropdownItem>Starred</DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </div>

                            <div className="float-right mail_nav">
                              <button
                                className="btn btn-default btn-icon"
                                rel="tooltip"
                                data-color-class="primary"
                                data-animate=" animated fadeIn"
                                data-toggle="tooltip"
                                data-original-title="Previous"
                                data-placement="top"
                              >
                                <i className="i-arrow-left-circle"></i>
                              </button>
                              <button
                                className="btn btn-default btn-icon"
                                rel="tooltip"
                                data-color-class="primary"
                                data-animate=" animated fadeIn"
                                data-toggle="tooltip"
                                data-original-title="Next"
                                data-placement="top"
                              >
                                <i className="i-arrow-right-circle"></i>
                              </button>
                            </div>
                            <span className="float-right mail_count_nav text-muted">
                              <strong>1</strong> to <strong>20</strong> of 3247
                            </span>
                          </div>

                          <Mailbox
                            ref={this.UpdateMailbox}
                            mailbox={this.state.fetch}
                            user_id={this.state.user_id}
                            {...this.props}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="notification-popup">
                  <NotificationAlert ref="notificationAlert" />
                </div>

                <div>
                  <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                  >
                    <ModalHeader toggle={this.toggle}>Empty Trash</ModalHeader>
                    <ModalBody>
                      All the trash mails will be deleted permanently. Are you
                      sure you want to empty trash ?
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        className="btn btn-sm"
                        color="danger"
                        data-id="submit"
                        onClick={this.toggle}
                      >
                        Empty Trash
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
              </Col>
            </Row>
          </div>
        </div>
      )
    }
  }
}

export default Mailinbox
