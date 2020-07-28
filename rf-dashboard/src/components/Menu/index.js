/* eslint-disable array-callback-return */
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import api from '../../services/rf'

import { Container, Botao, BotaoExit, RLeft, RRight } from './styles';
import { FaIcon } from '../Icone'

export default function Menu() {
  const history = useHistory()

  useEffect(() => {
    window.onbeforeunload = confirmExit
  }, [])
  
  const atualizaStatus = async (userID) => {
    await api
      .put(`/usuarios/${userID}`, { 
        status: "I",
      },{
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      .then(response => {
        const { data } = response

        if (response.status === 200) {
          toast(`Usuário ${data.nome} Offline!`, { type: 'success' })
        } else if (response.status === 400) {
          response.data.map(mensagem => {
            toast(mensagem.message, { type: 'error' })
          })
        } else {
          response.data.map(mensagem => {
            toast(mensagem.message, { type: 'error' })
          })
        }
      })
      .catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('*** data', data)
          }
        } else if (error.request) {
          console.error('*** lo-1.2', error)
          toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const handleExit = async () => {
    await confirmExit()
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const confirmExit = async () => {
    const userID = await localStorage.getItem('@rf/userID')
    console.log('**** userID', userID)

    atualizaStatus(userID)

    await sleep(1000)    
    localStorage.removeItem('@rf/token')
    localStorage.removeItem('@rf/userID')
    history.push('/rf')
  }

  return (
    <Container>
      <RLeft>
        <Botao>LOGÍSTICA</Botao>
        <Botao>FISCAL</Botao>
        <Botao>FINANCEIRO</Botao>
        <Botao>HISTÓRICO</Botao>
      </RLeft>
      <RRight>
        <BotaoExit onClick={handleExit}>
          <FaIcon icon='GiExitDoor' size={16} />
          SAIR
        </BotaoExit>
      </RRight>
    </Container>
  )
}
