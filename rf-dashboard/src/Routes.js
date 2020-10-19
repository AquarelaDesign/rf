import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Dashboard from './views/Main/Dashboard'
import NotFound from './views/NotFound'
import Login from './views/Login'

const Routes = () => {
  return (
    <Switch>
      <Route path="/rf/login" name="Login" render={props => <Login {...props}/>} />
      <Route path="/rf/home" name="Home" render={props => <Dashboard {...props}/>} />
      <Route path="/rf/404" name="Page 404" render={props => <NotFound {...props}/>} />
      <Route exact path="/rf" name="Login" render={props => <Login {...props}/>} />
      <Route exact path="/" name="Login" render={props => <Login {...props}/>} />
    </Switch>
  )
}

export default Routes
