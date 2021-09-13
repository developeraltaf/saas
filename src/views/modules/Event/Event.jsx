import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col } from 'reactstrap'
import Datatable from 'react-bs-datatable'
import { NavLink } from 'react-router-dom'
import NotificationAlert from 'react-notification-alert'

//import { Eventslist } from 'components';

import axios from 'axios'
import Parser from 'html-react-parser'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

//var IMGDIR = process.env.REACT_APP_IMGDIR;

var BASEDIR = process.env.REACT_APP_BASEDIR
var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Event extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      fetch: [],
      tablebody: [],
      error: null,
      isLoaded: false,
      modal: false,
      deleteid: '',
      deletetitle: '',
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle(e) {
    let action = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    // console.log(e.currentTarget.dataset.id)
    if (action !== 'submit') {
      this._isMounted &&
        this.setState({
          deleteid: action,
          deletetitle: title,
        })
    }
    if (action === 'submit') {
      var checkmode = App.check_app_mode(e)
      if (!checkmode['allow']) {
        this.notify('tr', checkmode['msg'], false)
      } else {
        this.props.history.push('delete-event?id=' + this.state.deleteid)
      }
    }
    this._isMounted &&
      this.setState({
        modal: !this.state.modal,
      })
    //}
  }

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

    const url1 = REACT_APP_RESTAPI + 'modules/event/event.php'
    let user = ACL.getUser()
    var tzoffset = ACL.getUserTimeZone()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-all')
    formData.append('user', 'userimage')
    formData.append('contact', 'userimage')
    formData.append('category', 'name')
    formData.append('id', '')
    formData.append('time', tzoffset)
    if (this.props.loadat === 'dashboard') {
      formData.append('limit', this.props.limit)
      formData.append('order', 'id desc')
    }
    axios({
      method: 'post',
      url: url1,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        // console.log('----------------')

        var itemsarr = response.data.items
        // console.log(response.data)

        itemsarr.forEach(function (item, i) {
          //console.log(item["attachment"]);
          itemsarr[i]['disp_attachment'] = Parser(
            '<' +
              'img src="' +
              REACT_APP_RESTAPI +
              item['attachment']['name'] +
              '" class="img-fluid img-thumb"  >',
          )
        })
        //console.log(itemsarr);
        this._isMounted &&
          this.setState({ tablebody: itemsarr, isLoaded: true })
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
    const onSortFunction = {}

    const customLabels = {
      first: '<<',
      last: '>>',
      prev: '<',
      next: '>',
      show: 'Display ',
      entries: ' rows',
      noResults: 'There is no data to be displayed',
    }

    const header = [
      {
        title: 'ID',
        prop: 'id',
        sortable: false,
        filterable: this.props.loadat !== 'dashboard' ? true : false,
      },
      {
        title: 'Title',
        prop: 'title',
        sortable: true,
        filterable: this.props.loadat !== 'dashboard' ? true : false,
      },
      {
        title: 'From',
        prop: 'from_disptime_info',
        sortable: false,
        filterable: false,
      },
      {
        title: 'To',
        prop: 'to_disptime_info',
        sortable: false,
        filterable: false,
      },
      {
        title: 'Category',
        prop: 'event_category',
        sortable: false,
        filterable: false,
      },

      {
        title: 'Actions',
        prop: 'actions',
        sortable: false,
        filterable: false,
        cell: (row) => (
          <p>
            <a href={'add-event?id=' + row.id} className="btn btn-xs editlink">
              Edit
            </a>{' '}
            &nbsp;{' '}
            <span
              className="text-danger textlink btn btn-xs dellink"
              value={row.id}
              data-id={row.id}
              data-title={row.title}
              onClick={(e) => this.toggle(e)}
            >
              Delete
            </span>
          </p>
        ),
      },
    ]

    //const {records, isLoading} = this.state;
    const { error, isLoaded } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div></div>
    } else {
      return (
        <div
          className={this.props.loadat !== 'dashboard' ? '' : 'load-dashboard'}
        >
          <div className="content">
            <div className="notification-popup">
              <NotificationAlert ref="notificationAlert" />
            </div>
            <Row>
              <Col xs={12} md={12}>
                <div className="page-title">
                  {this.props.loadat === 'dashboard' ? (
                    <div>
                      <div className="float-left">
                        <h1 className="title">New Events</h1>
                      </div>
                      <div className="viewall-module">
                        <NavLink
                          to={BASEDIR + '/zak/events'}
                          className="btn btn-sm"
                        >
                          View All Events
                        </NavLink>
                      </div>
                    </div>
                  ) : (
                    <div className="float-left">
                      <h1 className="title">All Events</h1>
                    </div>
                  )}
                </div>

                <div className="col-xl-12">
                  <section className="box ">
                    {this.props.loadat !== 'dashboard' ? (
                      <header className="panel_header">
                        <h2 className="title float-left">All Events</h2>
                      </header>
                    ) : (
                      <div className="header-spacer"></div>
                    )}
                    <div className="content-body">
                      <div className="row">
                        <div className="col-12 table-data">
                          <Datatable
                            tableHeader={header}
                            tableBody={this.state.tablebody}
                            keyName="userTable"
                            tableClass="striped table-hover "
                            rowsPerPage={10}
                            rowsPerPageOption={
                              this.props.loadat !== 'dashboard'
                                ? [5, 10, 15, 20]
                                : []
                            }
                            initialSort={{
                              prop: 'id',
                              isAscending: true,
                            }}
                            onSort={onSortFunction}
                            labels={customLabels}
                          />
                        </div>
                      </div>

                      <div>
                        <Modal
                          isOpen={this.state.modal}
                          toggle={this.toggle}
                          className={this.props.className}
                        >
                          <ModalHeader toggle={this.toggle}>
                            Delete Event
                          </ModalHeader>
                          <ModalBody>
                            Are you sure you want to delete event:{' '}
                            {this.state.deletetitle} ?
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              className="btn-sm btn"
                              color="danger"
                              data-id="submit"
                              onClick={this.toggle}
                            >
                              Delete
                            </Button>{' '}
                            <Button
                              className="btn-sm btn"
                              color="secondary"
                              data-id="cancel"
                              onClick={this.toggle}
                            >
                              Cancel
                            </Button>
                          </ModalFooter>
                        </Modal>
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

export default Event

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
