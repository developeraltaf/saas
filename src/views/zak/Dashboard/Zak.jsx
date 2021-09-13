import React from 'react'
import { Row, Col } from 'reactstrap'
//import createHistory from 'history/createBrowserHistory'

import User from '../../modules/User/User'
import Album from '../../modules/Album/Album'
import Portfolio from '../../modules/Portfolio/Portfolio'
import Event from '../../modules/Event/Event'
import File from '../../modules/File/File'
import Blog from '../../modules/Blog/Blog'

//var IMGDIR = process.env.REACT_APP_IMGDIR

class Zak extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        <div className="content">
          <Row>
            <Col xs={12} md={12}>
              <div className="page-title">
                <div className="float-left">
                  <h1 className="title">Dashboard</h1>
                </div>
              </div>

              <User loadat="dashboard" limit="4" {...this.props} />
              <Blog loadat="dashboard" limit="4" {...this.props} />
              <Portfolio loadat="dashboard" limit="4" {...this.props} />
              <Album loadat="dashboard" limit="4" {...this.props} />
              <Event loadat="dashboard" limit="4" {...this.props} />
              <File loadat="dashboard" limit="10" {...this.props} />
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default Zak
