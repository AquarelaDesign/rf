import React from 'react'
import { useHistory } from 'react-router-dom'

import { Container, Botao, BotaoExit, RLeft, RRight } from './styles';

import { FaIcon } from '../Icone'

export default function Menu() {
  const history = useHistory()
  
  const handleExit = () => {
    localStorage.removeItem('@rf/token')
    localStorage.removeItem('@rf/userID')
    history.push('/')
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
