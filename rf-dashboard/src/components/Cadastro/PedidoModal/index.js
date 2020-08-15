import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
// import { Form } from '@unform/web'
import * as Yup from 'yup'

import {
  Container,
  BoxTitulo,
  Texto,
  RLeft,
  RRight,
  Botao,
  Grid as GridModal,
  Blank,
} from '../CardUsuario/styles'

import { Form } from './styles'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { FaIcon } from '../../Icone'

import "./modal.css"

import { Grid, Row, Col } from 'react-flexbox-grid'

import {
  Box,
  InputAdornment,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  withStyles,
} from '@material-ui/core'

import Input from '../../Forms/Input'

const PedidoModal = ({ isShowPedido, hide, tipo, pedidoId }) => {

  const formRef = useRef(null)

  // const [initialValues, setInitialValues] = useState({})
  // const [value, setValue] = useState(0)
  // const [disableEdit, setDisableEdit] = useState(false)
  // const [modo, setModo] = useState('')

  // const required = value => (value ? undefined : '* Obrigatório!')

  async function handleSubmit (data, { reset }) {
    try {
      
      const schema = Yup.object().shape({
        pedido: Yup.string().required('O pedido é obrigatório'),
        // email: Yup.string()
        //   .email('Digite um email válido')
        //   .required('O email é obrigatório')
        //   .min(3, 'No mínimo 3 caracteres'),
      })

      await schema.validate(data, {
        abortEarly: false,
      })
      
      console.log('**** data', data) //, formRef.current)
          
      formRef.current.setErrors({})
      reset()
      
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {}

        err.inner.forEach(error => {
          errorMessages[error.path] = error.message
        })

        formRef.current.setErrors(errorMessages)
      }
      console.log('**** err', err, formRef.current)
    }
  }

  if (isShowPedido) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal">
            <Container>
              <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <GridModal mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      CADASTRO DO PEDIDO
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                    <Tooltip title="Fechar Janela">
                      <Botao onClick={hide}><FaIcon icon='GiExitDoor' size={20} /> </Botao>
                    </Tooltip>
                  </RRight>
                </GridModal>
              </BoxTitulo>

              <Form ref={formRef} onSubmit={handleSubmit}>
                <Input name="pedido" />
                <button type="submit">Enviar</button>
              </Form>

              <BoxTitulo height={24} mt={10}>
                <Texto
                  size={22} height={24} italic={true} bold={700} font='Arial'>
                </Texto>
              </BoxTitulo>
            </Container>
          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default PedidoModal