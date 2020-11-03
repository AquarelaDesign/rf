/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import api from '../../../services/rf'

import { Container, Botao, BotaoExit, RLeft, RRight } from './styles';
import { FaIcon } from '../../../components/Icone'

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: theme.spacing(0.5),
    height: '24px',
    // border: 'none',
    border: 0,
    borderRadius: '3px',
    width: '120px',
    fontSize: '14px',
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:hover': {
      background: '#225378',
      color: '#FFFFFF',
    }
  
  },
}))(ToggleButtonGroup)

const StyledToggleButton = withStyles((theme) => ({
  // border: 0,
  // borderRadius: '3px',
  // width: '120px',
  // height: '22px',
  // fontSize: '14px',
  // fontWeight: 'bold',
  // fontStyle: 'italic',
  // background: 'none',
  // color: '#FFFFFF',
  // cursor: 'pointer',
  // marginRight: '15px',

  // '&:hover': {
  //   background: '#225378',
  //   color: '#FFFFFF',
  // }

}))(ToggleButton)

export default function Menu({backMenu}) {
  const history = useHistory()
  const [menu, setMenu] = useState('LOG')

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
    setMenu(opcao)
    backMenu(opcao)
  }

  return (
    <Container>
      <RLeft>
        <StyledToggleButtonGroup
          value={menu}
          exclusive
          onChange={mudaPainel}
          aria-label="menu"
        >
          <ToggleButton value="LOG">LOGÍSTICA</ToggleButton>
          <ToggleButton value="FIS">FISCAL</ToggleButton>
          <ToggleButton value="FIN">FINANCEIRO</ToggleButton>
          <ToggleButton value="HIS">HISTÓRICO</ToggleButton>
        </StyledToggleButtonGroup>
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
