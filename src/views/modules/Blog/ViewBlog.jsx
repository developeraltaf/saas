import React from 'react'
import { ACL } from 'components'

import { Row, Col } from 'reactstrap'

//import { NavLink } from 'react-router-dom'

import {} from 'components'
import Parser from 'html-react-parser'
import axios from 'axios'

//var IMGDIR = process.env.REACT_APP_IMGDIR

var REACT_APP_RESTAPI = process.env.REACT_APP_RESTAPI
class ViewBlog extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      user_id: '',
      userinfo: '',
      title: '',
      brief: '',
      attachment: '',
      attachment_disp: [],
      blog_category: '',
      response: '',
      id: '',
      blog_date: '',
      description: '',
      comments: [],
    }

    this.loadData = this.loadData.bind(this)
  }

  async componentDidMount() {
    this._isMounted = true

    const search = window.location.search
    const params = new URLSearchParams(search)
    //const getid = "";
    //console.log(params.has('id'));
    //console.log(this.props.location.search);
    if (params.has('id')) {
      const getid = params.get('id')
      //console.log(getid);
      this._isMounted && this.setState({ id: getid })
      //console.log("true");
      this.loadData(getid)
    } else {
      //console.log("false");
    }
  }

  loadData(id) {
    //event.preventDefault();
    //this._isMounted && this.setState({ response: ""});
    //console.log(this.state);
    //console.log(this.state.image);

    const url = REACT_APP_RESTAPI + 'modules/blog/blog.php'
    let user = ACL.getUser()
    var tzoffset = ACL.getUserTimeZone()
    let formData = new FormData()
    formData.append('auth_user', user.id)
    formData.append('auth_type', user.usertype)
    formData.append('auth_token', user.token)
    formData.append('action', 'fetch')
    formData.append('user', 'userimage')
    formData.append('category', 'name')
    formData.append('load', 'comments')
    formData.append('id', id)
    formData.append('time', tzoffset)
    axios({
      method: 'post',
      url: url,
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        //handle success
        // console.log('||||||||||||||')
        // console.log(response.data.attachment)
        // console.log(response.data)

        if (response.data.success === true) {
          this._isMounted && this.setState({ userinfo: response.data.userinfo })
          this._isMounted && this.setState({ user_id: response.data.user_id })
          this._isMounted && this.setState({ title: response.data.title })
          this._isMounted && this.setState({ brief: response.data.brief })
          this._isMounted &&
            this.setState({
              blog_category: response.data.blog_category,
            })
          this._isMounted &&
            this.setState({ attachment: response.data.attachment })
          this._isMounted &&
            this.setState({
              attachment_disp: response.data.attachment,
            })
          this._isMounted &&
            this.setState({ blog_date: response.data.blog_date }, () => {
              // console.log(this.state.blog_date)
            })
          this._isMounted &&
            this.setState({
              description: response.data.description,
            })
          this._isMounted && this.setState({ comments: response.data.comments })
        }
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
      <div>
        <div className="content">
          <Row>
            <Col xs={12} md={12}>
              <div className="page-title">
                <div className="float-left">
                  <h1 className="title">View Blog</h1>
                </div>
              </div>

              <div className="col-xl-12">
                <section className="box ">
                  <header className="panel_header">
                    <h2 className="title float-left">Blog Details</h2>
                  </header>
                  <div className="content-body">
                    {' '}
                    <div className="row">
                      <div className="col-12">
                        <div className="blog_post full_blog_post">
                          <h3>{this.state.title}</h3>

                          <h5>
                            By: {this.state.userinfo} On: {this.state.blog_date}
                          </h5>

                          <p className="blog_info">
                            {/* {this.state.comments.length > 0 ? (
                              <span>
                                <i className="i-bubble"></i>{' '}
                                <a href="#comments">
                                  {this.state.comments.length} comments
                                </a>{' '}
                                &nbsp;&nbsp;&nbsp;&nbsp;{' '}
                              </span>
                            ) : (
                              ''
                            )} */}
                            <i className="i-tag"></i> {this.state.blog_category}
                          </p>

                          <div className="blog-content">
                            {this.state.attachment_disp.map((item, key) => (
                              <div className="" key={key}>
                                <img
                                  className="media-object"
                                  alt="attachment"
                                  src={REACT_APP_RESTAPI + '' + item.name}
                                  style={{
                                    width: '100%',
                                  }}
                                />
                              </div>
                            ))}
                            {Parser(this.state.description)}
                          </div>

                          {/* <div id="comments">
                            <h3>Comments</h3>

                            {this.state.comments.map((item, key) => (
                              <div
                                key={key}
                                className="card comment-block level-1"
                                style={{
                                  display: 'inline-block',
                                }}
                              >
                                <div className="row margin-0">
                                  <div className="col-lg-1 col-md-1 col-sm-2 col-3 img-area">
                                    <img
                                      alt=""
                                      src={
                                        REACT_APP_RESTAPI +
                                        '' +
                                        item.userinfo.image
                                      }
                                    />
                                  </div>
                                  <div className="col-lg-11 col-md-11 col-sm-10 col-9 text-area">
                                    <h6 className="author">
                                      By{' '}
                                      <a href="#!">
                                        {item.userinfo.username != ''
                                          ? item.userinfo.name +
                                            ' (' +
                                            item.userinfo.username +
                                            ')'
                                          : item.name}
                                      </a>{' '}
                                      on {item.comment_date}.
                                    </h6>
                                    <div>
                                      <p>{item.message}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {this.state.comments.length == 0
                              ? 'No Comments posted on this blog yet'
                              : ''}
                          </div> */}
                        </div>
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

export default ViewBlog
