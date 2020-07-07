import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import StarRatings from 'react-star-ratings'
// import BoardContext from '../Board/context';

import { Container, RLeft, RRight, Texto } from './styles';

export default function CardMotoristas({ data, index }) {
  const ref = useRef();
  // const { removeM } = useContext(BoardContext);

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'CARD', index, data },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {
      // const draggedListIndex = item.listIndex;
      // const targetListIndex = listIndex;

      // const draggedIndex = item.index;
      // const targetIndex = index;

      // if (draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
      // if (draggedIndex === targetIndex) {
      //   return;
      // }
      // console.log('CardMotoristas_item', item, monitor)

      // const pedido = {
      //   'origem': item,
      //   'destino': data
      // }
      // console.log('pedido', pedido)

      /*
      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;

      const draggedOffset = monitor.getClientOffset();
      const draggedTop = draggedOffset.y - targetSize.top;

      if (draggedIndex < targetIndex && draggedTop < targetCenter) {
        return;
      }

      if (draggedIndex > targetIndex && draggedTop > targetCenter) {
        return;
      }
      */

      // move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);
      //removeM(draggedIndex);

      // item.index = targetIndex;
      // item.listIndex = targetListIndex;
    },

    drop(item, monitor) {
      // const pedido = {
      //   'Pedido': item,
      //   'Motorista': data
      // }
      // console.log('pedido', pedido, monitor)
    }
  })

  dragRef(dropRef(ref));

  return (
    <Container ref={ref} isDragging={isDragging}>
      <RLeft>
        { data.foto && <img src={`../images/${data.foto}`} alt=""/> }
      </RLeft>
      <RRight>
        <Texto bgcolor='#E7E6E6' size={16} bold={true}>{data.nome}</Texto>
        
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
    </Container>
  );
}
