import React, { Component } from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//import Routes from './Routes'
import './assets/scss/index.scss'

import Routes from './Routes'

toast.configure({
  autoClose: 5000,
  draggable: false,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  //transition: 'flip',
})

const loading = () => <div className="animated fadeIn pt-3 text-center">Carregando...</div>

class App extends Component {
  render() {
    const history = createMemoryHistory()

    return (
      <Router history={history}>
        <React.Suspense fallback={loading()}>
          <Routes/>
        </React.Suspense>
      </Router>
    )
  }
}

export default App
