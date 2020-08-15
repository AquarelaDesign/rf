import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 20px;
  width: 100%;
`;

export const TextInput = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  color: ${props => props.inputColor || "#225378"};
  background: #FFFFFF;
  border: 1px solid #225378;
  box-shadow: 0 1px 4px 0 rgba(192, 208, 230, 0.8);
  border-radius: 4px;

  &:hover {
    border: 1px solid #2699F8;
  }

`;
