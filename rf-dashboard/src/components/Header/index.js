import React, { useState, useEffect } from 'react'
import { Image } from 'react-bootstrap'

import { Container, Titulo, Usuario } from './styles'
import Filter from '../Filter'
import Menu from '../Menu'
import { FaIcon } from '../Icone'
import logo from '../../assets/arenaLog.png'

import api from '../../services/rf'

export default function Header() {
  const userID = localStorage.getItem('@rf/userID')
  const [userDados, setUserDados] = useState({})

  useEffect(() => {
    if (userID !== null && userID !== undefined) {
      buscaUsuario()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID])

  const buscaUsuario = async () => {
    await api
      .get(`/usuarios/${userID}`)
      .then(response => {
        const { data } = response
        setUserDados(data)
        // console.log('*** data', data)
        // console.log('*** userDados', userDados)
      }).catch((error) => {
        if (error.response) {
          console.error('*** bu-1.1', error)
        } else if (error.request) {
          console.error('*** bu-1.2', error)
        } else {
          console.error('*** bu-1.3')
        }
      })
  }

  return (
    <>
      <Container>
        <FaIcon icon='Usuario' size={30} /> 
        <Usuario>{userDados.nome}</Usuario>
        <Titulo>Arena Transautos</Titulo> 
        <FaIcon icon='FaDiscourse' size={30} /> 
        <FaIcon icon='FaBell' size={30} /> 
        <Image id="logo" src={logo} alt="" style={{marginTop: 0, height: 30}} />
      </Container>
      <Filter />
      <Menu />
    </>
  )
}
