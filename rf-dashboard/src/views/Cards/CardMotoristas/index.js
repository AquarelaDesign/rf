import React, { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import StarRatings from 'react-star-ratings'
// import BoardContext from '../Board/context';
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip } from '@material-ui/core'
import { formatToPhone } from 'brazilian-values'
// import { SmtpEmail } from '../../services/smtp'
import { Container, RLeft, RRight, Texto } from './styles'

import semImagem from '../../../assets/sem_foto.png'
import { FaIcon } from '../../../components/Icone'

import Email from '../../../components/Email'
import useModalEmail from '../../../components/Email/useModal'

import UsuarioModal from '../../Cadastro/UsuarioModal'
import useModal from '../../Cadastro/UsuarioModal/useModal'

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
  const ref = useRef()
  const classes = useStyles()
  
  const [mostra, setMostra] = useState(false)
  const { isShowEmail, toggleEmail } = useModalEmail()
  const { isShowUsuario, toggleUsuario } = useModal()

  const abreCadastro = (e) => {
    setMostra(!mostra)
    toggleUsuario()
  }

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'CARD', index, data },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {
    },

    drop(item, monitor) {
      // const pedido = {
      //   'Pedido': item,
      //   'Motorista': data
      // }
      // console.log('pedido', pedido, monitor)
    }
  })

  dragRef(dropRef(ref))

  return (
    <>
      <Container ref={ref} isDragging={isDragging}>
        <div className={classes.botoes}>
          {data.whats && (
            <a target="_blank"
              rel="noopener noreferrer"
              href={`https://api.whatsapp.com/send?phone=55${data.whats}&text=`}
            >
              <Tooltip title={formatToPhone(data.whats)}>
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

          {data.email && (
            <button onClick={() => {
              toggleEmail()
            }}
              style={{ backgroundColor: 'transparent' }}
            >
              <Tooltip title={data.email}>
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

          {data.celular && (
            <button onClick={() => {
            }}
              style={{ backgroundColor: 'transparent' }}
            >
              <Tooltip title={formatToPhone(data.celular)}>
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

        <div onDoubleClick={abreCadastro} >
          <RLeft>
            <img src={data.foto !== null ? `${dev}images/${data.foto}` : semImagem} alt="" />
          </RLeft>
          <RRight>
            <Texto bgcolor='#E7E6E6' size={16} bold={true}>
              {data.nome}
            </Texto>

            <StarRatings
              rating={data.rate}
              starRatedColor="#F9D36B"
              starDimension="14px"
              starSpacing="1px"
              // changeRating={this.changeRating}
              numberOfStars={5}
              name='rating'
            />
            <Texto color='#2699FB' size={12}>
              Tipo de veículo: {data.veiculos.length > 0 ? data.veiculos[0].tipo : ''}
            </Texto>
            <Texto bgcolor='#E7E6E6' size={10}>
              RT: {`${data.origem} x ${data.destino}`}
            </Texto>
            <Texto bgcolor='#E7E6E6' size={12}>
              Vagas disponíveis: {data.veiculos.length > 0 ? data.veiculos[0].vagas : 0} vagas
          </Texto>
            <Texto bgcolor='#90D284' size={12}>
              {data.localizacao}
            </Texto>
          </RRight>
          {/* <header>
          {data.labels.map(label => <Label key={label} color={label} />)}
          </header> 
          <p>{data.nome}</p>
          */}
        </div>
      </Container>
      <Email 
        isShowEmail={isShowEmail}
        hide={toggleEmail}
      />
      <UsuarioModal
        isShowUsuario={isShowUsuario}
        hide={toggleUsuario}
        tipo='V'
        usuarioId={data.id}
      />
    </>
  )
}
