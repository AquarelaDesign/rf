import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Dashboard from './views/Dashboard'
import NotFound from './views/NotFound'
import Login from './views/Login'

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/login" name="Login" render={props => <Login {...props}/>} />
      <Route exact path="/home" name="Home" render={props => <Dashboard {...props}/>} />
      <Route exact path="/404" name="Page 404" render={props => <NotFound {...props}/>} />
      <Route path="/" name="Login" render={props => <Login {...props}/>} />
    </Switch>
  )
}

export default Routes
