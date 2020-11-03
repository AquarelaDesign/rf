import styled, { css } from 'styled-components';

export const Container = styled.div`
  position: relative;
  background: #FFF;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 5px;
  height: auto;
  box-shadow: 0 1px 4px 0 rgba(192, 208, 230, 0.8);
  cursor: pointer;

  header {
    position: absolute;
    top: -22px;
    left: 15px;
  }

  p {
    font-weight: 500;
    line-height: 20px;
  }

  img {
    width: 90px;
    height: 90px;
    border-radius: 2px;
    margin-top: 5px;
    /* margin-left: -5px; */
  }

  ${props => props.isDragging && css`
    border: 2px dashed rgba(0, 0, 0, 0.2);
    padding-top: 31px;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    cursor: grabbing;

    p, img, header {
      opacity: 0;
    }
  `}
`;

export const Label = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
  background: ${props => props.color};
`;

export const RLeft = styled.div`
  width: 30%;
  float: left;
`;

export const RRight = styled.div`
  width: 70%;
  float: right;
`;

export const Texto = styled.div`
  width: ${props => props.width ? `${props.width}px` : '100%'};
  height: ${props => props.height ? `${props.height}px` : 'auto'};
  /* height: ${props => props.height ? props.height : props.size + 4}px; */
  border-radius: 4px;
  padding-left: 3px;
  padding-right: 3px;
  margin: auto;
  display: inline-flex;
  background: ${props => props.bgcolor};
  color: ${props => props.estado === 'Funcionando' ? '#31C417' : 
                    props.estado === 'Pane' ? '#0031FF' : 
                    props.estado === 'Sinistrado' ? '#E6474D' : 
                    props.color};
  font-family: ${props => props.font};
  font-size: ${props => props.size}px;
  font-weight: ${props => props.bold ? 500 : null};
  font-style: ${props => props.italic ? 'italic' : null};
  margin-bottom: ${props => props.mb}px;
`;

export const BoxTitulo = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: left;
  margin: auto;
  width: 100%;
  margin-top: ${props => props.mt}px;
  height: ${props => props.size + 2}px;
  border-radius: 4px;
  background: ${props => props.bgcolor};
  color: ${props => props.color};
  font-size: ${props => props.size}px;
  font-weight: bold;
`;

