import React, { useState } from 'react';
import produce from 'immer';

import { 
  loadMotoristas, 
  loadCargas, 
  loadTransportes, 
  loadEntregas 
} from '../../services/api';

import BoardContext from './context';

import List from '../List';

import { Container } from './styles';

const motoristas = loadMotoristas();
const cargas = loadCargas();
const transportes = loadTransportes();
const entregas = loadEntregas();

export default function Board() {
  const [motorista, setMotorista] = useState(motoristas);
  const [carga, setCarga] = useState(cargas);
  const [transporte, setTransporte] = useState(transportes);
  const [entrega, setEntrega] = useState(entregas);

  function move(fromList, toList, from, to) {
    setMotorista(produce(motorista, draft => {
      const dragged = draft[fromList].cards[from];

      draft[fromList].cards.splice(from, 1);
      draft[toList].cards.splice(to, 0, dragged);
    }))
  }

  function removeItem(fromList, from) {
    setMotorista(produce(motorista, draft => {
      draft[fromList].cards.splice(from, 1);
    }))
  }

  return (
    <BoardContext.Provider value={{ 
      motorista, carga, transporte, entrega, move, removeItem 
      }}>
      <Container>
        <List key={motoristas.title} index={0} data={motoristas} />
        <List key={cargas.title} index={1} data={cargas} />
        <List key={transportes.title} index={2} data={transportes} />
        <List key={entregas.title} index={3} data={entregas} />
      </Container>
    </BoardContext.Provider>
  );
}
