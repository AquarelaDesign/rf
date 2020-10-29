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

const Financeiro = () => {
  const history = useHistory()

  const [isConnected, setIsConnected] = useState(false)
  const [lastConnected, setLastConnected] = useState('')
  let cardsCPg = []
  let cardsAva = []
  let cardsHis = []

  // Financeiro ------------------------------>
  const [contasPagar, setContasPagar] = useState({
    title: "CONTAS A PAGAR", 
    icon: "ContasPagar",
    tipo: "P",
    creatable: false,
    cards: []
  })
  
  const [avarias, setAvarias] = useState({
    title: "AVARIAS", 
    icon: "Avarias",
    tipo: "A",
    creatable: true,
    cards: []
  })
  
  const [historicoPagar, setHistoricoPagar] = useState({
    title: "HISTÓRICO DE PAGAMENTOS", 
    icon: "HistoricoPagamentos",
    tipo: "H",
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
  // Financeiro <------------------------------

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
      // console.log('**** Contas a Pagar')
      await api.post('/buscafin', {
        tipo: "P",
        pedido_id: null,
        cliente_id: null,
        motorista_id: null,
        operador_id: null,
        fornecedor_id: null,
        status: null
      })
      .then(response => {
        const { data } = response
        
        // console.log('**** Financeiro.verificaStatus.data.F', data)
        cardsCPg = []
        data.map(p => {
          buscaPedido(p.id, p.pedido_id, 'P', p.status)
        })

        carregaCards('P')

      })
      .catch(error => {
        console.log('**** Financeiro.verificaStatus.error', error)
      })

      // console.log('**** Avarias')
      await sleep(500)
      await api.post('/buscafin', {
        tipo: "A",
        pedido_id: null,
        cliente_id: null,
        motorista_id: null,
        operador_id: null,
        fornecedor_id: null,
        status: null
      })
      .then(response => {
        const { data } = response
        
        // console.log('**** Financeiro.verificaStatus.data.X', data)
        cardsAva = []
        data.map(p => {
          buscaPedido(p.id, p.pedido_id, 'A', p.status)
        })

        carregaCards('A')

      })
      .catch(error => {
        console.log('**** Financeiro.verificaStatus.error', error)
      })

      // console.log('**** Historico de Pagamentos')
      await sleep(500)
      await api.post('/buscafin', {
        tipo: "H",
        pedido_id: null,
        cliente_id: null,
        motorista_id: null,
        operador_id: null,
        fornecedor_id: null,
        status: null
      })
      .then(response => {
        const { data } = response
        
        // console.log('**** Financeiro.verificaStatus.data.Y', data)
        cardsHis = []
        data.map(p => {
          buscaPedido(p.id, p.pedido_id, 'H', p.status)
        })

        carregaCards('H')

      })
      .catch(error => {
        console.log('**** Financeiro.verificaStatus.error', error)
      })


    } catch (error) {
      const { response } = error
      if (response !== undefined) {
        if (response.status === 401) {
          console.log('**** Financeiro.verificaStatus - Não Autorizado')
        }
      } else {
        toast(error, { type: 'error' })
      }
    }
  }

  const buscaPedido = async (FinanceiroId, pedidoId, modo, FinanceiroStatus = '') => {
    if (pedidoId) {
      await api
        .get(`/pedidos/${pedidoId}`)
        .then(response => {
          const { data } = response
          
          data[0]['tipo'] = modo
          data[0]['Financeiro'] = FinanceiroId
          data[0]['status_fin'] = FinanceiroStatus
          
          if (modo === 'A') {
            cardsAva.push(data[0])
          } else if (modo === 'H') {
            cardsHis.push(data[0])
          } else {
            cardsCPg.push(data[0])
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
              console.log('**** Financeiro.buscaPedido.error.data', data)
            }
          } else if (error.request) {
            console.log('**** Financeiro.buscaPedido.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  const carregaCards = async (modo) => {
    await sleep(300)
    if (modo === 'A') {
      setAvarias({
        title: "AVARIAS", 
        icon: "Avarias",
        tipo: "A",
        creatable: false,
        cards: cardsAva
      })
    } else if (modo === 'H') {
      setHistoricoPagar({
        title: "HISTÓRICO DE PAGAMENTOS", 
        icon: "HistoricoPagamentos",
        tipo: "H",
        creatable: false,
        cards: cardsHis
      })
    } else {
      setContasPagar({
        title: "CONTAS A PAGAR", 
        icon: "ContasPagar",
        tipo: "P",
        creatable: false,
        cards: cardsCPg
      })
    }
  }

  return (
    <BoardContext.Provider>

      <Container>
        <List key={contasPagar.title} data={contasPagar} />
        <List key={avarias.title} data={avarias} />
        <List key={historicoPagar.title} data={historicoPagar} />
        <List key={'99999'} data={vazio} />
      </Container>

    </BoardContext.Provider>

  )
}

export default Financeiro