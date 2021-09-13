import React from 'react'
// javascript plugin used to create scrollbars on windows
// import PerfectScrollbar from 'perfect-scrollbar';
import { Route, Redirect, Switch } from 'react-router-dom'

import { Header, Footer, Sidebar, Stylebar } from 'components'

import dashboardRoutes from 'routes/zak.jsx'
import {
  topbarStyle,
  menuStyle,
  menuType,
  topbarType,
  navWidth,
} from 'variables/zak.jsx'
import { ACL } from 'components'
//var ps;

var BASEDIR = process.env.REACT_APP_BASEDIR

class ZakLayout extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      menuColor: menuStyle,
      topbarColor: topbarStyle,
      menuType: menuType,
      topbarType: topbarType,
    }
    this.menuSettings = this.menuSettings.bind(this)
    this.topbarSettings = this.topbarSettings.bind(this)
    this.userACLCheck = this.userACLCheck.bind(this)

    // console.log(
    //   '--------Check authentic user or not from constructor:-------- ',
    // )
    this.userACLCheck()
  }

  menuSettings(val1, val2) {
    this._isMounted &&
      this.setState({
        menuColor: val1,
        menuType: val2,
      })
  }
  topbarSettings(val1, val2) {
    this._isMounted &&
      this.setState({
        topbarColor: val1,
        topbarType: val2,
      })
  }

  userACLCheck() {
    //console.log('----------||--------')
    //console.log(this.props.location.pathname)
    //console.log(ACL.isUserACLenticated())
    //console.log(ACL.getUser())
    //console.log('isACLExpired: ' + ACL.isACLExpired())

    var url = ''
    if (
      this.props.location.pathname !== '' ||
      this.props.location.pathname !== null
    ) {
      url = this.props.location.pathname
    }

    var authentic = ACL.isUserACLenticated()
    var expired = ACL.isACLExpired()
    if (!authentic) {
      this.props.history.push('../login')
    } else if (expired) {
      this.props.history.push('../lockscreen?url=' + url)
    }
    //console.log('----------||--------')
  }

  componentWillMount() {
    //console.log('Component will mount called')
  }
  componentDidMount() {
    this._isMounted = true

    /*if(navigator.platform.indexOf('Win') > -1){
            ps = new PerfectScrollbar(this.refs.mainPanel);
            document.body.classList.toggle("perfect-scrollbar-on");
        }*/
  }
  componentWillUnmount() {
    this._isMounted = false

    /*if(navigator.platform.indexOf('Win') > -1){
            ps.destroy();
            document.body.classList.toggle("perfect-scrollbar-on");
        }*/
  }
  componentDidUpdate(e) {
    if (e.history.action === 'PUSH') {
      this.refs.mainPanel.scrollTop = 0
      document.scrollingElement.scrollTop = 0
    }
    //console.log('--------Zak Component did update called--------')
    this.userACLCheck()
  }

  render() {
    return (
      <div
        className="wrapper"
        ref="themeWrapper"
        data-menu={this.state.menuColor}
        data-topbar={this.state.topbarColor}
        data-menutype={this.state.menuType}
        data-topbartype={this.state.topbarType}
      >
        <Header {...this.props} navtype={navWidth} admintype={'zak'} />
        <Sidebar {...this.props} routes={dashboardRoutes} admintype={'zak'} />
        <div className="main-panel" ref="mainPanel">
          <Switch>
            {dashboardRoutes.map((prop, key) => {
              //console.log('Location: ' + this.props.location.pathname)
              if (this.props.location.pathname === prop.path) {
                //console.log('Location:- ' + prop.path)
                if (prop.path === BASEDIR + '/' || prop.path === '/') {
                  return (
                    <Redirect
                      from={prop.path}
                      to={'/app/zak/dashboard'}
                      key={key}
                    />
                  )
                }
                return (
                  <Route
                    path={prop.path}
                    component={prop.component}
                    key={key}
                  />
                )
              }
              if (prop.redirect) {
                //console.log('redirect')
                return <Redirect from={prop.path} to={prop.pathTo} key={key} />
              }
              return (
                <Route path={prop.path} component={prop.component} key={key} />
              )
              //return ("");
            })}
          </Switch>
          <Footer fluid />
        </div>
        <Stylebar
          menuSettings={this.menuSettings}
          topbarSettings={this.topbarSettings}
        />
      </div>
    )
  }
}

export default ZakLayout
