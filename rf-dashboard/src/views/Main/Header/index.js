import React, { useState, useEffect } from 'react'
import { Image } from 'react-bootstrap'

import { Container, Titulo, Usuario } from './styles'
import Filter from '../../../components/Filter'
import Menu from '../Menu'
import { FaIcon } from '../../../components/Icone'
import logo from '../../../assets/arenaLog.png'

import api from '../../../services/rf'

const nomeEmpresa = "Arena Transautos"

export default function Header() {
  const [userID, setUserID] = useState(localStorage.getItem('@rf/userID'))
  const [userDados, setUserDados] = useState({})

  useEffect(() => {
    const buscaUsuario = async () => {
      if (!userID) {
        await sleep(1000)
        setUserID(localStorage.getItem('@rf/userID'))
      } else {
        await api
          .get(`/usuarios/${userID}`)
          .then(response => {
            const { data } = response
            setUserDados(data)
          }).catch((error) => {
            if (error.response) {
              console.error('*** Header-1.1', error)
            } else if (error.request) {
              console.error('*** Header-1.2', error)
            } else {
              console.error('*** Header-1.3')
            }
          })
      }
    }
    buscaUsuario()
  }, [userID])

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  return (
    <>
      <Container>
        <FaIcon icon='Usuario' size={30} /> 
        <Usuario>{userDados.nome}</Usuario>
        <Titulo>{nomeEmpresa}</Titulo> 
        <FaIcon icon='FaDiscourse' size={30} /> 
        <FaIcon icon='FaBell' size={30} /> 
        <Image id="logo" src={logo} alt="" style={{marginTop: 0, height: 30}} />
      </Container>
      <Filter />
      <Menu />
    </>
  )
}
