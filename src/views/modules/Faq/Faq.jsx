import React from 'react'
import { ACL } from 'components'
//import { App } from 'components'

import { Row, Col } from 'reactstrap'

import Faqslist from './Faqslist.jsx'
import axios from 'axios'

//var IMGDIR = process.env.REACT_APP_IMGDIR;

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class Faq extends React.Component {
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

    /*const url = REACT_APP_RESTAPI + "test.php";
            //const url = "https://api.randomuser.me/";
            fetch(url)
              .then(res => res.json())
              .then(
                (result) => {
                  this._isMounted && this.setState({
                    isLoaded: true,
                    items: result.items
                  });
                 // console.log("----------------");
                 // console.log(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                  this._isMounted && this.setState({
                    isLoaded: true,
                    error
                  });
                }
              )*/

    const url1 = REACT_APP_RESTAPI + 'modules/faq/faq.php'
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
        //console.log(response.data.items);
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
                    <h1 className="title">Faq</h1>
                  </div>
                </div>

                <div className="col-xl-12">
                  <section className="box ">
                    <header className="panel_header">
                      <h2 className="title float-left">All Faqs</h2>
                    </header>
                    <div className="content-body">
                      <div className="row">
                        <div className="col-12">
                          <Faqslist faqs={this.state.fetch} {...this.props} />
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

export default Faq

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
