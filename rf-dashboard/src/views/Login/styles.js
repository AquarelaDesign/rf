import styled from 'styled-components'

export const Div = styled.div`
  display: flex;
  background-color: '#0078D7';
  align-items: center;
  margin: 0;
  height: 100%;
  width: 100%;
`;

export const TituloLogin = styled.div`
  color: #225378;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  font-style: italic;
  font-size: 2em;
  text-align: center;
`;

export const FormLabel = styled.div`
  color: #225378;
  font-family: "Montserrat", sans-serif;
  font-style: italic;
  font-size: 1.3em;
  margin-top: 20px;
`;

export const Loginsc = styled.div`
  display: flex;
  width: 400px;
  height: 500px;
  flex-direction: column;
  align-items: center;
  float: right;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 21px;
  padding: 0px 20px;
  margin: 80px 20px;

  p {
    font-size: 1em;
    line-height: 30px;
    margin-bottom: 30px;
  }

  Form {
    margin-top: 10px;
    width: 95%;
    height: 95%;
    /* display: flex; */
    /* flex-direction: column; */
    margin-bottom: -10px;
  }

  button.btnRLogin {
    border: 0;
    border-radius: 2px;
    height: 20px;
    width: 92%;
    margin-left: 30px;
    margin-bottom: 15px;
    text-align: left;
    font-weight: bold;
    font-size: 0.7em;
    background: rgba(78, 212, 230, 0);
    color: #2699FB;
    cursor: pointer;
  }

  button.btnRLogin:hover {
    color: #225378;
    background: rgba(78, 212, 230, 0);
  }

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

  input.login {
    border: 0px solid #ddd;
    border-bottom: 2px solid #225378;
    border-radius: 2px;
    background: none;
    height: 30px;
    width: 92%;
    margin-left: 30px;
    padding: 0 15px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.7em;
    font-weight: bold;
    font-style: italic;
  }
  
`;

export const Botao = styled.div`
  margin-top: 15px;
  align-self: center;
  text-align: center;
  width: 100%;
`;

export const Label = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
  background: ${props => props.color};
`;