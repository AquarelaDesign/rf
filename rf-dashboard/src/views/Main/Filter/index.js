import React, { useState } from 'react'

import { Container, Label, Botao, Input } from './styles'

import { FaIcon } from '../../../components/Icone'

export default function Filter({backFilter}) {
  const [pedido, setPedido] = useState('')
  const [placa, setPlaca] = useState('')
  const [origemCidade, setOrigemCidade] = useState('')
  const [origemUF, setOrigemUF] = useState('')
  const [destinoCidade, setDestinoCidade] = useState('')
  const [destinoUF, setDestinoUF] = useState('')
  const [motoristaCPF, setMotoristaCPF] = useState('')
  const [motoristaNome, setMotoristaNome] = useState('')
  
  const mudaFiltro = async (e) => {
    backFilter({
      pedido,
      placa,
      origemCidade,
      origemUF,
      destinoCidade,
      destinoUF,
      motoristaCPF,
      motoristaNome,
    })
  }

  return (
    <Container>
      {/* <Label>Pedido</Label>  */}
      <Input
        id="pedido"
        type="input"
        value={pedido}
        placeholder="Nº do Pedido"
        onChange={event => setPedido(event.target.value)}
      /> 
      
      {/* <Label>Placa</Label>  */}
      <Input
        id="placa"
        type="input"
        value={placa}
        placeholder="Placa"
        onChange={event => setPlaca(event.target.value)}
      /> 
      
      <Label>Origem</Label>
      <Input
        id="origemCidade"
        type="input"
        value={origemCidade}
        placeholder="Cidade"
        onChange={event => setOrigemCidade(event.target.value)}
      /> 
      <Input
        id="origemUF"
        type="input"
        value={origemUF}
        placeholder="UF"
        onChange={event => setOrigemUF(event.target.value)}
        width={50}
      /> 
      
      <Label>Destino</Label> 
      <Input
        id="destinoCidade"
        type="input"
        value={destinoCidade}
        placeholder="Cidade"
        onChange={event => setDestinoCidade(event.target.value)}
      /> 
      <Input
        id="destinoUF"
        type="input"
        value={destinoUF}
        placeholder="UF"
        onChange={event => setDestinoUF(event.target.value)}
        width={50}
      /> 
      
      <Label>Motorista</Label> 
      <Input
        id="motoristaCPF"
        type="input"
        value={motoristaCPF}
        placeholder="CPF/CNPJ"
        onChange={event => setMotoristaCPF(event.target.value)}
      /> 
      <Input
        id="motoristaNome"
        type="input"
        value={motoristaNome}
        placeholder="Nome"
        onChange={event => setMotoristaNome(event.target.value)}
        width={200}
      /> 

      <Botao onClick={mudaFiltro} >
        <FaIcon icon='FaFilter' size={16} />
        FILTRAR
      </Botao>

    </Container>
  )
}
