/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import produce from 'immer'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Ws from '@adonisjs/websocket-client'
import Pusher from 'pusher-js'
// import pushid from 'pushid'
import moment from 'moment'
// import CountDown from '../CountDown'
import formatDate from '../../../components/CountDown/format-date'

import api from '../../../services/rf'
import BoardContext from './context'
import List from '../List'
import { Container } from './styles'

const prot = window.location.protocol === 'http' ? 'ws' : 'wss'
const ws = Ws(`${prot}://www.retornofacil.com.br:3333`)
ws.connect()

const Board = ({filtro}) => {
  const history = useHistory()

  const [isConnected, setIsConnected] = useState(false)
  const [lastConnected, setLastConnected] = useState('')
  const [painel, setPainel] = useState('')

  // Logistica ------------------------------->
  const [motorista, setMotorista] = useState({
    title: "MOTORISTAS ONLINE",
    icon: "FaTruck",
    tipo: "M",
    creatable: true,
    cards: []
  })

  const [carga, setCarga] = useState({
    title: "CARGAS DISPONÍVEIS",
    icon: "FaBoxOpen",
    tipo: "C",
    creatable: true,
    cards: []
  })

  const [transporte, setTransporte] = useState({
    title: "TRANSPORTES", 
    icon: "FaArrowAltCircleRight",
    tipo: "T",
    creatable: false,
    cards: []
  })

  const [entrega, setEntrega] = useState({ 
    title: "ENTREGAS", 
    icon: "FaBox",
    tipo: "E",
    creatable: false,
    done: true,
    cards: []
  })
  // Logistica <-------------------------------

  // Fiscal ---------------------------------->
  const [emitirCTe, setEmitirCTe] = useState({
    title: "EMITIR CT-E", 
    icon: "FaArrowAltCircleRight",
    tipo: "E",
    creatable: false,
    cards: []
  })

  const [encerrarManifesto, setEncerrarManifesto] = useState({
    title: "ENCERRAR MANIFESTO", 
    icon: "FaArrowAltCircleRight",
    tipo: "X",
    creatable: false,
    cards: []
  })

  const [tarefasRealizadas, setTarefasRealizadas] = useState({
    title: "TAREFAS REALIZADAS", 
    icon: "FaArrowAltCircleRight",
    tipo: "T",
    creatable: false,
    cards: []
  })
  // Fiscal <----------------------------------

  // Financeiro ------------------------------>
  const [contasPagar, setContasPagar] = useState({
    title: "CONTAS A PAGAR", 
    icon: "FaArrowAltCircleRight",
    tipo: "P",
    creatable: false,
    cards: []
  })
  
  const [avarias, setAvarias] = useState({
    title: "AVARIAS", 
    icon: "FaArrowAltCircleRight",
    tipo: "A",
    creatable: true,
    cards: []
  })
  
  const [HistoricoPagar, setHistoricoPagar] = useState({
    title: "HISTÓRICO DE PAGAMENTOS", 
    icon: "FaArrowAltCircleRight",
    tipo: "H",
    creatable: false,
    cards: []
  })
  // Financeiro <------------------------------

  // Historico ------------------------------->
  const [HistoricoPedidos, setHistoricoPedidos] = useState({
    title: "HISTÓRICO DE PEDIDOS", 
    icon: "FaArrowAltCircleRight",
    tipo: "H",
    creatable: false,
    cards: []
  })
  // Historico <-------------------------------

  const [countdown, setCountdown] = useState(null)
  const [dateInFuture, setDateInFuture] = useState(moment(moment().add(1, 'minute'), 'YYYY-MM-DD'))
  const timer = useRef()

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    const storeToken = localStorage.getItem('@rf/token')

    // verificaStatus()
    // verificaStatus()

    if (storeToken === '') {
      localStorage.removeItem('@rf/token')
      history.push('/rf')
    }

    ws.on('open', () => {
      setIsConnected(true)
      // console.log('*** ws open')
    })

    ws.on('pong', () => {
      // console.log('*** ws pong')
    })

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
        // console.log('*** ws.error', error)
      })

      chat.on('close', () => {
        // console.log('*** ws.close')
        setIsConnected(false)
      })
    }

    const pusher = new Pusher('802301f67a0437e55a19', {
      cluster: 'us2',
      encrypted: true,
    })

    // console.log('**** Pusher Motoristas')
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

    // console.log('**** Pusher Pedidos')
    const channelp = pusher.subscribe('statusp-channel')
    channelp.bind('results', res => {
      const loadPedidos = {
        title: "CARGAS DISPONÍVEIS",
        icon: "FaBoxOpen",
        tipo: "C",
        creatable: true,
        cards: res.data
      }
      setCarga(loadPedidos)
    })

    const channelt = pusher.subscribe('statust-channel')
    channelt.bind('results', res => {
      const loadTransportes = {
        title: "TRANSPORTES", 
        icon: "FaArrowAltCircleRight",
        tipo: "T",
        creatable: false,
        cards: res.data
      }
      setTransporte(loadTransportes)
    })

    const channele = pusher.subscribe('statuse-channel')
    channele.bind('results', res => {
      const loadEntregas = {
        title: "ENTREGAS", 
        icon: "FaBox",
        tipo: "E",
        creatable: false,
        cards: res.data
      }
      setEntrega(loadEntregas)
    })

    return () => {
      ws.on('close', () => {
        // console.log('*** ws.close')
        setIsConnected(false)
      })
    }

  }, [])

  // const dateInFuture = moment(moment().add(1, 'minute'), 'YYYY-MM-DD')
  const onCountdownEnd = () => {
    // console.log('**** Contador Resetado', moment().format('HH:mm:ss'))
    setDateInFuture(moment(moment().add(2, 'seconds'), 'YYYY-MM-DD'))
    // verificaStatus()
  }

  const onTick = (delta) => {
    // console.log(delta)
    // console.log('****', moment(delta).format('HH:mm:ss'))
    verificaStatus()
  }

  const tick = () => {
    const [delta, lastCountdown] = formatDate(dateInFuture, 'HH:mm:ss', 'YYYY-MM-DD')

    // console.log('**** Board.tick')
    // verificaStatus()

    if (delta <= 0) {
      clearInterval(timer.current)
      timer.current = null

      onCountdownEnd()
    } else {
      setCountdown(lastCountdown)
      onTick(delta)
    }
  }

  // componentDidMount, componentWillUmnount
  useEffect(() => {
    // verificaStatus()

    tick()
    timer.current = setInterval(tick, 5000)

    return () => clearInterval(timer.current)
  }, [dateInFuture])


  const verificaStatus = async () => {
    // await setPainel(localStorage.getItem('@rf/painel'))
    
    let delay = 1000

    const token = await localStorage.getItem('@rf/token')

    if (!token) {
      history.push('/rf')
    }
    
    // console.log('**** Board.verificaStatus.filtro', filtro)

    try {

      await api.post('/buscausuarios', {
        cpfcnpj: filtro.motoristaCPF === undefined ? "" : filtro.motoristaCPF,
        nome: filtro.motoristaNome === undefined ? "" : filtro.motoristaNome,
        email: "",
        tipo: "M", 
    	  status: "A",
	      estado: " ",
      })
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
          console.log('**** Board.verificaStatus.Motoristas.error')

          /*
          let timerId = setTimeout(function request() {
            if (request) {
              delay *= 2
            }
            timerId = setTimeout(request, delay)
          }, delay)
          */
        })

      // console.log('**** Pedidos')
      await api.post('/buscapedidos', {
        status: "D",
        tipo: "C",
        id: filtro.pedido === undefined ? "" : filtro.pedido,
      })
        .then(res => {
          const loadPedidos = {
            title: "CARGAS DISPONÍVEIS",
            icon: "FaBoxOpen",
            tipo: "C",
            creatable: true,
            cards: res.data
          }
          setCarga(loadPedidos)
        })
        .catch(error => {
          console.log('**** Board.verificaStatus.Pedidos.error')
          
          /*
          let timerId = setTimeout(function request() {
            if (request) {
              delay *= 2
            }
            timerId = setTimeout(request, delay)
          }, delay)
          */
        })

      // console.log('**** Transportes')
      await api.post('/buscapedidos', {
        status: "",
        tipo: "T",
        estado: "P",
        cliente_id: "",
        motorista_id: "", 
        id: filtro.pedido === undefined ? "" : filtro.pedido,
      })
        .then(res => {
          const loadTransportes = {
            title: "TRANSPORTES", 
            icon: "FaArrowAltCircleRight",
            tipo: "T",
            creatable: false,
            cards: res.data
          }

          // console.log('**** Board.verificaStatus.Transportes.data', loadTransportes)
          setTransporte(loadTransportes)
        })
        .catch(error => {
          console.log('**** Board.verificaStatus.Transportes.error')
          /*
          let timerId = setTimeout(function request() {
            if (request) {
              delay *= 2
            }
            timerId = setTimeout(request, delay)
          }, delay)
          */
        })

      // console.log('**** Entregas')
      await api.post('/buscapedidos', {
        status: "O",
        tipo: "E",
        estado: "",
        cliente_id: "",
        motorista_id: "", 
        id: filtro.pedido === undefined ? "" : filtro.pedido,
      })
        .then(res => {
          const loadEntregas = {
            title: "ENTREGAS", 
            icon: "FaBox",
            tipo: "E",
            creatable: false,
            done: true,
            cards: res.data
          }

          // console.log('**** Board.verificaStatus.Entregas.data', loadEntregas)
          setEntrega(loadEntregas)
        })
        .catch(error => {
          console.log('**** Board.verificaStatus.Entregas.error')
          /*
          let timerId = setTimeout(function request() {
            if (request) {
              delay *= 2
            }
            timerId = setTimeout(request, delay)
          }, delay)
          */
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
  }

  const volta = () => {
    // toast('Erro na autenticação do usuário!', { type: 'error' })
    // localStorage.removeItem('@rf/token')
    // history.push('/rf')
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
      // console.log('*** vserror', error)
      const { response } = error
      if (response !== undefined) {
        if (response.status === 401) {
          history.push('/r')
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
      // console.log('*** Board_removeItem-1', motorista)
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

  const ContainerPaineis = () => {
    switch (painel) {
      case 'FIS':
        return (<Container>
                  <List key={emitirCTe.title} data={emitirCTe} />
                  <List key={encerrarManifesto.title} data={encerrarManifesto} />
                  <List key={tarefasRealizadas.title} data={tarefasRealizadas} />
                </Container>)

      case 'FIN':
        return (<Container>
                  <List key={contasPagar.title} data={contasPagar} />
                  <List key={avarias.title} data={avarias} />
                  <List key={HistoricoPagar.title} data={HistoricoPagar} />
                </Container>)

      case 'HIS':
        return (<Container>
                  <List key={HistoricoPedidos.title} data={HistoricoPedidos} />
                </Container>)

      default:
        return (<Container>
                  <List key={motorista.title} data={motorista} />
                  <List key={carga.title} data={carga} />
                  <List key={transporte.title} data={transporte} />
                  <List key={entrega.title} data={entrega} />
                </Container>)
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
  )
}

export default Board