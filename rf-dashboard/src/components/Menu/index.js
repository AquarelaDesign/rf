import React from 'react'

import { Container, Botao, BotaoExit, RLeft, RRight } from './styles';

import { FaIcon } from '../Icone'

export default function Menu() {
  return (
    <Container>
      <RLeft>
        <Botao>LOGÍSTICA</Botao>
        <Botao>FISCAL</Botao>
        <Botao>FINANCEIRO</Botao>
        <Botao>HISTÓRICO</Botao>
      </RLeft>
      <RRight>
        <BotaoExit>
          <FaIcon icon='GiExitDoor' size={16} />
          SAIR
        </BotaoExit>
      </RRight>
    </Container>
  )
}
