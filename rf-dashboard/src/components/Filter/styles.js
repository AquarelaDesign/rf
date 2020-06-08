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
  background: #0078D7;
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
  height: 100%;
  float: left;
  padding: 3px;
  color: #FFFFFF;
`;

export const RRight = styled.div`
  width: 20%;
  height: 100%;
  float: right;
  padding: 3px;
  color: #FFFFFF;

  button.btn1 {
    border: 0;
    border-radius: 5px;
    width: 200px;
    height: 32px;
    padding: 0 20px;
    font-size: 16px;
    font-weight: bold;
    background: #225378;
    color: #FFF;
    cursor: pointer;
  }

  button.btn1:hover {
    background: #2393ac;
  }

`;

export const Botao = styled.button`
  border: 0;
  border-radius: 3px;
  width: 100px;
  height: 26px;
  /* padding: 0 20px; */
  font-size: 16px;
  font-weight: bold;
  font-style: italic;
  background: #FFFFFF;
  color: #2393ac;
  cursor: pointer;

  /* Color the border and text with theme.main */
  /* color: ${props => props.theme.main}; */
  /* border: 2px solid ${props => props.theme.main}; */
`;

export const Input = styled.input`
  padding: 0.5em;
  /* margin: 0.5em; */
  color: #0078D7;
  background: #FFFFFF;
  border: none;
  border-radius: 3px;
  margin-right: 20px;
  width: 100px;
  height: 25px;
  margin-top: 2px;
`;


