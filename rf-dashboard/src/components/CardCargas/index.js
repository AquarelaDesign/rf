import React, { useRef, useContext, useEffect, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import BoardContext from '../Board/context'
// import { Grid } from '@material-ui/core'

import { Container, BoxTitulo, Item, Grid, Texto, Box } from './styles'

import { 
  loadRotas
} from '../../services/api'


export default function CardTransportes({ data, index }) {
  const ref = useRef()
  const { removeM } = useContext(BoardContext)

  const dataRotas = loadRotas()

  const localColeta = dataRotas.filter((dados) => {
    if (data.localcoleta === null) {
      return null
    } else if (data.localcoleta === dados.id) {
      return dados
    }
  })

  const localEntrega = dataRotas.filter((dados) => {
    if (data.localentrega === null) {
      return null
    } else if (data.localentrega === dados.id) {
      return dados
    }
  })

  // useEffect(() => {
  //   setIsLoading(true)

  //   AsyncStorage.getItem('email').then(Email => {
  //     setEmail(Email)
  //     buscaDados()
  //   })
  // }, [data])

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'CARD', index, data },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {
      // const draggedListIndex = item.index;
      // const targetListIndex = listIndex;

      const draggedIndex = item.index;
      const targetIndex = index;

      // if (draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
      if (draggedIndex === targetIndex) {
        return;
      }

      // const pedido = {
      //   'origem': item,
      //   'destino': data
      // }
      // console.log('pedido', pedido)

      /*
      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;

      const draggedOffset = monitor.getClientOffset();
      const draggedTop = draggedOffset.y - targetSize.top;

      if (draggedIndex < targetIndex && draggedTop < targetCenter) {
        return;
      }

      if (draggedIndex > targetIndex && draggedTop > targetCenter) {
        return;
      }
      */

      // move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);
      // removeM(draggedIndex)

      item.index = targetIndex
      // item.listIndex = targetListIndex;
    },

    drop(item, monitor) {
      removeM(index)
      const transporte = {
        transporte: {
          Motorista_id: item.data.id,
          Pedido_id: data.id,
          Motorista: item.data,
          Pedido: data,
        }
      }
      console.log('transporte', transporte)
    }
  })

  dragRef(dropRef(ref))

  return (
    <Container ref={ref} isDragging={isDragging}>
        <BoxTitulo size={20}>
          <Texto>PEDIDO {data.pedido}</Texto>
          <Texto bgcolor='#90D284' size={12} height={20}>{data.local}</Texto>
        </BoxTitulo>
        <Texto bgcolor='#E7E6E6' color='#2699FB' size={12}>Limite de Coleta:  {data.limitecoleta}</Texto>
        <Texto bgcolor='#E7E6E6' color='#90D284' size={12}>Limite de Entrega: {data.limiteentrega}</Texto>
        <Texto bgcolor='#E7E6E6' size={12}>{data.rota}</Texto>
        <Texto bgcolor='#E7E6E6' size={12} mb={5}>Veículos: {data.veiculos.length} unidades</Texto>
        
        <Grid bgcolor='#E7E6E6' border='1px solid #B5B5B5' mb={5}>
        { 
          data.veiculos.map((veiculo, index) => (
            <Item key={index}>
              <Texto bgcolor='#E7E6E6' size={12} width={70} border='1px solid'>{veiculo.placachassi}</Texto>
              <Texto bgcolor='#E7E6E6' size={12} width={150} border='1px solid'>{veiculo.modelo}</Texto>
              <Texto bgcolor='#E7E6E6' size={12} width={70} border='1px solid' italic={true} estado={veiculo.estado}>{veiculo.estado}</Texto>
            </Item>
          )) 
        }
        </Grid>

        <Box border='1px solid #B5B5B5' mb={5}>
          <Texto bgcolor='#E7E6E6' size={14} bold={400} mb={5}>LOCAL DE COLETA</Texto>
          <Texto bgcolor='#E7E6E6' size={12} mb={2}>{localColeta[0].descricao}</Texto>
          <Texto bgcolor='#E7E6E6' size={12} mb={2}>{`${localColeta[0].logradouro}, ${localColeta[0].numero}, ${localColeta[0].complemento}, ${localColeta[0].bairro}, ${localColeta[0].cidade}/${localColeta[0].uf}`}</Texto>
          <Texto bgcolor='#E7E6E6' size={12} mb={2}>{`CONTATO: ${localColeta[0].contato} TEL: ${localColeta[0].fone}`}</Texto>
        </Box>

        <Box border='1px solid #B5B5B5' mb={5}>
          <Texto bgcolor='#E7E6E6' size={14} bold={400} mb={5}>LOCAL DE ENTREGA</Texto>
          <Texto bgcolor='#E7E6E6' size={12} mb={2}>{localEntrega[0].descricao}</Texto>
          <Texto bgcolor='#E7E6E6' size={12} mb={2}>{`${localEntrega[0].logradouro}, ${localEntrega[0].numero}, ${localEntrega[0].complemento}, ${localEntrega[0].bairro}, ${localEntrega[0].cidade}/${localEntrega[0].uf}`}</Texto>
          <Texto bgcolor='#E7E6E6' size={12} mb={2}>{`CONTATO: ${localEntrega[0].contato} TEL: ${localEntrega[0].fone}`}</Texto>
        </Box>

      {/* <header>
        {data.labels.map(label => <Label key={label} color={label} />)}
      </header> 
      <p>{data.nome}</p>
      */}
    </Container>
  );
}
