/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import produce from 'immer'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Ws from '@adonisjs/websocket-client'
import Pusher from 'pusher-js'
// import pushid from 'pushid'

import {
  // loadMotoristas,
  loadCargas,
  loadTransportes,
  loadEntregas
} from '../../services/api'

import api from '../../services/rf'

import BoardContext from './context'

import List from '../List'

import { Container } from './styles'

// const dataM = loadMotoristas()
const dataC = loadCargas()
const dataT = loadTransportes()
const dataE = loadEntregas()

const ws = Ws('ws://31.220.50.222:3333')
ws.connect()

const Board = () => {
  const history = useHistory()

  const [isConnected, setIsConnected] = useState(false)
  const [lastConnected, setLastConnected] = useState('')

  const [motorista, setMotorista] = useState({
    title: "MOTORISTAS ONLINE",
    icon: "FaTruck",
    tipo: "M",
    creatable: true,
    cards: []
  })
  const [carga, setCarga] = useState(dataC)
  const [transporte, setTransporte] = useState(dataT)
  const [entrega, setEntrega] = useState(dataE)

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const verificaStatus = async () => {
    let delay = 10000

    await sleep(delay)

    const storeToken = localStorage.getItem('@rf/token')

    if (storeToken === '') {
      localStorage.removeItem('@rf/token')
      history.push('/')
    }

    ws.on('open', () => {
      setIsConnected(true)
      console.log('*** ws open')
    })

    ws.on('pong', () => {
      console.log('*** ws pong')
    })

    // ws.on('close', () => {
    //   console.log('*** ws.close')
    //   setIsConnected(false)
    // })

    if (isConnected) {
      let chat = undefined
      try {
        chat = ws.subscribe('chat')
      } catch (error) {
        chat = ws.getSubscription('chat')
      }

      chat.on('ready', () => {
        chat.emit('message', '*** Client ready')
      })

      chat.on('message', (data) => {
        if (lastConnected !== data.message) {
          setLastConnected(data.message)
          // toast(data.message, { type: data.tipo })
        }
      })

      chat.on('error', (error) => {
        console.log('*** ws.error', error)
      })

      chat.on('close', () => {
        console.log('*** ws.close')
        setIsConnected(false)
      })
    }

    await api.get('/status', {})
      .then(res => {
        const loadMotorista = {
          title: "MOTORISTAS ONLINE",
          icon: "FaTruck",
          tipo: "M",
          creatable: true,
          cards: res.data
        }
        setMotorista(loadMotorista)
      })
      .catch(error => {
        let timerId = setTimeout(function request() {
          if (request) {
            delay *= 2
          }
          timerId = setTimeout(request, delay)
        }, delay)
      })
  }

  verificaStatus()

  /*
  useEffect(() => {
    try {

      const storeToken = localStorage.getItem('@rf/token')

      if (storeToken === '') {
        localStorage.removeItem('@rf/token')
        history.push('/')
      }

      ws.on('open', () => {
        setIsConnected(true)
        console.log('*** ws open')
      })

      ws.on('pong', () => {
        console.log('*** ws pong')
      })

      // ws.on('close', () => {
      //   console.log('*** ws.close')
      //   setIsConnected(false)
      // })

      if (isConnected) {
        const chat = ws.subscribe('chat')

        chat.on('ready', () => {
          chat.emit('message', '*** Client ready')
        })

        chat.on('message', (data) => {
          if (lastConnected !== data.message) {
            setLastConnected(data.message)
            // toast(data.message, { type: data.tipo })
          }
        })

        chat.on('error', (error) => {
          console.log('*** ws.error', error)
        })

        chat.on('close', () => {
          console.log('*** ws.close')
          setIsConnected(false)
        })
      }
    } catch (error) {
      const { response } = error
      if (response !== undefined) {
        if (response.status === 401) {
          // volta()
          history.push('/')
        }
        // toast(response.status !== 401 ? response.data[0].message : 'Senha inválida!', {type: 'error'})
      } else {
        // toast(error, {type: 'error'})
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, lastConnected, history])
  */

  useEffect(() => {
    try {
      if (lastConnected === '') {
        verificaStatus()
      }
      const pusher = new Pusher('802301f67a0437e55a19', {
        cluster: 'us2',
        encrypted: true,
      })

      const channel = pusher.subscribe('status-channel')
      channel.bind('results', res => {
        const loadMotorista = {
          title: "MOTORISTAS ONLINE",
          icon: "FaTruck",
          tipo: "M",
          creatable: true,
          cards: res.data
        }
        setMotorista(loadMotorista)
      })

    } catch (error) {
      const { response } = error
      if (response !== undefined) {
        if (response.status === 401) {
          volta()
        }
        // toast(response.status !== 401 ? response.data[0].message : 'Senha inválida!', {type: 'error'})
      } else {
        toast(error, { type: 'error' })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history])

  useEffect(() => {
    try {
      api.post('/buscausuarios', {
        email: '',
        tipo: 'M',
        status: 'A',
        estado: ' ',
      }).then(res => {
        // console.log('*** buscausuarios', res)
        // const { token } = res.data
        const loadMotorista = {
          title: "MOTORISTAS ONLINE",
          icon: "FaTruck",
          tipo: "M",
          creatable: true,
          cards: res.data
        }
        setMotorista(loadMotorista)
      }).catch((error) => {
        if (error.response) {
          console.error('*** c-1.1', error)
          volta()
        } else if (error.request) {
          console.error('*** c-1.2', error)
        } else {
          console.error('*** c-1.3')
        }
        // console.error('c-1',error)
        // history.push('/')
      })

    } catch (error) {
      console.log('*** error', error)
      const { response } = error
      if (response !== undefined) {
        if (response.status === 401) {
          volta()
        }
        // toast(response.status !== 401 ? response.data[0].message : 'Senha inválida!', {type: 'error'})
      } else {
        toast(error, { type: 'error' })
      }
    }
  }, [history])

  const volta = () => {
    // toast('Erro na autenticação do usuário!', { type: 'error' })
    // localStorage.removeItem('@rf/token')
    // history.push('/')
  }

  /*
  const verificaStatus = async () => {
    try {
      api.get('/status', {})
        .then(res => {
          // console.log('*** status', res)
          // const { token } = res.data
          const loadMotorista = {
            title: "MOTORISTAS ONLINE",
            icon: "FaTruck",
            tipo: "M",
            creatable: true,
            cards: res.data
          }
          setMotorista(loadMotorista)
        })
        .catch(error => {
          // console.error('c-2',error)
        })
    } catch (error) {
      console.log('*** vserror', error)
      const { response } = error
      if (response !== undefined) {
        if (response.status === 401) {
          history.push('/')
        }
        // toast(response.status !== 401 ? response.data[0].message : 'Senha inválida!', {type: 'error'})
      } else {
        toast(error, { type: 'error' })
      }
    }
  }
  */

  const move = (fromList, toList, from, to) => {
    // console.log('*** Board_move', fromList, toList, from, to)
    setMotorista(produce(motorista, draft => {
      const dragged = draft[fromList].cards[from];
      draft[fromList].cards.splice(from, 1);
      draft[toList].cards.splice(to, 0, dragged);
    }))

    // eslint-disable-next-line default-case
    switch (fromList) {
      case 0:
        setMotorista(produce(motorista, draft => {
          motorista.cards.splice(from, 1);

          const dragged = motorista.cards[from];
          draft[motorista].cards.splice(from, 1);
          draft[carga].cards.splice(to, 0, dragged);
        }))
        break
      // case 1: 
      //   setCarga(produce(carga, draft => {
      //     carga.cards.splice(from, 1);
      //   }))
      // break
      // case 2: 
      // setTransporte(produce(transporte, draft => {
      //   transporte.cards.splice(from, 1);
      //   }))
      // break
      // case 3:
      //   setEntrega(produce(entrega, draft => {
      //     entrega.cards.splice(from, 1);
      //   }))
      // break
    }


  }

  const removeM = (from) => {
    // setMotorista(motorista.cards.splice(from, 1))
    setMotorista(produce(motorista, draft => {
      motorista.cards.splice(from, 1)
      console.log('*** Board_removeItem-1', motorista)
    }))
  }

  const removeItem = (fromList, from) => {
    // console.log('Board_removeItem', fromList, from, motorista)
    // eslint-disable-next-line default-case
    switch (fromList) {
      case 0:
        setMotorista(produce(motorista, draft => {
          motorista.cards.splice(from, 1);
          // console.log('Board_removeItem-1', motorista)
        }))
        break
      // case 1: 
      //   setCarga(produce(carga, draft => {
      //     carga.cards.splice(from, 1);
      //   }))
      // break
      // case 2: 
      // setTransporte(produce(transporte, draft => {
      //   transporte.cards.splice(from, 1);
      //   }))
      // break
      // case 3:
      //   setEntrega(produce(entrega, draft => {
      //     entrega.cards.splice(from, 1);
      //   }))
      // break
    }
  }

  return (
    <BoardContext.Provider value={{
      move, removeItem, removeM,
    }}>
      <Container>
        <List key={motorista.title} data={motorista} />
        <List key={carga.title} data={carga} />
        <List key={transporte.title} data={transporte} />
        <List key={entrega.title} data={entrega} />
      </Container>
    </BoardContext.Provider>
  );
}

export default Board