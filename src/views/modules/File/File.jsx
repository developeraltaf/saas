import React from 'react'
import { ACL } from 'components'
import { App } from 'components'

import { Row, Col } from 'reactstrap'
import Datatable from 'react-bs-datatable'
import { NavLink } from 'react-router-dom'

//import { Fileslist } from 'components';

import axios from 'axios'
import Parser from 'html-react-parser'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import NotificationAlert from 'react-notification-alert'

//var IMGDIR = process.env.REACT_APP_IMGDIR;

var BASEDIR = process.env.REACT_APP_BASEDIR
var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI

class File extends React.Component {
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
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle(e) {
    var action = e.currentTarget.dataset.id
    // console.log(e.currentTarget.dataset.id)
    if (action !== 'submit') {
      this._isMounted &&
        this.setState({
          deleteid: action,
        })
    }
    if (action === 'submit') {
      var checkmode = App.check_app_mode(e)
      if (!checkmode['allow']) {
        this.notify('tr', checkmode['msg'], false)
      } else {
        this.props.history.push('delete-file?id=' + this.state.deleteid)
      }
    }
    this._isMounted &&
      this.setState({
        modal: !this.state.modal,
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

    const url1 = REACT_APP_RESTAPI + 'modules/file/file.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-all')
    formData.append('display', 'username')
    formData.append('id', '')
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

        // console.log(response)
        var itemsarr = response.data.items

        itemsarr.forEach(function (item, i) {
          //console.log(item["image"]);
          itemsarr[i]['name'] = Parser(
            '<' +
              'img src="' +
              REACT_APP_RESTAPI +
              item['thumb'] +
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
        title: 'File',
        prop: 'name',
        sortable: true,
        filterable: this.props.loadat !== 'dashboard' ? true : false,
      },
      {
        title: 'Title',
        prop: 'title',
        sortable: true,
        filterable: this.props.loadat !== 'dashboard' ? true : false,
      },
      {
        title: 'Type',
        prop: 'type',
        sortable: true,
        filterable: this.props.loadat !== 'dashboard' ? true : false,
      },
      {
        title: 'Module',
        prop: 'moduleinfo',
        sortable: true,
        filterable: this.props.loadat !== 'dashboard' ? true : false,
      },
      {
        title: 'File Owner',
        prop: 'username',
        sortable: true,
        filterable: this.props.loadat !== 'dashboard' ? true : false,
      },
      {
        title: 'Actions',
        prop: 'actions',
        sortable: false,
        filterable: false,
        cell: (row) => (
          <p>
            <a href={'add-file?id=' + row.id} className="btn btn-xs editlink">
              Edit
            </a>{' '}
            &nbsp;{' '}
            <span
              className="text-danger textlink btn btn-xs dellink"
              value={row.id}
              data-id={row.id}
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
                        <h1 className="title">New Files</h1>
                      </div>
                      <div className="viewall-module">
                        <NavLink
                          to={BASEDIR + '/zak/files'}
                          className="btn btn-sm"
                        >
                          View All Files
                        </NavLink>
                      </div>
                    </div>
                  ) : (
                    <div className="float-left">
                      <h1 className="title">Uploaded Files</h1>
                    </div>
                  )}
                </div>

                <div className="col-xl-12">
                  <section className="box ">
                    {this.props.loadat !== 'dashboard' ? (
                      <header className="panel_header">
                        <h2 className="title float-left">All Files</h2>
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
                            Confirm Delete
                          </ModalHeader>
                          <ModalBody>
                            Are you sure you want to delete file ID:{' '}
                            {this.state.deleteid} ?
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              className="btn btn-sm"
                              color="danger"
                              data-id="submit"
                              onClick={this.toggle}
                            >
                              Delete
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

export default File

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
