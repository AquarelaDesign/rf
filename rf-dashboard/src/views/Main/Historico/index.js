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


const Fiscal = () => {
  const history = useHistory()

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    const storeToken = localStorage.getItem('@rf/token')

    if (storeToken === '') {
      localStorage.removeItem('@rf/token')
      history.push('/rf')
    }


  }, [])

  return (
    <BoardContext.Provider>

      <Container>
        {/* <List key={emitirCTe.title} data={emitirCTe} />
        <List key={encerrarManifesto.title} data={encerrarManifesto} />
        <List key={tarefasRealizadas.title} data={tarefasRealizadas} />
        <List key={'99999'} data={vazio} /> */}
      </Container>

    </BoardContext.Provider>

  )
}

export default Fiscal