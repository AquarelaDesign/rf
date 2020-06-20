import React, { useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import { MdAdd } from 'react-icons/md'

import { FaIcon } from '../Icone'
import CardMotorista from '../CardMotoristas'
import CardCarga from '../CardCargas'
import CardTransporte from '../CardTranportes'

import GridUsuarios from '../Cadastro/GridUsuarios'

import { Container } from './styles'

const getModalStyle = () => {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    // background: 'none',
    borderRadius: '5px',
    padding: '20px',
    backgroundColor: '#2699F8',
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

const List = ({ data }) => {
  const classes = useStyles()

  const [modalStyle] = React.useState(getModalStyle)
  const [open, setOpen] = React.useState(false)
  const [tipo, setTipo] = React.useState('')
  const [body, setBody] = React.useState('')

  const Card = (card, id) => {
    switch (card.tipo) {
      case 'M':
        return <CardMotorista
          key={card.id}
          index={id}
          data={card}
        />
      case 'C':
        return <CardCarga
          key={card.id}
          index={id}
          data={card}
        />
      case 'T':
        // console.log('Transporte', card)
        return <CardTransporte
          key={card.id}
          index={id}
          data={card}
        />
      default: return null
    }
  }

  const handleOpen = () => {
    setOpen(true)
  };

  const handleClose = () => {
    setOpen(false)
  }

  // const body = (<GridUsuarios />)

  const handleClick = async (tipo, e) => {
    e.preventDefault()
    // console.log('handleClick', tipo, e)

    setTipo(tipo)

    switch (tipo) {
      case 'M':
        setBody(
          <div style={modalStyle} className={classes.paper}>
            <GridUsuarios />
          </div>
        )
        handleOpen()
        break
      case 'C':
        setBody (
          <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">CADASTRO DE PEDIDOS</h2>
          </div>
        )
        handleOpen()
        break
      default: return null
    }

    /*
    switch (tipo) {
      case 'M':
        // alert('Cadastro de Usuários')
        handleOpen()
        break
      case 'C':
        alert('Cadastro de Pedidos')
        break
      default: return null
    }
    */
  }

  return (
    <>
      <Container done={data.done}>
        {/* {console.log('Transporte-1', data)} */}

        <header>
          <h2><FaIcon icon={data.icon} size={28} /> {data.title}</h2>
          {data.creatable && (
            <button type="button">
              <MdAdd size={20} color="#FFF" onClick={(e) => handleClick(data.tipo, e)} />
            </button>
          )}
        </header>

        <PerfectScrollbar>
          <ul>
            {data.cards.map((card, index) => (
              Card(card, index)
            ))}
          </ul>
        </PerfectScrollbar>
      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </>
  )
}

export default List