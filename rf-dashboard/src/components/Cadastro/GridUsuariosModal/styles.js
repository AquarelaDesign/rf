import styled, { css } from 'styled-components';

export const Container = styled.div`
  position: relative;
  background: #2699F8;
  border-radius: 5px;
  border: transparent;
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
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
    width: 90px;
    height: 90px;
    border-radius: 2px;
    margin-top: 5px;
  }
 */
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

export const Label = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
  background: ${props => props.color};
`;

export const RLeft = styled.div`
  width: 85%;
  float: left;
`;

export const RRight = styled.div`
  display: flex;
  width: 15%;
  float: right;
  align-items: flex-end;
  align-self: flex-end;
  vertical-align: middle;
`;

export const BoxTitulo = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: left;
  margin: auto;
  width: 100%;
  height: ${props => props.height ? `${props.height + 2}px` : '100%'};
  border-radius: 4px;
  border: ${props => props.border};
  background: ${props => props.bgcolor};
  color: ${props => props.color};
  font-size: ${props => props.size}px;
  font-weight: bold;
  margin-bottom: ${props => props.mb ? `${props.mb + 2}px` : '0'};
  margin: ${props => props.mg}px;
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
`;

export const Item = styled.div`
  display: flex;
  flex-direction: row;
  
  ${({ active }) => active && `
    color: blue;
  `}

`;

export const BoxStatus = styled.div`
  display: flex;
  margin: 0px;
  width: 18px;
  height: 18px;
  margin-top: 10px;
  border-radius: 15px;
  border-color: '#FFFFFF';
  background: ${props => props.color};
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  flex-flow: row;
  margin: auto;
  width: 100%;
  height: ${props => props.height ? props.height : props.size + 2}px;
  border-radius: 4px;
  background: ${props => props.bgcolor};
  color: ${props => props.color};
  font-size: ${props => props.size}px;
  border: ${props => props.border};
  margin-bottom: ${props => props.mb}px;
`;

export const LinhaVeiculo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  margin: auto;
  width: 100%;
  height: ${props => props.height ? props.height : props.size + 2}px;
  border-radius: 4px;
  background: ${props => props.bgcolor};
  color: ${props => props.color};
  font-size: ${props => props.size}px;
`;

export const Texto = styled.div`
  width: ${props => props.width ? `${props.width}px` : '100%'};
  height: ${props => props.height ? `${props.height}px` : 'auto'};
  /* height: ${props => props.height ? props.height : props.size + 4}px; */
  border-radius: 4px;
  padding-left: 3px;
  padding-right: 3px;
  margin: auto;
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

export const Botao = styled.button`
  border: 0;
  border-radius: 3px;
  width: 20px;
  height: 20px;
  font-size: 14px;
  font-weight: bold;
  font-style: italic;
  background: #FFFFFF;
  color: #225378;
  cursor: pointer;
  margin-left: 10px;
  padding: 0px;
  margin-right: 0px;

  &:hover {
    /* background: #225378;
    color: #FFFFFF; */
    background: #FFFFFF;
    /* color: #0031FF; */
    text-shadow: #B5B5B5 2px 3px 3px;
  }
`;

