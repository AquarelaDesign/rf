import styled from 'styled-components';

export const Container = styled.div`
  width: '100%';
  height: 35px;
  padding: 0 20px;
  background: #225378;
  color: #FFF;
  display: flex;
  align-items: center;
`;

export const Titulo = styled.div`
  width: 100%;
  font-size: 24px;
  font-weight: 500;
  text-align: right;
`;

export const Usuario = styled.div`
  width: 100%;
  font-size: 18px;
  font-weight: 300;
  text-align: left;
`;

export const Filtros = styled(Container)`
  background: #0078D7;
`;

export const Menus = styled(Container)`
  background: #2699F8;
`;
