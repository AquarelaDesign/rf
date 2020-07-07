import styled from 'styled-components'

export const Div = styled.div`
  display: flex;
  background-color: '#0078D7';
  align-items: center;
  margin: 0;
  height: 100%;
  width: 100%;
  flex-direction: row;
  flex-grow: 3;
`;

export const Topo = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  flex-direction: column;
  align-items: center;
  background-color: #225378;
  top: 0px;
  border-radius: 0px;
  position: absolute;
`;

export const Rodape = styled.div`
  display: flex;
  width: 100%;
  height: 150px;
  flex-direction: row;
  flex-grow: 3;
  justify-content: space-between;
  align-items: stretch;
  background-color: #225378;
  margin-bottom: 0px;
  border-radius: 0px;
  position: absolute;
  bottom: 0px; 
  line-height: 1.6;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.9em;
`;

export const RTitulo = styled.div`
  float: left;
  width: 30%;
  text-align: right;
  font-weight: bold;
  padding: 25px 15px;
`;

export const RTexto = styled.div`
  float: right;
  width: 70%;
  padding: 15px;
`;

export const RLeft = styled.div`
  width: 33%;
  height: 100%;
  float: left;
  padding: 20px;
  color: #FFFFFF;
`;

export const RCenter = styled.div`
  width: 34%;
  height: 100%;
  float: none;
  padding: 20px;
  color: #FFFFFF;
`;

export const RRight = styled.div`
  width: 33%;
  height: 100%;
  float: right;
  padding: 20px;
  color: #FFFFFF;
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

export const CLeft = styled.div`
  width: 70%;
  height: 100%;
  float: left;
  padding: 20px;
  /* color: #FFFFFF; */
`;

export const CRight = styled.div`
  width: 30%;
  height: 100%;
  float: right;
  padding: 20px;
  /* color: #FFFFFF; */
`;

