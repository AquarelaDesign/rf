import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  vertical-align: auto;
  align-items: center;
  height: 35px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  background: #2699F8;
  color: #FFF;
  width: 100%;
`;

export const Label = styled.div`
  font-size: 16px;
  font-weight: 300;
  text-align: left;
  display: inline-block;
  margin-right: 5px;
  margin-top: 15px;
  width: ${props => props.width ? `${props.width}px` : '100%'};
`;

export const RLeft = styled.div`
  width: 80%;
  float: left;
`;

export const RRight = styled.div`
  width: 20%;
  float: right;
  margin-right: 20px;
`;

export const Botao = styled.button`
  border: 0;
  border-radius: 3px;
  width: 120px;
  height: 22px;
  font-size: 14px;
  font-weight: bold;
  font-style: italic;
  background: none;
  color: #FFFFFF;
  cursor: pointer;
  margin-right: 15px;

  &:hover {
    background: #225378;
    color: #FFFFFF;
  }
`;

export const BotaoExit = styled.button`
  border: 0;
  border-radius: 3px;
  width: 100px;
  height: 26px;
  font-size: 14px;
  font-weight: bold;
  font-style: italic;
  background: #FFFFFF;
  color: #225378;
  cursor: pointer;
  margin-left: 10px;
  float: right;

  &:hover {
    background: #225378;
    color: #FFFFFF;
  }
`;

export const Input = styled.input`
  padding: 0.5em;
  /* margin: 0.5em; */
  color: #0078D7;
  background: #FFFFFF;
  /* border: none; */
  border: '1px solid #2699F8';
  border-radius: 3px;
  margin-right: 20px;
  width: ${props => props.width ? `${props.width}px` : '100%'};
  height: 25px;
  margin-top: 15px;
`;

export const Titulo = styled.div`
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  display: flex;
  margin-top: 15px;
  margin-bottom: 15px;
  width: ${props => props.width ? `${props.width}px` : '100%'};
`;

