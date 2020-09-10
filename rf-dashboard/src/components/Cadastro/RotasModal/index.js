/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  Container,
  BoxTitulo,
  Texto,
  Botao,
  RLeft,
  RRight,
  Blank,
} from '../CardUsuario/styles'
import { makeStyles } from '@material-ui/core/styles'

import { Tooltip, withStyles, MenuItem } from '@material-ui/core'
import { FaIcon } from '../../Icone'

import { Grid, Row, Col } from 'react-flexbox-grid'

import { Form } from '../../Forms/Form'
import Input from '../../Forms/Input'
import * as Yup from 'yup'

import "./modal.css"
import api from '../../../services/rf'

const useStyles = makeStyles((theme) => ({
  botoes: {
    position: 'absolute',
    top: 12,
    right: 5,
  },
}))

const VeiculosModal = ({ isShowVeiculos, hide, pedidoID, veiculoID, tipo, disabled, callback }) => {
  const formRef = useRef(null)
  const classes = useStyles()

  const [values, setValues] = useState([])
  const [disableEdit, setDisableEdit] = useState(disabled)

  useEffect(() => {
    const buscaVeiculo = async () => {
      await api
        .get(`/veiculos/${veiculoID}`)
        .then(response => {
          const { data } = response
          setValues(data)
          console.log('**** buscaVeiculo', data)
        })
        .catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('*** error.data', data.message)
            }
          } else if (error.request) {
            toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }

    // console.log('**** DocsModal', veiculoID, tipo)
    // console.log('**** disableEdit', disableEdit)
    // console.log('**** disabled', disabled)
    if (veiculoID && veiculoID > 0 && tipo === 'E') {
      setDisableEdit(false)
      buscaVeiculo()
    } else if (tipo === 'N') {
      setDisableEdit(false)
      var newData = {
        pedido_id: pedidoID,
        placachassi: "",
        modelo: "",
        estado: "",
        ano: null,
        valor: null,
        fipe: "",
      }
      setValues(newData)
    } else if (tipo === 'D') {
      setDisableEdit(true)
      if (veiculoID && veiculoID > 0) {
        buscaVeiculo()
      }
    }

  }, [veiculoID, pedidoID, tipo])

  async function handleSubmit (data, { reset }) {
    try {
      
      const schema = Yup.object().shape({
        placachassi: Yup.string().required('A Placa/Chassi é obrigatória!'),
        // email: Yup.string()
        //   .email('Digite um email válido')
        //   .required('O email é obrigatório')
        //   .min(3, 'No mínimo 3 caracteres'),
      })

      await schema.validate(data, {
        abortEarly: false,
      })
      
      formRef.current.setErrors({})

      console.log('**** Salvar Dados Veiculos', data)
      
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {}

        err.inner.forEach(error => {
          errorMessages[error.path] = error.message
        })

        formRef.current.setErrors(errorMessages)
      }
    }
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const fechar = async () => {
    await sleep(1000)

    if (callback) {
      callback()
      hide()
    }
  }

  // const required = value => (value ? undefined : '* Obrigatório!')

  if (isShowVeiculos) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal-box">
            <Container>
              <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Grid mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      {values.placachassi ? `Dados do Veículo [${values.placachassi}]` : 'Dados do Veículo'}
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                    {/* <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank> */}
                    <Tooltip title="Fechar Janela">
                      <Botao onClick={fechar}><FaIcon icon='GiExitDoor' size={20} /></Botao>
                    </Tooltip>
                  </RRight>
                </Grid>
              </BoxTitulo>

              <Form ref={formRef} onSubmit={handleSubmit} height={'490px'} width={'100%'} >
                <BoxTitulo bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                  <Grid>
                    <Row style={{ height: '54px', marginTop: '15px' }}>
                      <Col xs={2}>
                        <Input 
                          type="text" 
                          onFocus onBlur 
                          name="placachassi" 
                          label="Placa/Chassi"
                          value={values.placachassi}
                          // disabled={true}
                        />
                      </Col>
                    </Row>
                  </Grid>
                </BoxTitulo>
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

export default VeiculosModal