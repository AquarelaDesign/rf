import React, { useState } from 'react'
import produce from 'immer'

import { 
  loadMotoristas, 
  loadCargas, 
  loadTransportes, 
  loadEntregas 
} from '../../services/api'

import BoardContext from './context'

import List from '../List'

import { Container } from './styles'

const dataM = loadMotoristas()
const dataC = loadCargas()
const dataT = loadTransportes()
const dataE = loadEntregas()

export default function Board() {
  const [motorista, setMotorista] = useState(dataM)
  const [carga, setCarga] = useState(dataC)
  const [transporte, setTransporte] = useState(dataT)
  const [entrega, setEntrega] = useState(dataE)

  function move(fromList, toList, from, to) {
    console.log('Board_move', fromList, toList, from, to)
    setMotorista(produce(motorista, draft => {
      const dragged = draft[fromList].cards[from];
      draft[fromList].cards.splice(from, 1);
      draft[toList].cards.splice(to, 0, dragged);
    }))

    // eslint-disable-next-line default-case
    switch (fromList) {
      case 0:
        setMotorista(produce(motorista, draft => {
          motorista.cards.splice(from, 1);

          const dragged = motorista.cards[from];
          draft[motorista].cards.splice(from, 1);
          draft[carga].cards.splice(to, 0, dragged);
        }))
      break
      // case 1: 
      //   setCarga(produce(carga, draft => {
      //     carga.cards.splice(from, 1);
      //   }))
      // break
      // case 2: 
      // setTransporte(produce(transporte, draft => {
      //   transporte.cards.splice(from, 1);
      //   }))
      // break
      // case 3:
      //   setEntrega(produce(entrega, draft => {
      //     entrega.cards.splice(from, 1);
      //   }))
      // break
    }


  }

  function removeM(from) {
    // setMotorista(motorista.cards.splice(from, 1))
    setMotorista(produce(motorista, draft => {
      motorista.cards.splice(from, 1)
      console.log('Board_removeItem-1', motorista)
    }))
  }

  function removeItem(fromList, from) {
    // console.log('Board_removeItem', fromList, from, motorista)
    // eslint-disable-next-line default-case
    switch (fromList) {
      case 0:
        setMotorista(produce(motorista, draft => {
          motorista.cards.splice(from, 1);
          // console.log('Board_removeItem-1', motorista)
        }))
      break
      // case 1: 
      //   setCarga(produce(carga, draft => {
      //     carga.cards.splice(from, 1);
      //   }))
      // break
      // case 2: 
      // setTransporte(produce(transporte, draft => {
      //   transporte.cards.splice(from, 1);
      //   }))
      // break
      // case 3:
      //   setEntrega(produce(entrega, draft => {
      //     entrega.cards.splice(from, 1);
      //   }))
      // break
    }
  }

  return (
    <BoardContext.Provider value={{ 
      move, removeItem, removeM,
      }}>
      <Container>
        <List key={motorista.title} data={motorista} />
        <List key={carga.title} data={carga} />
        <List key={transporte.title} data={transporte} />
        <List key={entrega.title} data={entrega} />
      </Container>
    </BoardContext.Provider>
  );
}
