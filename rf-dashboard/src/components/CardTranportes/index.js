import React, { useRef, useEffect, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import StarRatings from 'react-star-ratings'
// import BoardContext from '../Board/context';
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip } from '@material-ui/core'
import { formatToPhone } from 'brazilian-values'
// import { SmtpEmail } from '../../services/smtp'
import { Container, RLeft, RRight, Texto, BoxTitulo } from './styles'

import semImagem from '../../assets/sem_foto.png'
import { FaIcon } from '../Icone'
import Email from '../Email'
import useModal from '../Email/useModal'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MdTimer } from 'react-icons/md'

import api from '../../services/rf'

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

export default function CardMotoristas({ data, index }) {
  const ref = useRef();
  const classes = useStyles()

  const [cliente, setCliente] = useState({})
  const [motorista, setMotorista] = useState({})
  const [local, setLocal] = useState('')
  const [localColeta, setLocalColeta] = useState([])
  const [localEntrega, setLocalEntrega] = useState([])
  const [rota, setRota] = useState('')
  const [statusMotorista, setStatusMotorista] = useState('')
  const [statusCor, setStatusCor] = useState('')
  // const [rotas, setRotas] = useState([])
  const [counter, setCounter] = useState(10 * 60)
  const [tempo, setTempo] = useState({
    "h": 0,
    "m": 0,
    "s": 0
  })

  const { isShowEmail, toggleEmail } = useModal()

  useEffect(() => {
    console.log('**** CardMotoristas.data', data)
    // setRotas(data.rotas)
    setLocal(`${data.rotas[0].cidade}/${data.rotas[0].uf}`)
    buscaMotorista(data.motorista_id)
    // buscaCliente(data.cliente_id)

    const carrega = async () => {
      const resColeta = await BuscaRota(data.localcoleta, data.rotas)
      setLocalColeta(resColeta[0])

      const resEntrega = await BuscaRota(data.localentrega, data.rotas)
      setLocalEntrega(resEntrega[0])

      console.log('**** CardMotoristas.resColeta', data.localcoleta, resColeta)

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

  }, [])

  useEffect(() => {
    secondsToTime(counter)
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000)
    return () => {
      clearInterval(timer)
      // setCounter(0)
    }
  }, [counter])

  const secondsToTime = (secs) => {
    let hours = Math.floor(secs / (60 * 60))

    let divisor_for_minutes = secs % (60 * 60)
    let minutes = Math.floor(divisor_for_minutes / 60)

    let divisor_for_seconds = divisor_for_minutes % 60
    let seconds = Math.ceil(divisor_for_seconds)

    let obj = {
      "h": hours.toString().padStart(2, '0'),
      "m": minutes.toString().padStart(2, '0'),
      "s": seconds.toString().padStart(2, '0')
    }
    setTempo(obj)
  }

  function BuscaRota(id, rotas) {
    return rotas.filter(rota => rota.id === id).map(
      frota => {
        return frota
      }
    )
  }

  const buscaCliente = async (clienteID) => {
    if (clienteID) {
      // await sleep(500)
      await api
        .get(`/usuarios/${clienteID}`)
        .then(response => {
          const { data } = response

          console.log('**** CardMotoristas.buscaCliente', data)
          setCliente(data)
        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** CardMotoristas.buscaCliente.error.data', data)
            }
          } else if (error.request) {
            console.log('**** CardMotoristas.buscaCliente.error', error)
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

          console.log('**** CardMotoristas.buscaMotorista', data.veiculos)
          setMotorista(data)
          setStatusMotorista(data.estado)

          if (data.estado !== 'P') {
            const timer =
              counter > 0 && setInterval(() => setCounter(counter - 1), 1000)
            clearInterval(timer)
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
              console.log('**** CardMotoristas.buscaMotorista.error.data', data)
            }
          } else if (error.request) {
            console.log('**** CardMotoristas.buscaMotorista.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  const atualizaMotorista = async (motoristaID) => {
    const vagas = motorista.vagas - data.veiculos.length

    await api.put(`/usuarios/${motoristaID}`, {
      estado: ' ',
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

  const atualizaPedido = async (pedidoID, motoristaID) => {

    await api.put(`/pedidos/${pedidoID}`, {
      motorista_id: motoristaID,
      status: 'D',
      tipo: "C",
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
    // verificar filtro somente para o motorista (motorista_id)
    data.rotas.map(rota => {
      if (rota.status !== 'D') {
        api.put(`/rotas/${rota.id}`, {
          motorista_id: null,
          status: 'D',
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


  
  return (
    <>
      <Container ref={ref}>
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

        <div style={{ 
          padding: 5, 
          fontSize: '14px', 
          backgroundColor: `${ statusMotorista === 'P' ? '#ef898d' : '#90D284' }`,
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
              <MdTimer size={14}/><span style={{ marginLeft: '5px' }}>{` ${tempo.m}:${tempo.s}`}</span>
            </>
          : <></>}
        </div>


      </Container>
      <Email 
        isShowEmail={isShowEmail}
        hide={toggleEmail}
      />
    </>
  )
}
