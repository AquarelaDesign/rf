import styled, { css } from 'styled-components';

export const Blank = styled.div`
  border: 0;
  border-radius: 3px;
  margin-left: 10px;
  padding: 0px;
  margin-right: 0px;
  height: 20px;
  width: 20px;
`;

export const Botao = styled.button`
  border: 0;
  border-radius: 3px;
  width: ${props => props.width ? `${props.width}` : '20px'};
  height: ${props => props.height ? `${props.height}` : '20px'};
  font-size: 14px;
  font-weight: bold;
  font-style: italic;
  background: ${props => props.bg ? `${props.bg}` : '#FFFFFF'};
  color: ${props => props.color ? `${props.color}` : '#225378'};
  cursor: pointer;
  margin-left: 10px;
  padding: 0px;
  margin-right: 0px;

  &:hover {
    /* background: #225378;
    color: #FFFFFF; */
    background: ${props => props.bgh ? `${props.bgh}` : '#FFFFFF'};
    /* color: #0031FF; */
    text-shadow: #B5B5B5 2px 3px 3px;
  }
`;

export const BoxTitulo = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: left;
  margin: auto;
  width: ${props => props.width ? props.width : '100%'};
  height: ${props => props.size + 2}px;
  border-radius: 4px;
  border: ${props => props.border};
  background: ${props => props.bgcolor};
  color: ${props => props.color};
  font-size: ${props => props.size}px;
  font-weight: bold;
  margin-bottom: ${props => props.mb}px;
  margin-top: ${props => props.mt}px;
  padding-top: ${props => props.pt}px;
`;

export const Container = styled.div`
  position: relative;
  background: #2699F8;
  border-radius: 5px;
  border: transparent;
  margin-bottom: 10px;
  padding: 5px;
  width: ${props => props.width ? `${props.width}px` : '100%'};
  height: 95%;
  /* box-shadow: 0 1px 4px 0 rgba(192, 208, 230, 0.8); */
  /* border-top: 20px solid rgba(230, 236, 245, 0.4); */
  /* cursor: grab; */

  header {
    position: absolute;
    top: -22px;
    left: 15px;
  }

  p {
    font-weight: 500;
    line-height: 20px;
  }

  /* img {
    width: 180px;
    height: 180px;
    border-radius: 2px;
    margin-top: 5px;
    align-content: center;
    align-items: center;
    align-self: center;
    justify-content: center;
  } */

  ${props => props.isDragging && css`
    border: 2px dashed rgba(0, 0, 0, 0.2);
    padding-top: 31px;
    border-radius: 0;
    background: transparent;
    box-shadow: none;

    p, img, header {
      opacity: 0;
    }
  `}
`;

export const Grid = styled.div`
  display: flex;
  flex-direction: row;
  order: 3;
  flex-grow: 4;
  flex-flow: row wrap;
  background: ${props => props.bgcolor};
  border-radius: 4px;
  border: ${props => props.border};
  margin-bottom: ${props => props.mb}px;
  width: 100%;
`;

export const RLeft = styled.div`
  width: 86%;
  float: left;
`;

export const RRight = styled.div`
  display: flex;
  width: 14%;
  float: right;
  align-items: flex-end;
  align-self: flex-end;
  vertical-align: middle;
`;

export const Texto = styled.div`
  width: ${props => props.width ? `${props.width}px` : '100%'};
  height: ${props => props.height ? `${props.height}px` : 'auto'};
  /* height: ${props => props.height ? props.height : props.size + 4}px; */
  border-radius: 4px;
  padding-left: 3px;
  padding-right: 3px;
  justify-content: center;
  align-items: center;
  /* margin: auto; */
  /* display: inline-flex;
  justify-content: left; */
  background: ${props => props.bgcolor};
  color: ${props => props.estado === 'Funcionando' ? '#31C417' : 
                    props.estado === 'Pane' ? '#0031FF' : 
                    props.estado === 'Sinistrado' ? '#E6474D' : 
                    props.color};
  font-family: ${props => props.font};
  font-size: ${props => props.size}px;
  font-weight: ${props => props.bold ? props.bold : null};
  font-style: ${props => props.italic ? 'italic' : null};
  text-shadow: ${props => props.shadow ? '#B5B5B5 2px 3px 3px' : null};
  margin-bottom: ${props => props.mb}px;
  margin-top: ${props => props.mt}px;
`;

export const Label = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
  background: ${props => props.color};
`;

export const Imagem = styled.div`
  width: ${props => props.width ? `${props.width}px` : '100%'};
  height: ${props => props.height ? `${props.height}px` : 'auto'};
  /* max-width: ${props => props.height ? `${props.height}px` : '120px'}; */
  border-radius: ${props => props.br ? `${props.br}px` : '5px'};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  /* margin-right: 10px; */
`;

export const ContainerCard = styled.div`
  display: grid;
  /* grid-gap: 1rem; */
  grid-template-columns: repeat(2, 1fr);
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: lightpink;
  /* padding: 0 0.5rem 0; */
  padding-left: ${props => props.pe ? `${props.pl}px` : '0px'};
  padding-right: ${props => props.pd ? `${props.pd}px` : '0px'};
`;

export const Visual = styled.div`
  height: 370px;
  width: 100%;
  background: wheat;
  /* margin: 0.5rem 0; */
`;

