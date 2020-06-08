import React from 'react'
import { Image } from 'react-bootstrap'

import { Container, Menus, Titulo } from './styles'
import Filter from '../Filter'
import { FaIcon } from '../Icone'
import logo from '../../assets/arenaLog.png'

export default function Header() {
  return (
    <>
      <Container>
        <Titulo>Arena Transautos</Titulo> 
        <FaIcon icon='FaDiscourse' size={16} /> 
        <FaIcon icon='FaBell' size={16} /> 
        <Image id="logo" src={logo} alt="" style={{marginTop: 0, height: 30}} />
      </Container>
      <Filter />
      <Menus></Menus>
    </>
  )
}
