import React, { useState, useEffect, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
// import BoardContext from '../Board/context'
// import { Grid } from '@material-ui/core'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Container, BoxTitulo, Item, Grid, Texto, Box } from './styles'

import moment from "moment"
import api from '../../../services/rf'

import PedidoModal from '../../Pedidos/PedidoModal'
import useModalPedido from '../../Pedidos/PedidoModal/useModal'

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default function CardTransportes({ data, index }) {
  const ref = useRef()
  // const { removeM } = useContext(BoardContext)
  const [pedido, setPedido] = useState([])
  const [motorista, setMotorista] = useState(null)
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

  const { isShowPedido, togglePedido } = useModalPedido()

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  // const dataRotas = loadRotas()

  useEffect(() => {
    const carrega = async () => {
      setPedido(data)
      setVeiculos(data.veiculos)
      setRotas(data.rotas)

      const resColeta = await BuscaRota(data.localcoleta)
      
      // console.log('**** resColeta', resColeta)
      setLocalColeta(resColeta[0])

      const resEntrega = await BuscaRota(data.localentrega)

      // console.log('**** resEntrega', resEntrega)
      setLocalEntrega(resEntrega[0])

      // await sleep(500)
      if (resColeta[0]) {
        let _rota = ''
        let _contatoc = ''
        let _contatoe = ''

        if (resColeta[0].cidade && resColeta[0].uf) {
          _rota += `ROTA: ${resColeta[0].cidade}/${resColeta[0].uf} `
        }

        let _enderecoc = ''
        let _enderecoe = ''

        if (resColeta[0].contato) _contatoc += `CONTATO: ${resColeta[0].contato} ` 
        if (resColeta[0].fone) _contatoc += `TEL: ${resColeta[0].fone}`
        
        if (resColeta[0].cidade) setLocal(`${resColeta[0].cidade}/${resColeta[0].uf}`)

        if (resColeta[0].logradouro) _enderecoc = `${_enderecoc} ${resColeta[0].logradouro}`
        if (resColeta[0].numero) _enderecoc = `${_enderecoc}, ${resColeta[0].numero}`
        if (resColeta[0].complemento) _enderecoc = `${_enderecoc}, ${resColeta[0].complemento}`
        if (resColeta[0].bairro) _enderecoc = `${_enderecoc}, ${resColeta[0].bairro}`
        if (resColeta[0].cidade) _enderecoc = `${_enderecoc}, ${resColeta[0].cidade}`
        if (resColeta[0].uf) _enderecoc = `${_enderecoc}/ ${resColeta[0].uf}`
        setEnderecoc(_enderecoc)

        if (resColeta[0].contato) _contatoc = `CONTATO: ${resColeta[0].contato} `
        if (resColeta[0].fone) _contatoc = `${_contatoc}TEL: ${resColeta[0].fone}`
        setContatoc(_contatoc)

        if (resEntrega[0]) {
          if (resEntrega[0].cidade && resEntrega[0].uf) {
            _rota += (_rota ? 'X ' : 'ROTA: ') + `${resEntrega[0].cidade}/${resEntrega[0].uf}`
          }

          if (resEntrega[0].contato) _contatoe += `CONTATO: ${resEntrega[0].contato} ` 
          if (resEntrega[0].fone) _contatoe += `TEL: ${resEntrega[0].fone}`
            
          if (resEntrega[0].logradouro) _enderecoe = `${_enderecoe} ${resEntrega[0].logradouro}`
          if (resEntrega[0].numero) _enderecoe = `${_enderecoe}, ${resEntrega[0].numero}`
          if (resEntrega[0].complemento) _enderecoe = `${_enderecoe}, ${resEntrega[0].complemento}`
          if (resEntrega[0].bairro) _enderecoe = `${_enderecoe}, ${resEntrega[0].bairro}`
          if (resEntrega[0].cidade) _enderecoe = `${_enderecoe}, ${resEntrega[0].cidade}`
          if (resEntrega[0].uf) _enderecoe = `${_enderecoe}/ ${resEntrega[0].uf}`
          setEnderecoe(_enderecoe)

          if (resEntrega[0].contato) _contatoe = `CONTATO: ${resEntrega[0].contato} `
          if (resEntrega[0].fone) _contatoe = `${_contatoe}TEL: ${resEntrega[0].fone}`
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
      /*--*/
      // const draggedListIndex = item.index
      // const targetListIndex = listIndex

      const draggedIndex = item.index
      const targetIndex = index

      // if (draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
      if (draggedIndex === targetIndex) {
        return
      }

      // const pedido = {
      //   'origem': item,
      //   'destino': data
      // }
      // console.log('pedido', pedido)
      /*--*/
      /*
      const targetSize = ref.current.getBoundingClientRect()
      const targetCenter = (targetSize.bottom - targetSize.top) / 2

      const draggedOffset = monitor.getClientOffset()
      const draggedTop = draggedOffset.y - targetSize.top

      if (draggedIndex < targetIndex && draggedTop < targetCenter) {
        return
      }

      if (draggedIndex > targetIndex && draggedTop > targetCenter) {
        return
      }
      */
      /*--*/
      // move(draggedListIndex, targetListIndex, draggedIndex, targetIndex)
      // removeM(draggedIndex)

      item.index = targetIndex
      // item.listIndex = targetListIndex
     /*--*/
    },

    drop(item, monitor) {
      
      // removeM(index)
      const userID = item.data.id
      const pedidoID = data.id

      if (data.rotas.length === 0) {
        toast(`O Pedido [${data.id}] se encontra sem Rotas cadastradas e passará para em manutenção!`, { type: 'error' })
        atualizaPedido(pedidoID, null, ' ')
        return
      }

      if (data.veiculos.length === 0) {
        toast(`O Pedido [${data.id}] se encontra sem veículos cadastradas e passará para manutenção!`, { type: 'error' })
        atualizaPedido(pedidoID, null, ' ')
        return
      }

      const transporte = {
        transporte: {
          Motorista_id: userID,
          Pedido_id: pedidoID,
          Motorista: item.data,
          Pedido: data,
        }
      }
      // console.log('transporte', transporte)

      buscaMotorista(userID, pedidoID)
    }
  })

  const buscaMotorista = async (motoristaID, pedidoID) => {
    if (motoristaID) {
      // await sleep(500)
      await api
        .get(`/usuarios/${motoristaID}`)
        .then(response => {
          const { data } = response
          // console.log('**** CardCargas.buscaMotorista', data.veiculos)
          if (data.tipo === 'M') {
            setMotorista(data)
            atualizaPedido(pedidoID, data.id, 'A')
          
            const atualiza = async (Id) => {
              await sleep(500)
              atualizaMotorista(Id)
            }
            atualiza(data.id)
          } else {
            console.log('**** CardCargas.buscaMotorista', data.tipo, data.id, data.nome)
          }
        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** CardCargas.buscaMotorista.error.data', data)
            }
          } else if (error.request) {
            console.log('**** CardCargas.buscaMotorista.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }
  
  const atualizaMotorista = async (motoristaID) => {
    // const vagas = motorista.vagas - data.veiculos.length

    await api.put(`/usuarios/${motoristaID}`, {
      estado: 'P', // Aguardando Aprovacao
      // vagas: vagas,
    })
    .then(response => {
      const { data } = response
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
          console.log('**** CardCargas.atualizaMotorista.error.data', data)
        }
      } else if (error.request) {
        console.log('**** CardCargas.atualizaMotorista.error', error)
        // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
  }

  const atualizaPedido = async (pedidoID, motoristaID, status) => {
    /*
    Status Pedidos
      [ ]Em Manutenção, 
      [D]isponivel,
      [A]guardando, 
      Em [C]oleta, 
      Em [T]ransporte, 
      Em c[O]nferencia, 
      [E]ntregue, 
      [X]Cancelado
    */

    await api.put(`/pedidos/${pedidoID}`, {
      motorista_id: status === 'A' ? motoristaID : null,
      status: status, // Aguardando
      tipo: status === 'A' ? "T" : 'C', // Cargas
      // motorista_id: motoristaID,
      // status: 'A', // Aguardando
      // tipo: "T", // Transportes
    })
    .then(response => {
      const { data } = response
      atualizaRotas(motoristaID)
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
          console.log('**** CardCargas.atualizaPedido.error.data', data)
        }
      } else if (error.request) {
        console.log('**** CardCargas.atualizaPedido.error', error)
        // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
    
  }

  const atualizaRotas = async (motoristaID) => {
    // associar motorista transportador (motorista_id)
    rotas.map(rota => {
      if (rota.status === 'D') {
        api.put(`/rotas/${rota.id}`, {
          motorista_id: motoristaID,
          status: 'A',
        })
        .then(response => {
          const { data } = response
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
              console.log('**** CardCargas.atualizaRotas.error.data', data)
            }
          } else if (error.request) {
            console.log('**** CardCargas.atualizaRotas.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
      }
    })

  }

  const abrePedido = (e) => {
    togglePedido()
  }

  dragRef(dropRef(ref))

  return (
    <>
      <div onDoubleClick={abrePedido}>
        <Container ref={ref}>  
        {/* isDragging={isDragging}> */}
          <BoxTitulo size={20}>
            <Texto>PEDIDO {pedido.id}</Texto>
            {local &&
              <Texto bgcolor='#90D284' size={12} height={20}>{local}</Texto>
            }
          </BoxTitulo>
          <Texto bgcolor='#E7E6E6' color='#2699FB' size={12}>Limite de Coleta: {FormataData(pedido.limitecoleta)}</Texto>
          <Texto bgcolor='#E7E6E6' color='#90D284' size={12}>Limite de Entrega: {FormataData(pedido.limiteentrega)}</Texto>

          {localColeta && rota !== '' &&
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

          {localColeta && (enderecoc || contatoc) &&
            <Box border='1px solid #B5B5B5' mb={5}>
              <Texto bgcolor='#E7E6E6' size={14} bold={400} mb={5}>LOCAL DE COLETA</Texto>
              <Texto bgcolor='#E7E6E6' size={12} mb={2}>{localColeta.descricao}</Texto>
              <Texto bgcolor='#E7E6E6' size={12} mb={2}>{enderecoc}</Texto>
              <Texto bgcolor='#E7E6E6' size={12} mb={2}>{contatoc}</Texto>
            </Box>
          }

          {localEntrega && (enderecoe || contatoe) &&
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
      </div>

      <PedidoModal
        isShowPedido={isShowPedido}
        hide={togglePedido}
        tipoCad={'V'}
        pedidoID={data.id}
        disableEdit={true}
      />
    </>
  )
}
