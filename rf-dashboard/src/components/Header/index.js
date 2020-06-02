import React from 'react';

import { Container, Filtros, Menus, Titulo } from './styles';

export default function Header() {
  return (
    <>
      <Container>
        <Titulo>Arena Transautos</Titulo>
      </Container>
      <Filtros></Filtros>
      <Menus></Menus>
    </>
  );
}
