import React, { useState } from 'react'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { Tooltip, withStyles } from '@material-ui/core'

import { Container, Label, Botao, Input } from './styles'

import { FaIcon } from '../../../components/Icone'

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: theme.spacing(0.5),
    height: '32px',
    // border: 'none',
    border: 0,
    borderRadius: '3px',
    width: '44px',
    // fontSize: '14px',
    // fontWeight: 'bold',
    // fontStyle: 'italic',
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

export default function Filter({backFilter}) {
  const [pedido, setPedido] = useState('')
  const [placa, setPlaca] = useState('')
  const [origemCidade, setOrigemCidade] = useState('')
  const [origemUF, setOrigemUF] = useState('')
  const [destinoCidade, setDestinoCidade] = useState('')
  const [destinoUF, setDestinoUF] = useState('')
  const [motoristaCPF, setMotoristaCPF] = useState('')
  const [motoristaNome, setMotoristaNome] = useState('')
  const [filtro, setFiltro] = useState(false)

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
  
  const mudaFiltro = async (e, stFiltro) => {
    if (
      pedido !== "" && placa !== "" &&
      origemCidade !== "" && origemUF !== "" &&
      destinoCidade !== "" && destinoUF !== "" &&
      motoristaCPF !== "" && motoristaNome !== ""
    ) {
      setFiltro(false)
    } else {
      setFiltro(true)
    }

    // console.log('**** Filter.mudaFiltro.stFiltro', stFiltro)
    if (stFiltro === false) {
      setPedido('')
      setPlaca('')
      setOrigemCidade('')
      setOrigemUF('')
      setDestinoCidade('')
      setDestinoUF('')
      setMotoristaCPF('')
      setMotoristaNome('')

      backFilter({
        pedido: '',
        placa: '',
        origemCidade: '',
        origemUF: '',
        destinoCidade: '',
        destinoUF: '',
        motoristaCPF: '',
        motoristaNome: '',
      })
  
    } else {
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

      <StyledToggleButtonGroup
        value={filtro}
        exclusive
        onChange={mudaFiltro}
        aria-label="menu"
      >
        <ToggleButton value={true}>
          <FaIcon icon='btFiltro' size={22} />
        </ToggleButton>

        <ToggleButton value={false}>
          <FaIcon icon='btLimpaFiltro' size={22} />
        </ToggleButton>
      </StyledToggleButtonGroup>

    </Container>
  )
}
