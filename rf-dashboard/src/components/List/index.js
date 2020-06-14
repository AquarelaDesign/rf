import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { MdAdd } from 'react-icons/md'

import { FaIcon } from '../Icone'
import CardMotorista from '../CardMotoristas'
import CardCarga from '../CardCargas'
import CardTransporte from '../CardTranportes'

import { Container } from './styles';

export default function List({ data }) {
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
        console.log('Transporte', card)
        return <CardTransporte
                  key={card.id} 
                  index={id} 
                  data={card}
                />
      default: return null
    }
  }

  const handleClick = async (tipo, e) => {
    e.preventDefault()
    console.log('handleClick', tipo, e)

    switch (tipo) {
      case 'M': 
        alert('Criar novo Motorista')
        break
      case 'C': 
        alert('Criar novo Pedido')
      break
      default: return null
    }
  }

  return (
    <Container done={data.done}>
      {console.log('Transporte-1', data)}

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
          { data.cards.map((card, index) => (
            Card(card, index)
          )) }
        </ul>
      </PerfectScrollbar>
    </Container>
  );
}
