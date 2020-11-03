import React, { useRef, useEffect, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import StarRatings from 'react-star-ratings'
// import BoardContext from '../Board/context'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip } from '@material-ui/core'
import { formatToPhone, formatToCNPJ, formatToCPF, formatToBRL } from 'brazilian-values'
// import { SmtpEmail } from '../../services/smtp'
import { Container, RLeft, RRight, Texto, BoxTitulo } from './styles'

import semImagem from '../../../assets/sem_foto.png'
import { FaIcon } from '../../../components/Icone'

import Email from '../../../components/Email'
import useModal from '../../../components/Email/useModal'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from "moment"

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

export default function CardAvaria({ data, index }) {
  const ref = useRef()
  const classes = useStyles()

  const [fornecedor, setFornecedor] = useState({})
  const [motorista, setMotorista] = useState({})
  const [pedido, setPedido] = useState({})
  const [local, setLocal] = useState('')
  const [localColeta, setLocalColeta] = useState([])
  const [localEntrega, setLocalEntrega] = useState([])
  const [rota, setRota] = useState('')
  const [statusAvaria, setStatusAvaria] = useState('')
  const [mostra, setMostra] = useState(false)

  const [tempo, setTempo] = useState({
    "h": 0,
    "m": 0,
    "s": 0
  })

  const { isShowEmail, toggleEmail } = useModal()
  const { isShowPedido, togglePedido } = useModalPedido()

  const userID = localStorage.getItem('@rf/userID')

  useEffect(() => {
    buscaMotorista(data.motorista_id)
    buscaFornecedor(data.fornecedor_id)
    buscaPedido(data.pedido_id)
  }, [userID])

  const carregaPedido = (data) => {
    // console.log('**** CardAvaria.data', data)
    // setRotas(data.rotas)
    if (data.rotas.length > 0) {
      setLocal(`${data.rotas[0].cidade}/${data.rotas[0].uf}`)
    }
    // buscaMotorista(data.motorista_id)
    // buscaFornecedor(data.cliente_id)

    const carrega = async () => {
      const resColeta = await BuscaRota(data.localcoleta, data.rotas)
      setLocalColeta(resColeta[0])

      const resEntrega = await BuscaRota(data.localentrega, data.rotas)
      setLocalEntrega(resEntrega[0])

      // console.log('**** CardAvaria.resColeta', data.localcoleta, resColeta)

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
  }

  const buscaPedido = async (pedidoId) => {
    if (pedidoId) {
      await api
        .get(`/pedidos/${pedidoId}`)
        .then(response => {
          const { data } = response
          // console.log('**** CardAvaria.buscaPedido.data', data)
          setPedido(data[0])
          carregaPedido(data[0])
        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** CardAvaria.buscaPedido.error.data', data)
            }
          } else if (error.request) {
            console.log('**** CardAvaria.buscaPedido.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    } else {
      // novoPedido()
    }
  }

  function BuscaRota(id, rotas) {
    return rotas.filter(rota => rota.id === id).map(
      frota => {
        return frota
      }
    )
  }

  const buscaFornecedor = async (fornecedorID) => {
    if (fornecedorID) {
      // await sleep(500)
      await api
        .get(`/usuarios/${fornecedorID}`)
        .then(response => {
          const { data } = response

          // console.log('**** CardAvaria.buscaFornecedor.data', data)
          setFornecedor(data)

        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** CardAvaria.buscaFornecedor.error.data', data)
            }
          } else if (error.request) {
            console.log('**** CardAvaria.buscaFornecedor.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  const buscaMotorista = async (motoristaID) => {
    if (motoristaID) {
      // await sleep(500)
      await api
        .get(`/usuarios/${motoristaID}`)
        .then(response => {
          const { data } = response

          // console.log('**** CardAvaria.buscaMotorista', data.veiculos)
          setMotorista(data)

        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** CardAvaria.buscaMotorista.error.data', data)
            }
          } else if (error.request) {
            console.log('**** CardAvaria.buscaMotorista.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  const salvaHistorico = async (pedidoId, motoristaId, clienteId, operadorId, observacao) => {
    // console.log('**** CardAvaria.salvaHistorico', pedidoId, motoristaId, clienteId, operadorId, observacao)
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
            console.log('**** CardAvaria.salvaHistorico.error.data', data)
          }
        } else if (error.request) {
          console.log('**** CardAvaria.salvaHistorico.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const atualizaStatus = async () => {
    let par_status = 'F'
    let par_hist = `${formatToBRL(data.valor)}, referente: ${data.descricao}, do veículo ${data.placa}`
    let par_pedido = pedido.id
    
    // console.log('**** CardAvaria.atualizaStatus', data.fiscal, par_pedido)
    await api.put(`/avarias/${data.id}`, {
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
          console.log('**** CardAvaria.atualizaPedido.error.data', data)
        }
      } else if (error.request) {
        console.log('**** CardAvaria.atualizaPedido.error', error)
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

  const retCPF_CNPJ = (cpfcnpj) => {
    if (!cpfcnpj) {
      return ''
    }

    if (cpfcnpj.length > 11) {
      return formatToCNPJ(cpfcnpj)
    } else {
      return formatToCPF(cpfcnpj)
    }
  }

  const retTexto = (legenda, texto, tipo = '') => {
    if (texto === null || texto === undefined) {
      return ''
    }

    let val

    if (tipo === 'T') {
      val = formatToPhone(texto)
    } else {
      val = texto.toLowerCase()
    }

    return <span>
            {`${legenda} ${val}`} 
           </span>
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
      // console.log('**** CardEmitirCTe.item.drop', item)
      // removeM(index)
      // const userID = item.data.id
      // const pedidoID = data.id
      atualizaStatus()
    }
  })
  
  // dragRef(dropRef(ref))
  
  return (
    <>
      {/* { console.log('**** CardAvaria.data', data) } */}
      {/* { console.log('**** CardAvaria.fornecedor', fornecedor) } */}
      {/* { console.log('**** CardAvaria.motorista', motorista) } */}
      {/* { console.log('**** CardAvaria.pedido', pedido) } */}
      <Container ref={ref}>
        {data.status !== 'F' &&
          <div className={classes.botoes}>
            {fornecedor.whats && (
              <a target="_blank"
                rel="noopener noreferrer"
                href={`https://api.whatsapp.com/send?phone=55${fornecedor.whats}&text=`}
              >
                <Tooltip title={formatToPhone(fornecedor.whats)}>
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

            {fornecedor.email && (
              <button onClick={() => {
                toggleEmail()
              }}
                style={{ backgroundColor: 'transparent' }}
              >
                <Tooltip title={fornecedor.email}>
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

            {fornecedor.celular && (
              <button onClick={() => {
              }}
                style={{ backgroundColor: 'transparent' }}
              >
                <Tooltip title={formatToPhone(fornecedor.celular)}>
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
        }
        
        <div onDoubleClick={abrePedido} >
          {data.status !== 'F' &&
            <div>
              <RLeft>
                <img src={fornecedor.foto !== null ? `${dev}images/${fornecedor.foto}` : semImagem} alt="" />
              </RLeft>
              <RRight>
                <Texto bgcolor='#E7E6E6' size={16} bold={true}>
                  {fornecedor.nome}
                </Texto>

                <Texto bgcolor='#E7E6E6' size={14} bold={false}>
                  { retCPF_CNPJ(fornecedor.cpfcnpj)}
                </Texto>
                {fornecedor.telefone &&
                  <Texto bgcolor='#E7E6E6' size={14} bold={false}>
                    { retTexto('Tel:', fornecedor.telefone, 'T')}
                  </Texto>
                }
                {fornecedor.celular &&
                  <Texto bgcolor='#E7E6E6' size={14} bold={false}>
                    { retTexto('Celular:', fornecedor.celular, 'T')}
                  </Texto>
                }
                {fornecedor.whats &&
                <Texto bgcolor='#E7E6E6' size={14} bold={false}>
                  { retTexto('WhatsApp:', fornecedor.whats, 'T')}
                </Texto>
                }
                {fornecedor.email &&
                <Texto bgcolor='#E7E6E6' size={14} bold={false}>
                  { retTexto('email:', fornecedor.email, '')}
                </Texto>
                }

                <Texto bgcolor='#90D284' size={12}>
                  {fornecedor.localizacao}
                </Texto>
              </RRight>
            </div>
          }

          <BoxTitulo size={20} mt={data.status === 'F' ? 0 : 10}>
            <Texto bgcolor='#E7E6E6'>PEDIDO {pedido.id} - {moment(pedido.updated_at).format('DD/MM/YYYY')}</Texto>
          </BoxTitulo>

          {data.status !== 'F' &&
            <>
              {rota &&
                <Texto bgcolor='#E7E6E6' size={12}>{rota}</Texto>
              }
              {motorista &&
                <Texto bgcolor='#E7E6E6' size={10}>
                  ROTA: {`${motorista.origem} x ${motorista.destino}`}
                </Texto>
              }
              {pedido.veiculos &&
                <Texto bgcolor='#E7E6E6' size={12} mb={5}>Veículos: {pedido.veiculos.length} unidades</Texto>
              }
            </>
          }
        </div>
        
        <div style={{ 
          padding: 5, 
          fontSize: '14px', 
          backgroundColor: `${data.status === 'F' ? '#F9D36B' : '#90D284'}`,
          width: '100%',
          height: `${data.status === 'F' ? '25px' : '45px'}`,
          borderRadius: 5,
          fontWeight: 'bold', 
          }}
        >
          Status: {
            {
              ' ': 'AGUARDANDO ANALISE',
              'A': 'REALIZAR PAGAMENTO',
              'R': 'EM REPARO',
              'L': 'LIBERADO',
              'F': 'PAGAMENTO REALIZADO',
            }[data.status]
          }

          { data.status !== 'F' &&
            <div style={{
              display: 'flex',
              float: 'right',
              right: 10,
              bottom: 10,
            }}>
              <button onClick={atualizaStatus}
                style={{ backgroundColor: 'transparent' }}
              >
                <Tooltip 
                  title='Marcar Pagamento Efetuado'
                >
                  <span style={{
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginTop: '3px',
                  }}>
                    <FaIcon icon='Marcar' size={20} />
                  </span>
                </Tooltip>
              </button>
            </div>
          }
        </div>
        { data.status === 'F' &&
          <Texto bgcolor='#E7E6E6' size={12}>
            {`${formatToBRL(data.valor)}, referente: ${data.descricao}, do veículo ${data.placa}`}
          </Texto>
        }
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
