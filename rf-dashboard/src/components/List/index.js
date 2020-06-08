import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { MdAdd } from 'react-icons/md';

import { FaIcon } from '../Icone'
import Card from '../Card';

import { Container } from './styles';

export default function List({ data, index: listIndex }) {

  return (
    <Container done={data.done}>
      <header>
        <h2><FaIcon icon={data.icon} size={28} /> {data.title}</h2>
        {data.creatable && (
          <button type="button">
            <MdAdd size={20} color="#FFF" />
          </button>
        )}
      </header>

      <PerfectScrollbar>
        <ul>
          { data.cards.map((card, index) => (
            <Card 
              key={card.id} 
              listIndex={listIndex}
              index={index} 
              data={card}
            />
          )) }
        </ul>
      </PerfectScrollbar>
    </Container>
  );
}
