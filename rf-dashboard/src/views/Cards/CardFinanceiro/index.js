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

export default function CardFinanceiro({ data, index }) {
  const ref = useRef()
  const classes = useStyles()

  // const [cliente, setCliente] = useState({})
  const [motorista, setMotorista] = useState({})
  const [local, setLocal] = useState('')
  const [localColeta, setLocalColeta] = useState([])
  const [localEntrega, setLocalEntrega] = useState([])
  const [rota, setRota] = useState('')
  const [valorPago, setValorPago] = useState(0)
  // const [statusPagamento, setStatusPagamento] = useState('')
  // const [statusPedido, setStatusPedido] = useState(false)
  // const [confirmado, setConfirmado] = useState(false)
  const [mostra, setMostra] = useState(null)
  const [mostraFecha, setMostraFecha] = useState(false)
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
    // console.log('**** CardFinanceiro.data', data)
    // setRotas(data.rotas)
    if (data.status_fin === 'F') {
      setMostraFecha('hidden')
    } else {
      setMostraFecha('visible')
    }

    buscaMotorista(data.motorista_id)

    const carrega = async () => {

      // console.log('**** CardCargas.carrega.data', data)
      let rotas = data.rotas
      
      if (rotas && rotas.length > 0) {
        let rt = []
        let localcoleta = undefined
        let localentrega = undefined
        let valor = 0
    
        rotas.map(r => {
          if (r.motorista_id === data.motorista_id) {
            rt.push({
              status: r.status,
              id: r.id,
              valor_pago: r.valor_pago,
            })
          }
        })
  
        // console.log('**** CardCargas.carrega.rt', rt)

        if (rt.length > 0) {
          try {
            let cont = 0
            for (let x = 0; x < rt.length; x++) {
              if (localcoleta === undefined) {
                localcoleta = rt[x].id
                valor += rt[x].valor_pago
                cont++
              } else if (localentrega === undefined) {
                localentrega = rt[x].id
                if (valor === 0 && rt[x].valor_pago > 0) {
                  valor += rt[x].valor_pago
                }
                cont++
              }
              if (cont >= 2) {
                break
              }
            }
          }
          catch (e) {
            console.log('**** CardCargas.carrega.error', e)
          }
  
        }

        // console.log('**** CardCargas.carrega.valor', valor)
        setValorPago(valor)
  
        const resColeta = await BuscaRota(localcoleta, rotas)
        setLocalColeta(resColeta[0])
  
        const resEntrega = await BuscaRota(localentrega, rotas)
        setLocalEntrega(resEntrega[0])
  
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
    }
    carrega()

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

          // console.log('**** CardFinanceiro.buscaMotorista', data.veiculos)
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
              console.log('**** CardFinanceiro.buscaMotorista.error.data', data)
            }
          } else if (error.request) {
            console.log('**** CardFinanceiro.buscaMotorista.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  const salvaHistorico = async (pedidoId, motoristaId, clienteId, operadorId, observacao) => {
    console.log('**** CardFinanceiro.salvaHistorico', pedidoId, motoristaId, clienteId, operadorId, observacao)
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
            console.log('**** CardFinanceiro.salvaHistorico.error.data', data)
          }
        } else if (error.request) {
          console.log('**** CardFinanceiro.salvaHistorico.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const atualizaStatus = async () => {
    let par_tipo = 'H'
    let par_status = 'F'
    let par_hist = 'Pagamento Realizado'
    let par_pedido = data.id
    
    // console.log('**** CardFinanceiro.atualizaStatus', data.fiscal, par_pedido)
    await api.put(`/financeiros/${data.Financeiro}`, {
      tipo: par_tipo,
      valor: valorPago,
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
          console.log('**** CardFinanceiro.atualizaStatus.error.data', data)
        }
      } else if (error.request) {
        console.log('**** CardFinanceiro.atualizaStatus.error', error)
        // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
    
  }

  const abrePedido = (e) => {
    setMostra(true)
    togglePedido()
  }

  const callBackPedido = (e) => {
    setMostra(null)
  }

  return (
    <>
      <Container ref={ref}>
        {data.status_fin !== 'F' &&
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
        }

        <div onDoubleClick={abrePedido} >
          {data.status_fin !== 'F' && 
          <>
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
          </>
          }
          <BoxTitulo size={20} mt={data.status_fin === 'F' ? 0 : 10}>
            <Texto>PEDIDO {data.id} - {moment(data.updated_at).format('DD/MM/YYYY')}</Texto>
            {/* {local &&
              <Texto bgcolor='#90D284' size={12} height={20}>{local}</Texto>
            } */}
          </BoxTitulo>
          {localColeta && rota !== '' &&
            <Texto bgcolor='#E7E6E6' size={12}>{rota}</Texto>
          }
        
          <div style={{ 
            padding: 5, 
            fontSize: '14px', 
            backgroundColor: `${
              data.status_fin === 'B' ? '#ef898d' : 
              data.status_fin === 'X' ? '#ef898d' : 
              data.status_fin === 'A' ? '#F9D36B' : 
              data.status_fin === 'L' ? '#F9D36B' : 
              data.status_fin === 'F' ? '#90D284' : 
              '#0078D7' 
            }`,
            color: `${
              data.status_fin === 'B' ? '#F9D36B' : 
              data.status_fin === 'X' ? '#F9D36B' : 
              data.status_fin === 'A' ? '#ef898d' : 
              data.status_fin === 'L' ? '#ef898d' : 
              data.status_fin === 'F' ? '#0078D7' : 
              '#90D284' 
            }`,
            width: '100%',
            height: `${data.status_fin === 'F' ? '25px' :'45px'}`,
            borderRadius: 5,
            fontWeight: 'bold', 
            }}
          >
            Status: {
              {
                ' ': 'REALIZAR PAGAMENTO',
                'A': 'EM ANALISE',
                'X': 'COM AVARIA',
                'B': 'BLOQUEADO',
                'L': 'EM PROCESSO DE LIBARAÇÃO',
                'F': 'PAGAMENTO REALIZADO',
              }[data.status_fin]
            }

            <div style={{
              display: 'flex',
              float: 'right',
              right: 10,
              bottom: 10,
            }}>
            
              <button onClick={atualizaStatus}
                style={{ backgroundColor: 'transparent', visibility: mostraFecha }}
              >
                <Tooltip 
                  title='Pagamento Realizado'
                >
                  <span style={{
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginTop: '3px',
                    color: '#90D284'
                  }}>
                    <FaIcon icon='Marcar' size={20} />
                  </span>
                </Tooltip>
              </button>
            </div>
          </div>

          {data.status_fin === 'F' &&
            <Texto bgcolor='#E7E6E6' size={12} mb={5} padding={5}>
              Valor Pago: {valorPago} <br/>
              {
                `${motorista.origem} x ${motorista.destino} - ${data.veiculos ? data.veiculos.length : '0' } veículos`
              } <br/>
              Motorista: {motorista.nome}
            </Texto>
          }
        </div>

      </Container>
      <Email 
        isShowEmail={isShowEmail}
        hide={toggleEmail}
      />

      {mostra && 
        <PedidoModal
          isShowPedido={isShowPedido}
          hide={togglePedido}
          tipoCad={'V'}
          pedidoID={data.id}
          disableEdit={true}
          mostra={mostra}
          callBack={callBackPedido}
        />
      }
    </>
  )
}
