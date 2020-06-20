import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Container, BoxTitulo, Item, Grid, Texto, Box } from './styles'

import { msgerror } from '../../../globais'
import api from '../../../services/rf'

const Usuario = ({ usuario_id }) => {
  const [usuario, setUsuario] = useState({})

  useEffect(() => {
    try {
      if (usuario_id !== null) {
        api.post(`/usuarios/${usuario_id}`, {})
          .then(response => {
            console.log('*** Usuario', response)
            setUsuario(response.data)
          }).catch((error) => {
            if (error.response) {
              console.error('*** u-1.1', error)
            } else if (error.request) {
              console.error('*** u-1.2', error)
            } else {
              console.error('*** u-1.3')
            }
          })
      }
    } catch (error) {
      console.log('*** error', error)
      const { response } = error
      if (response !== undefined) {
        toast(response.status !== 401 
          ? response.data[0].message 
          : msgerror, 
          {type: 'error'})
      } else {
        toast(error, { type: 'error' })
      }
    }
  }, [usuario_id])

  return (
    <Container>
      <BoxTitulo size={20}>
        <Texto>CADASTRO DE USUÁRIOS</Texto>
        <Texto bgcolor='#90D284' size={12} height={20}>botões</Texto>
      </BoxTitulo>
    </Container>
  );
}

export default Usuario