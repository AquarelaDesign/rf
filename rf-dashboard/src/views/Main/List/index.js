import React, { useCallback } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
// import { makeStyles } from '@material-ui/core/styles'

import { MdAdd } from 'react-icons/md'

import { FaIcon } from '../../../components/Icone'
import CardMotorista from '../../Cards/CardMotoristas'
import CardCarga from '../../Cards/CardCargas'
import CardTransporte from '../../Cards/CardTranportes'
import CardEmitirCTe from '../../Cards/CardEmitirCTe'
import CardFinanceiro from '../../Cards/CardFinanceiro'

import GridUsuariosModal from '../../Cadastro/GridUsuariosModal'
import useModal from '../../Cadastro/GridUsuariosModal/useModal'

import GridPedidosModal from '../../Pedidos/GridPedidosModal'
import useModalPedidos from '../../Pedidos/GridPedidosModal/useModal'

import { Container } from './styles'

const List = ({ data }) => {
  const { isShowing, toggleGridUsuarios } = useModal()
  const { isShowPedido, toggleGridPedidos } = useModalPedidos()

  const Card = useCallback((card, id) => {
    // console.log('**** List.Card.tipo', card.tipo)
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
        return <CardTransporte
          key={card.id}
          index={id}
          data={card}
        />
      case 'F':
      case 'X':
      case 'Y':
        return <CardEmitirCTe
          key={card.id}
          index={id}
          data={card}
        />
      case 'P':
      case 'A':
      case 'H':
        return <CardFinanceiro
          key={card.id}
          index={id}
          data={card}
        />
  
      default: return null
    }
  }, [data])

  const handleClick = async (tipo, e) => {
    e.preventDefault()

    switch (tipo) {
      case 'M':
        toggleGridUsuarios()
        break
      case 'C':
        toggleGridPedidos()
        break
      default: return null
    }
  }

  return (
    <>
      <Container done={data.done}>
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

      <GridUsuariosModal 
        isShowing={isShowing}
        hide={toggleGridUsuarios}
      />

      <GridPedidosModal
        isShowing={isShowPedido}
        hide={toggleGridPedidos}
      />
    </>
  )
}

export default List