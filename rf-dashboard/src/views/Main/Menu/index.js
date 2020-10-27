/* eslint-disable array-callback-return */
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import api from '../../../services/rf'

import { Container, Botao, BotaoExit, RLeft, RRight } from './styles';
import { FaIcon } from '../../../components/Icone'

export default function Menu({backMenu}) {
  const history = useHistory()
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    window.onbeforeunload = (e) => confirmExit(e)
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          toast(`Usuário ${data.nome} Offline!`, { 
            type: 'warning', 
            autoClose: 2000, 
            closeOnClick: true,
            pauseOnHover: true,
          })
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
            console.log('**** Menu.atualizaStatus.error.data', data)
          }
        } else if (error.request) {
          console.log('**** Menu.atualizaStatus.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const handleExit = async (e) => {
    await confirmExit(e)
  }

  const confirmExit = async (e) => {
    const userID = await localStorage.getItem('@rf/userID')
    atualizaStatus(userID)

    await sleep(1000) 
    if (e) {  
      delete e['returnValue']
    }

    localStorage.removeItem('@rf/token')
    localStorage.removeItem('@rf/userID')
    history.push('/rf')
  }

  const mudaPainel = async (e, opcao) => {
    backMenu(opcao)
  }

  return (
    <Container>
      <RLeft>
        <Botao onClick={e => mudaPainel(e, 'LOG')}>LOGÍSTICA</Botao>
        <Botao onClick={e => mudaPainel(e, 'FIS')}>FISCAL</Botao>
        <Botao onClick={e => mudaPainel(e, 'FIN')}>FINANCEIRO</Botao>
        <Botao onClick={e => mudaPainel(e, 'HIS')}>HISTÓRICO</Botao>
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
