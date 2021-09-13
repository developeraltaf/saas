import React from 'react'
import { ACL } from 'components'
// import { App } from 'components'

import { Row, Col } from 'reactstrap'
import Datatable from 'react-bs-datatable'

//import { Mailcategoryslist } from 'components';

import axios from 'axios'
// import Parser from 'html-react-parser'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

//var IMGDIR = process.env.REACT_APP_IMGDIR;

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Mailcategory extends React.Component {
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
      this.props.history.push('delete-mailcategory?id=' + this.state.deleteid)
    }
    this._isMounted &&
      this.setState({
        modal: !this.state.modal,
      })
  }

  async componentDidMount() {
    this._isMounted = true

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

        var itemsarr = response.data.items
        //console.log(response);

        itemsarr.forEach(function (item, i) {
          //console.log(item["image"]);
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
      { title: 'ID', prop: 'id', sortable: false, filterable: true },
      { title: 'Name', prop: 'name', sortable: true, filterable: true },
      {
        title: 'URL Slug',
        prop: 'slug',
        sortable: true,
        filterable: true,
      },
      {
        title: 'Brief Description',
        prop: 'brief',
        sortable: true,
        filterable: true,
      },
      {
        title: 'Actions',
        prop: 'actions',
        sortable: false,
        filterable: false,
        cell: (row) => (
          <p>
            <a
              href={'add-mailcategory?id=' + row.id}
              className="btn btn-xs editlink"
            >
              Edit
            </a>{' '}
            &nbsp;{' '}
            <span
              className="text-danger textlink btn btn-xs dellink"
              value={row.id}
              data-id={row.id}
              data-title={row.name}
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
        <div>
          <div className="content">
            <Row>
              <Col xs={12} md={12}>
                <div className="page-title">
                  <div className="float-left">
                    <h1 className="title">Mail Categories</h1>
                  </div>
                </div>

                <div className="col-xl-12">
                  <section className="box ">
                    <header className="panel_header">
                      <h2 className="title float-left">All Mail Categories</h2>
                    </header>
                    <div className="content-body">
                      <div className="row">
                        <div className="col-12 table-data">
                          <Datatable
                            tableHeader={header}
                            tableBody={this.state.tablebody}
                            keyName="userTable"
                            tableClass="striped table-hover "
                            rowsPerPage={10}
                            rowsPerPageOption={[5, 10, 15, 20]}
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
                            Are you sure you want to delete mail category:{' '}
                            {this.state.deletetitle} ?
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

export default Mailcategory

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
