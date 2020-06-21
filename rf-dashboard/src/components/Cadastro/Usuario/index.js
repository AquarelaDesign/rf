import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Container, BoxTitulo, Texto, Grid, Botao, RLeft, RRight } from './styles'

import { msgerror } from '../../../globais'
import api from '../../../services/rf'

const Usuario = ({ tipo, usuario_id }) => {
  const [usuario, setUsuario] = useState({})
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    try {
      if (usuario_id !== null) {
        api.get(`/usuarios/${usuario_id}`, {})
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
      <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
        <Grid mb={5}>
          <RLeft>
            <Texto 
              size={22} height={24} italic={true} bold={700} font='Arial' 
              mt={3} 
              color='#2699FB' shadow={true}>
                CADASTRO DO USUÁRIO
            </Texto>
          </RLeft>
          <RRight>
            {/* <Botao onClick={onButtonClick}><FaIcon icon='RiSearchLine' size={20} /> </Botao> */}
            {/* <Botao onClick={(e) => onButtonClick('E', e)}><FaIcon icon='FaRegEdit' size={20} /> </Botao> */}
            {/* <Botao onClick={(e) => onButtonClick('N', e)}><FaIcon icon='FcPlus' size={20} /> </Botao> */}
          </RRight>
        </Grid>
      </BoxTitulo>

      <div className="ag-theme-alpine" style={ {height: '92%', width: '100%', borderRadius: '10px'} }>

      </div>

      <BoxTitulo height={24} mt={10}>
        <Texto 
          size={22} height={24} italic={true} bold={700} font='Arial'>
            {mensagem}
        </Texto>
      </BoxTitulo>

    </Container>
  );
}

export default Usuario