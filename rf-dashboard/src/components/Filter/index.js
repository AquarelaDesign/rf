import React, { useState } from 'react'

import { Container, Label, Botao, Input } from './styles'

import { FaIcon } from '../Icone'

export default function Filter() {
  const [pedido, setPedido] = useState('')
  const [placa, setPlaca] = useState('')
  const [origem, setOrigem] = useState('')
  const [destino, setDestino] = useState('')
  const [motorista, setMotorista] = useState('')
  
  return (
    <Container>
      <Label>Pedido</Label> 
      <Input
        id="pedido"
        type="input"
        value={pedido}
        placeholder="Nº do Pedido"
        onChange={event => setPedido(event.target.value)}
      /> 
      
      <Label>Placa</Label> 
      <Input
        id="placa"
        type="input"
        value={placa}
        placeholder="Placa"
        onChange={event => setPlaca(event.target.value)}
      /> 
      
      <Label>Origem</Label> 
      <Input
        id="origem"
        type="input"
        value={origem}
        placeholder="Origem"
        onChange={event => setOrigem(event.target.value)}
      /> 
      
      <Label>Destino</Label> 
      <Input
        id="destino"
        type="input"
        value={destino}
        placeholder="Destino"
        onChange={event => setDestino(event.target.value)}
      /> 
      
      <Label>Motorista</Label> 
      <Input
        id="motorista"
        type="input"
        value={motorista}
        placeholder="Motorista"
        onChange={event => setMotorista(event.target.value)}
      /> 

      <Botao>
        <FaIcon icon='FaFilter' size={16} />
        FILTRAR
      </Botao>

    </Container>
  )
}
