import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import { Router, Route, Switch } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.css'
/*import 'font-awesome/css/font-awesome.min.css';*/
import 'assets/scss/zak-admin.css'
import 'assets/fonts/simple-line-icons.css'

import indexRoutes from 'routes/index.jsx'

const hist = createBrowserHistory()

//console.log("Check authentic at root level:");

ReactDOM.render(
  <Router history={hist} basename={process.env.REACT_APP_BASEDIR}>
    <Switch>
      {indexRoutes.map((prop, key) => {
        //console.log(prop);
        return <Route path={prop.path} key={key} component={prop.component} />
      })}
    </Switch>
  </Router>,
  document.getElementById('root'),
)
