/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Ws from '@adonisjs/websocket-client'
import moment from 'moment'
import formatDate from '../../../components/CountDown/format-date'

import api from '../../../services/rf'
import BoardContext from './context'
import List from '../List'
import { Container } from './styles'

const prot = window.location.protocol === 'http' ? 'ws' : 'wss'
const ws = Ws(`${prot}://www.retornofacil.com.br:3333`)
ws.connect()

const Fiscal = () => {
  const history = useHistory()

  const [isConnected, setIsConnected] = useState(false)
  const [lastConnected, setLastConnected] = useState('')
  let cardsCte = []
  let cardsMan = []
  let cardsFim = []

  // Fiscal ---------------------------------->
  const [emitirCTe, setEmitirCTe] = useState({
    title: "EMITIR CT-E", 
    icon: "EmitirCTe",
    tipo: "F",
    creatable: false,
    cards: []
  })

  const [encerrarManifesto, setEncerrarManifesto] = useState({
    title: "ENCERRAR MANIFESTO", 
    icon: "EncerrarManifesto",
    tipo: "X",
    creatable: false,
    cards: []
  })

  const [tarefasRealizadas, setTarefasRealizadas] = useState({
    title: "TAREFAS REALIZADAS", 
    icon: "TarefasRealizadas",
    tipo: "Y",
    creatable: false,
    cards: []
  })

  const vazio = {
    title: "", 
    icon: "",
    tipo: "",
    creatable: false,
    cards: []
  }
  // Fiscal <----------------------------------

  const [countdown, setCountdown] = useState(null)
  const [dateInFuture, setDateInFuture] = useState(moment(moment().add(1, 'minute'), 'YYYY-MM-DD'))
  const timer = useRef()

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    const storeToken = localStorage.getItem('@rf/token')

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

    return () => {
      ws.on('close', () => {
        // console.log('*** ws.close')
        setIsConnected(false)
      })
    }

  }, [])

  const onCountdownEnd = () => {
    setDateInFuture(moment(moment().add(2, 'seconds'), 'YYYY-MM-DD'))
  }

  const onTick = (delta) => {
    verificaStatus()
  }

  const tick = () => {
    const [delta, lastCountdown] = formatDate(dateInFuture, 'HH:mm:ss', 'YYYY-MM-DD')

    if (delta <= 0) {
      clearInterval(timer.current)
      timer.current = null

      onCountdownEnd()
    } else {
      setCountdown(lastCountdown)
      onTick(delta)
    }
  }

  useEffect(() => {
    tick()
    timer.current = setInterval(tick, 5000)

    return () => clearInterval(timer.current)
  }, [dateInFuture])


  const verificaStatus = async () => {
    let delay = 1000

    const token = await localStorage.getItem('@rf/token')

    if (!token) {
      history.push('/rf')
    }

    try {
      // console.log('**** Emitir CT-e')
      await api.post('/buscafiscal', {
        tipo: "F",
        pedido_id: null,
        cliente_id: null,
        status: " ",
      })
      .then(response => {
        const { data } = response
        
        // console.log('**** Fiscal.verificaStatus.data.F', data)
        cardsCte = []
        data.map(p => {
          buscaPedido(p.id, p.pedido_id, 'F')
        })

        carregaCards('F')

      })
      .catch(error => {
        console.log('**** Fiscal.verificaStatus.error', error)
      })

      // console.log('**** Encerrar Manifesto')
      await sleep(500)
      await api.post('/buscafiscal', {
        tipo: "X",
        pedido_id: null,
        cliente_id: null,
        status: " ",
      })
      .then(response => {
        const { data } = response
        
        // console.log('**** Fiscal.verificaStatus.data.X', data)
        cardsMan = []
        data.map(p => {
          buscaPedido(p.id, p.pedido_id, 'X')
        })

        carregaCards('X')

      })
      .catch(error => {
        console.log('**** Fiscal.verificaStatus.error', error)
      })

      // console.log('**** Tarefas Realizadas')
      await sleep(500)
      await api.post('/buscafiscal', {
        tipo: "Y",
        pedido_id: null,
        cliente_id: null,
        status: " ",
      })
      .then(response => {
        const { data } = response
        
        // console.log('**** Fiscal.verificaStatus.data.Y', data)
        cardsFim = []
        data.map(p => {
          buscaPedido(p.id, p.pedido_id, 'Y')
        })

        carregaCards('Y')

      })
      .catch(error => {
        console.log('**** Fiscal.verificaStatus.error', error)
      })


    } catch (error) {
      const { response } = error
      if (response !== undefined) {
        if (response.status === 401) {
          console.log('*** Fiscal.verificaStatus - Não Autorizado')
        }
      } else {
        toast(error, { type: 'error' })
      }
    }
  }

  const buscaPedido = async (fiscalId, pedidoId, modo) => {
    if (pedidoId) {
      await api
        .get(`/pedidos/${pedidoId}`)
        .then(response => {
          const { data } = response
          
          data[0]['tipo'] = modo
          data[0]['fiscal'] = fiscalId
          
          if (modo === 'X') {
            cardsMan.push(data[0])
          } else if (modo === 'Y') {
            cardsFim.push(data[0])
          } else {
            cardsCte.push(data[0])
          }
        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** Fiscal.buscaPedido.error.data', data)
            }
          } else if (error.request) {
            console.log('**** Fiscal.buscaPedido.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  const carregaCards = async (modo) => {
    await sleep(300)
    if (modo === 'X') {
      setEncerrarManifesto({
        title: "ENCERRAR MANIFESTO", 
        icon: "EncerrarManifesto",
        tipo: "X",
        creatable: false,
        cards: cardsMan
      })
    } else if (modo === 'Y') {
      setTarefasRealizadas({
        title: "TAREFAS REALIZADAS", 
        icon: "TarefasRealizadas",
        tipo: "Y",
        creatable: false,
        cards: cardsFim
      })
    } else {
      setEmitirCTe({
        title: "EMITIR CT-E", 
        icon: "EmitirCTe",
        tipo: "F",
        creatable: false,
        cards: cardsCte
      })
    }
  }

  return (
    <BoardContext.Provider>

      <Container>
        <List key={emitirCTe.title} data={emitirCTe} />
        <List key={encerrarManifesto.title} data={encerrarManifesto} />
        <List key={tarefasRealizadas.title} data={tarefasRealizadas} />
        <List key={'99999'} data={vazio} />
      </Container>

    </BoardContext.Provider>

  )
}

export default Fiscal