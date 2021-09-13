import React from 'react'
import { ACL } from 'components'
//import { App } from 'components'

import { Row, Col } from 'reactstrap'
import { NavLink } from 'react-router-dom'

import Portfolioslist from './Portfolioslist.jsx'
import axios from 'axios'

//var IMGDIR = process.env.REACT_APP_IMGDIR;

var BASEDIR = process.env.REACT_APP_BASEDIR
var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Portfolio extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      fetch: [],
      error: null,
      isLoaded: false,
      //items: []
    }
  }

  async componentDidMount() {
    this._isMounted = true

    //console.log(auth);
    //auth.logout();
    //ACL.login("jay", "1234")
    //auth.staticfunc("hi","11");

    const url1 = REACT_APP_RESTAPI + 'modules/portfolio/portfolio.php'
    let user = ACL.getUser()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch-all')
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
        //console.log("----------------");
        // console.log(response.data.items)
        this._isMounted &&
          this.setState({
            fetch: response.data.items,
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
    //const logic = authlogic.login("hi","112");

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
            <Row>
              <Col xs={12} md={12}>
                <div className="page-title">
                  {this.props.loadat === 'dashboard' ? (
                    <div>
                      <div className="float-left">
                        <h1 className="title">New Portfolios</h1>
                      </div>
                      <div className="viewall-module">
                        <NavLink
                          to={BASEDIR + '/zak/portfolios'}
                          className="btn btn-sm"
                        >
                          View All Portfolios
                        </NavLink>
                      </div>
                    </div>
                  ) : (
                    <div className="float-left">
                      <h1 className="title">Portfolio</h1>
                    </div>
                  )}
                </div>

                <div className="col-xl-12">
                  <section className="box ">
                    {this.props.loadat !== 'dashboard' ? (
                      <header className="panel_header">
                        <h2 className="title float-left">All Portfolios</h2>
                      </header>
                    ) : (
                      <div className="header-spacer"></div>
                    )}
                    <div className="content-body">
                      <div className="row">
                        <div className="col-12">
                          <Portfolioslist
                            portfolios={this.state.fetch}
                            {...this.props}
                          />
                        </div>
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

export default Portfolio

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
