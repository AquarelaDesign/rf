import React, { useRef, useEffect, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import StarRatings from 'react-star-ratings'
// import BoardContext from '../Board/context'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip } from '@material-ui/core'
import { formatToPhone } from 'brazilian-values'
// import { SmtpEmail } from '../../services/smtp'
import { Container, RLeft, RRight, Texto, BoxTitulo } from './styles'

import semImagem from '../../../assets/sem_foto.png'
import { FaIcon } from '../../../components/Icone'

import Email from '../../../components/Email'
import useModal from '../../../components/Email/useModal'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MdTimer } from 'react-icons/md'

import api from '../../../services/rf'

import PedidoModal from '../../Pedidos/PedidoModal'
import useModalPedido from '../../Pedidos/PedidoModal/useModal'

const useStyles = makeStyles((theme) => ({
  botoes: {
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 1,
    paddingRight: '15px',
    width: '100%',
    // border: '2px dashed rgba(0, 0, 0, 1)',
  },
}))

const dev = window.location.hostname === "localhost" ? 'https://www.retornofacil.com.br/rf/' : ''

export default function CardEmitirCTe({ data, index }) {
  const ref = useRef()
  const classes = useStyles()

  // const [cliente, setCliente] = useState({})
  const [motorista, setMotorista] = useState({})
  const [local, setLocal] = useState('')
  const [localColeta, setLocalColeta] = useState([])
  const [localEntrega, setLocalEntrega] = useState([])
  const [rota, setRota] = useState('')
  const [statusMotorista, setStatusMotorista] = useState('')
  // const [statusPedido, setStatusPedido] = useState(false)
  // const [confirmado, setConfirmado] = useState(false)
  const [mostra, setMostra] = useState(false)
  const [mostraDesfaz, setMostraDesfaz] = useState(false)
  // const [rotas, setRotas] = useState([])
  const [tempo, setTempo] = useState({
    "h": 0,
    "m": 0,
    "s": 0
  })

  const { isShowEmail, toggleEmail } = useModal()
  const { isShowPedido, togglePedido } = useModalPedido()

  const userID = localStorage.getItem('@rf/userID')

  useEffect(() => {
    // console.log('**** CardTransportes.data', data)
    // setRotas(data.rotas)
    if (data.tipo === 'F') {
      setMostraDesfaz('hidden')
    } else {
      setMostraDesfaz('visible')
    }

    if (data.rotas.length > 0) {
      setLocal(`${data.rotas[0].cidade}/${data.rotas[0].uf}`)
    }
    buscaMotorista(data.motorista_id)
    // buscaCliente(data.cliente_id)

    const carrega = async () => {
      const resColeta = await BuscaRota(data.localcoleta, data.rotas)
      setLocalColeta(resColeta[0])

      const resEntrega = await BuscaRota(data.localentrega, data.rotas)
      setLocalEntrega(resEntrega[0])

      // console.log('**** CardTransportes.resColeta', data.localcoleta, resColeta)

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
        // setEnderecoc(_enderecoc)

        if (resColeta[0].contato) _contatoc = `CONTATO: ${resColeta[0].contato} `
        if (resColeta[0].fone) _contatoc = `${_contatoc}TEL: ${resColeta[0].fone}`
        // setContatoc(_contatoc)

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
          // setEnderecoe(_enderecoe)

          if (resEntrega[0].contato) _contatoe = `CONTATO: ${resEntrega[0].contato} `
          if (resEntrega[0].fone) _contatoe = `${_contatoe}TEL: ${resEntrega[0].fone}`
          // setContatoe(_contatoe)
        }
        
        setRota(_rota)
      }
    }
    carrega()

    return () => {
      setStatusMotorista('')
    }

  }, [])

  function BuscaRota(id, rotas) {
    return rotas.filter(rota => rota.id === id).map(
      frota => {
        return frota
      }
    )
  }

  const buscaMotorista = async (motoristaID) => {
    if (motoristaID) {
      // await sleep(500)
      await api
        .get(`/usuarios/${motoristaID}`)
        .then(response => {
          const { data } = response

          // console.log('**** CardTransportes.buscaMotorista', data.veiculos)
          setMotorista(data)
          setStatusMotorista(data.estado)

        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** CardTransportes.buscaMotorista.error.data', data)
            }
          } else if (error.request) {
            console.log('**** CardTransportes.buscaMotorista.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  const salvaHistorico = async (pedidoId, motoristaId, clienteId, operadorId, observacao) => {
    console.log('**** PedidosModal.salvaHistorico', pedidoId, motoristaId, clienteId, operadorId, observacao)
    await api
      .post(`/historicos`, {
        "motorista_id": motoristaId,
        "cliente_id": clienteId,
        "operador_id": operadorId,
        "pedido_id": pedidoId,
        "titulo_pagar_id": null,
        "titulo_receber_id": null,
        "observacao": observacao, 
        "valor": 0
      })
      .then(response => {
        const { data } = response
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** PedidosModal.salvaHistorico.error.data', data)
          }
        } else if (error.request) {
          console.log('**** PedidosModal.salvaHistorico.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const atualizaStatus = async () => {
    let par_tipo = ''
    let par_status = ''
    let par_hist = ''
    let par_pedido = data.id
    
    if (data.tipo === 'F') {
      par_tipo = 'X'
      par_status = ' '
      par_hist = 'CT-e emitido'
    } else if (data.tipo === 'X') {
      par_tipo = 'Y'
      par_status = ' '
      par_hist = 'Manifesto encerrado'
    } else {
      par_tipo = 'T'
      par_status = 'T'
      par_hist = 'CT-e e Manifesto arquivados no Fiscal'
    }
    
    // console.log('**** CardTransportes.atualizaStatus', data.fiscal, par_pedido)
    await api.put(`/fiscal/${data.fiscal}`, {
      tipo: par_tipo,
      status: par_status,
    })
    .then(response => {
      const { data } = response
      // (pedidoId, motoristaId, clienteId, operadorId, observacao)
      salvaHistorico(
        par_pedido, 
        null, 
        null, 
        userID,
        par_hist
      )
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
          console.log('**** CardTransportes.atualizaPedido.error.data', data)
        }
      } else if (error.request) {
        console.log('**** CardTransportes.atualizaPedido.error', error)
        // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
    
  }

  const desfazStatus = async () => {
    let par_tipo = ''
    let par_status = ''
    let par_hist = ''
    let par_pedido = data.id
    
    if (data.tipo === 'X') {
      par_tipo = 'F'
      par_status = ' '
      par_hist = 'Retornado de Manifesto para emissão do CT-e'
    } else if (data.tipo === 'Y') {
      par_tipo = 'X'
      par_status = ' '
      par_hist = 'Retornado de Realizado para Manifesto'
    } else {
      par_tipo = 'F'
      par_status = ' '
      par_hist = 'Processo desfeito no Fiscal'
    }
    
    // console.log('**** CardTransportes.atualizaStatus', data.fiscal, par_pedido)
    await api.put(`/fiscal/${data.fiscal}`, {
      tipo: par_tipo,
      status: par_status,
    })
    .then(response => {
      const { data } = response
      // (pedidoId, motoristaId, clienteId, operadorId, observacao)
      salvaHistorico(
        par_pedido, 
        null, 
        null, 
        userID,
        par_hist
      )
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
          console.log('**** CardTransportes.atualizaPedido.error.data', data)
        }
      } else if (error.request) {
        console.log('**** CardTransportes.atualizaPedido.error', error)
        // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
    
  }

  const abrePedido = (e) => {
    setMostra(!mostra)
    togglePedido()
  }

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'FISCAL', index, data },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, dropRef] = useDrop({
    accept: 'FISCAL', 
    hover(item, monitor) {
      // item.index = targetIndex
      // console.log('**** CardEmitirCTe.item.hover', item)
    },

    drop(item, monitor) {
      console.log('**** CardEmitirCTe.item.drop', item)
      // removeM(index)
      // const userID = item.data.id
      // const pedidoID = data.id
      atualizaStatus()
    }
  })
  
  dragRef(dropRef(ref))
  
  return (
    <>
      <Container ref={ref} isDragging={isDragging}>
        <div className={classes.botoes}>
          {motorista.whats && (
            <a target="_blank"
              rel="noopener noreferrer"
              href={`https://api.whatsapp.com/send?phone=55${motorista.whats}&text=`}
            >
              <Tooltip title={formatToPhone(motorista.whats)}>
                <span style={{
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginTop: '3px',
                }}>
                  <FaIcon icon='pbWhats' size={12} />
                </span>
              </Tooltip>
            </a>
          )}

          {motorista.email && (
            <button onClick={() => {
              toggleEmail()
            }}
              style={{ backgroundColor: 'transparent' }}
            >
              <Tooltip title={motorista.email}>
                <span style={{
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginTop: '3px',
                }}>
                  <FaIcon icon='pbEmail' size={12} />
                </span>
              </Tooltip>
            </button>
          )}

          {motorista.celular && (
            <button onClick={() => {
            }}
              style={{ backgroundColor: 'transparent' }}
            >
              <Tooltip title={formatToPhone(motorista.celular)}>
                <span style={{
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginTop: '3px',
                }}>
                  <FaIcon icon='pbFone' size={12} />
                </span>
              </Tooltip>
            </button>
          )}

        </div>

        <div onDoubleClick={abrePedido} >
          <RLeft>
            <img src={motorista.foto !== null ? `${dev}images/${motorista.foto}` : semImagem} alt="" />
          </RLeft>
          <RRight>
            <Texto bgcolor='#E7E6E6' size={16} bold={true}>
              {motorista.nome}
            </Texto>

            <StarRatings
              rating={motorista.rate}
              starRatedColor="#F9D36B"
              starDimension="14px"
              starSpacing="1px"
              // changeRating={this.changeRating}
              numberOfStars={5}
              name='rating'
            />
            {motorista.veiculos && (
            <>
              <Texto color='#2699FB' size={12}>
                Tipo de veículo: {motorista.veiculos.length > 0 ? motorista.veiculos[0].tipo : ''}
              </Texto>
              <Texto bgcolor='#E7E6E6' size={10}>
                RT: {`${motorista.origem} x ${motorista.destino}`}
              </Texto>
              <Texto bgcolor='#E7E6E6' size={12}>
                Vagas disponíveis: {motorista.veiculos.length > 0 ? motorista.veiculos[0].vagas : 0} vagas
              </Texto>
            </>
            )}
            <Texto bgcolor='#90D284' size={12}>
              {motorista.localizacao}
            </Texto>
          </RRight>
          <BoxTitulo size={20} mt={10}>
            <Texto>PEDIDO {data.id}</Texto>
            {local &&
              <Texto bgcolor='#90D284' size={12} height={20}>{local}</Texto>
            }
          </BoxTitulo>
          {localColeta && rota !== '' &&
            <Texto bgcolor='#E7E6E6' size={12}>{rota}</Texto>
          }
          <Texto bgcolor='#E7E6E6' size={12} mb={5}>Veículos: {data.veiculos.length} unidades</Texto>
        </div>
        
        <div style={{ 
          padding: 5, 
          fontSize: '14px', 
          backgroundColor: `${ statusMotorista === 'P' ? '#ef898d' : statusMotorista === 'A' ? '#F9D36B' : statusMotorista === 'T' ? '#90D284' : '#0078D7' }`,
          width: '100%',
          height: '45px',
          borderRadius: 5,
          fontWeight: 'bold', 
          }}
        >
          Status: {
            {
              ' ': 'DISPONÍVEL',
              'P': 'AGUARDANDO APROVAÇÃO',
              'A': 'AGUARDANDO COLETA',
              'T': 'EM TRANSPORTE',
              'B': 'BLOQUEADO',
              'R': 'RECUSADO',
              '7': 'SUSPENÇÃO 7 DIAS',
            }[statusMotorista]
          }

          { statusMotorista === 'P' ? 
            <>
              <br />
              <span style={{ 
                display: 'flex',
                float: 'left',
                left: 10,
                bottom: 10,
                fontSize: 20,
              }}>
                <MdTimer size={20} style={{ marginTop: 1 }} />
                <div style={{ width: 6 }} ></div>
                {` ${tempo.m}:${tempo.s}`}
              </span>
            </>
          : <></>}

          <div style={{
            display: 'flex',
            float: 'right',
            right: 10,
            bottom: 10,
          }}>
            <button onClick={desfazStatus}
              style={{ backgroundColor: 'transparent', visibility: mostraDesfaz }}
            >
              <Tooltip 
                title={
                    data.tipo === 'X' 
                      ? 'Voltar para Emitir CT-e' 
                      : 'Voltar para Encerrar Manifesto'
                }
              >
                <span style={{
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginTop: '3px',
                }}>
                  <FaIcon icon='Desfazer' size={20} />
                </span>
              </Tooltip>
            </button>

            <button onClick={atualizaStatus}
              style={{ backgroundColor: 'transparent' }}
            >
              <Tooltip 
                title={
                  data.tipo === 'F' 
                    ? 'Marcar como CT-e Emitido' 
                    : data.tipo === 'X' 
                      ? 'Marcar Manifesto como Encerrado' 
                      : 'Arquivar'
                }
              >
                <span style={{
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginTop: '3px',
                }}>
                  <FaIcon icon={
                  data.tipo === 'F' 
                    ? 'Marcar' 
                    : data.tipo === 'X' 
                      ? 'Confere' 
                      : 'MarcarArquivado'
                } size={20} />
                </span>
              </Tooltip>
            </button>
          </div>

        </div>
      </Container>
      <Email 
        isShowEmail={isShowEmail}
        hide={toggleEmail}
      />
      <PedidoModal
        isShowPedido={isShowPedido}
        hide={togglePedido}
        tipoCad={'V'}
        pedidoID={data.id}
        disableEdit={true}
        mostra={mostra}
      />
    </>
  )
}
