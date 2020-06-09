import styled from 'styled-components';

export const Container = styled.div`
  padding: 0 5px 8px 5px;
  height: 100%;
  flex: 25%;
  /* top right bottom left */
  margin: -5px 10px 10px 10px;
  border: 1px solid rgba(105, 105, 105, 0.3);
  border-radius: 10px;
  box-shadow: 0 1px 4px 0 rgba(192, 208, 230, 0.8);
  border-top: 35px solid rgba(211, 211, 211, 1);

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 42px;
    margin-top: -40px;

    h2 {
      font-family: Arial, Helvetica, sans-serif;
      font-weight: bold;
      font-size: 1.2em;
      padding: 0 10px;
    }

    button {
      width: 20px;
      height: 20px;
      border-radius: 25px;
      background: #31C417;
      /* background: #90D284; */
      border: 0;
      /* border-color: #31C417; */
      borde
      cursor: pointer;
    }
  }

  ul {
    margin-top: 5px;
  }
`;
