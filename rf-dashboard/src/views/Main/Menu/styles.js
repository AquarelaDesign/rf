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
  margin-right: 10px;
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


