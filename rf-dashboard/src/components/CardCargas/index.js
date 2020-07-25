import React, { useState, useEffect, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
// import BoardContext from '../Board/context'
// import { Grid } from '@material-ui/core'

import { Container, BoxTitulo, Item, Grid, Texto, Box } from './styles'

import moment from "moment"

export default function CardTransportes({ data, index }) {
  const ref = useRef()
  // const { removeM } = useContext(BoardContext)
  const [pedido, setPedido] = useState([])
  const [veiculos, setVeiculos] = useState([])
  const [enderecoc, setEnderecoc] = useState('')
  const [contatoc, setContatoc] = useState('')
  const [enderecoe, setEnderecoe] = useState('')
  const [contatoe, setContatoe] = useState('')
  const [local, setLocal] = useState(null)
  const [rota, setRota] = useState('')
  const [rotas, setRotas] = useState([])
  const [localColeta, setLocalColeta] = useState([])
  const [localEntrega, setLocalEntrega] = useState([])

  // const dataRotas = loadRotas()

  useEffect(() => {
    const carrega =async () => {
      await setPedido(data)
      await setVeiculos(data.veiculos)
      await setRotas(data.rotas)

      const resColeta = await BuscaRota(data.localcoleta)
      await setLocalColeta(resColeta[0])

      const resEntrega = await BuscaRota(data.localentrega)
      await setLocalEntrega(resEntrega[0])

      if (localColeta) {
        let _rota = `ROTA: ${localColeta.cidade}/${localColeta.uf}`
        let _enderecoc = ''
        let _enderecoe = ''
        let _contatoc = `CONTATO: ${localColeta.contato} TEL: ${localColeta.fone}`
        let _contatoe = `CONTATO: ${localEntrega.contato} TEL: ${localEntrega.fone}`

        if (localColeta.cidade) setLocal(`${localColeta.cidade}/${localColeta.uf}`)

        if (localColeta.logradouro) _enderecoc = `${_enderecoc} ${localColeta.logradouro}`
        if (localColeta.numero) _enderecoc = `${_enderecoc}, ${localColeta.numero}`
        if (localColeta.complemento) _enderecoc = `${_enderecoc}, ${localColeta.complemento}`
        if (localColeta.bairro) _enderecoc = `${_enderecoc}, ${localColeta.bairro}`
        if (localColeta.cidade) _enderecoc = `${_enderecoc}, ${localColeta.cidade}`
        if (localColeta.uf) _enderecoc = `${_enderecoc}/ ${localColeta.uf}`
        setEnderecoc(_enderecoc)

        if (localColeta.contato) _contatoc = `CONTATO: ${localColeta.contato} `
        if (localColeta.fone) _contatoc = `${_contatoc}TEL: ${localColeta.fone}`
        setContatoc(_contatoc)
        
        if (localEntrega) {
          _rota = `${_rota} X ${localEntrega.cidade}/${localEntrega.uf}`

          if (localEntrega.logradouro) _enderecoe = `${_enderecoe} ${localEntrega.logradouro}`
          if (localEntrega.numero) _enderecoe = `${_enderecoe}, ${localEntrega.numero}`
          if (localEntrega.complemento) _enderecoe = `${_enderecoe}, ${localEntrega.complemento}`
          if (localEntrega.bairro) _enderecoe = `${_enderecoe}, ${localEntrega.bairro}`
          if (localEntrega.cidade) _enderecoe = `${_enderecoe}, ${localEntrega.cidade}`
          if (localEntrega.uf) _enderecoe = `${_enderecoe}/ ${localEntrega.uf}`
          setEnderecoe(_enderecoe)

          if (localEntrega.contato) _contatoe = `CONTATO: ${localEntrega.contato} `
          if (localEntrega.fone) _contatoe = `${_contatoe}TEL: ${localEntrega.fone}`
          setContatoe(_contatoe)
        }
        setRota(_rota)


      }
    }
    carrega()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  /*
  const localColeta = rotas.filter((dados) => {
    if (pedido.localcoleta === dados.id) {
      return dados
    }
    return null
  })
  */

  function BuscaRota(id) {
    return rotas.filter(rota => rota.id === id).map(
      frota => {
        return frota
      }
    )
  }

  function FormataData(value) {
    const data = moment(value).format('DD/MM/YYYY')
    return data
  }
  


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
      /*--
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
      --*/
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
      /*--
      // move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);
      // removeM(draggedIndex)

      item.index = targetIndex
      // item.listIndex = targetListIndex;
      --*/
    },

    drop(item, monitor) {
      /*
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
      */
    }
  })

  dragRef(dropRef(ref))

  return (
    <Container ref={ref} isDragging={isDragging}>
      <BoxTitulo size={20}>
        <Texto>PEDIDO {pedido.id}</Texto>
        {local &&
          <Texto bgcolor='#90D284' size={12} height={20}>{local}</Texto>
        }
      </BoxTitulo>
      <Texto bgcolor='#E7E6E6' color='#2699FB' size={12}>Limite de Coleta: {FormataData(pedido.limitecoleta)}</Texto>
      <Texto bgcolor='#E7E6E6' color='#90D284' size={12}>Limite de Entrega: {FormataData(pedido.limiteentrega)}</Texto>

      {localColeta &&
        <Texto bgcolor='#E7E6E6' size={12}>{rota}</Texto>
      }
      <Texto bgcolor='#E7E6E6' size={12} mb={5}>Veículos: {veiculos.length} unidades</Texto>

      {veiculos && 
        <Grid bgcolor='#E7E6E6' border='1px solid #B5B5B5' mb={5}>
          {
            veiculos.map((veiculo, index) => (
              <Item key={index}>
                <Texto bgcolor='#E7E6E6' size={12} width={70} border='1px solid'>{veiculo.placachassi}</Texto>
                <Texto bgcolor='#E7E6E6' size={12} width={150} border='1px solid'>{veiculo.modelo}</Texto>
                <Texto bgcolor='#E7E6E6' size={12} width={70} border='1px solid' italic={true} estado={veiculo.estado}>{veiculo.estado}</Texto>
              </Item>
            ))
          }
        </Grid>
      }

      {localColeta &&
        <Box border='1px solid #B5B5B5' mb={5}>
          <Texto bgcolor='#E7E6E6' size={14} bold={400} mb={5}>LOCAL DE COLETA</Texto>
          <Texto bgcolor='#E7E6E6' size={12} mb={2}>{localColeta.descricao}</Texto>
          <Texto bgcolor='#E7E6E6' size={12} mb={2}>{enderecoc}</Texto>
          <Texto bgcolor='#E7E6E6' size={12} mb={2}>{contatoc}</Texto>
        </Box>
      }

      {localEntrega &&
        <Box border='1px solid #B5B5B5' mb={5}>
          <Texto bgcolor='#E7E6E6' size={14} bold={400} mb={5}>LOCAL DE ENTREGA</Texto>
          <Texto bgcolor='#E7E6E6' size={12} mb={2}>{localEntrega.descricao}</Texto>
          <Texto bgcolor='#E7E6E6' size={12} mb={2}>{enderecoe}</Texto>
          <Texto bgcolor='#E7E6E6' size={12} mb={2}>{contatoe}</Texto>
        </Box>
      }

      {/* <header>
        {data.labels.map(label => <Label key={label} color={label} />)}
      </header> 
      <p>{data.nome}</p>
      */}
    </Container>
  );
}
