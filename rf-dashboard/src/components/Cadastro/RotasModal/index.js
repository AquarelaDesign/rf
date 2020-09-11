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
import Select from '../../Forms/Select.tsx'
import * as Yup from 'yup'

import "./modal.css"
import api from '../../../services/rf'
import Axios from 'axios'

import GridUsuariosModal from '../GridUsuariosModal'
import useModalUsuarios from '../GridUsuariosModal/useModal'

const useStyles = makeStyles((theme) => ({
  botoes: {
    position: 'absolute',
    top: 12,
    right: 5,
  },
}))

const tipos = [
  { value: 'C', label: 'Coleta' },
  { value: 'E', label: 'Entrega' },
]

const RotasModal = ({ isShowRotas, hide, pedidoID, rotaID, tipo, disabled, callback }) => {
  const formRef = useRef(null)
  const classes = useStyles()

  const [values, setValues] = useState([])
  const [disableEdit, setDisableEdit] = useState(disabled)

  const { isShowing, toggleGridUsuarios } = useModalUsuarios()

  useEffect(() => {
    const buscaRota = async () => {
      await api
        .get(`/rotas/${rotaID}`)
        .then(response => {
          const { data } = response
          setValues(data)
          
          // console.log('**** buscaRota', data)

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
              console.log('**** error.data', data.message)
            }
          } else if (error.request) {
            toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }

    // console.log('**** RotasModal', rotaID, tipo)
    // console.log('**** disableEdit', disableEdit)
    // console.log('**** disabled', disabled)

    if (rotaID && rotaID > 0 && tipo === 'E') {
      setDisableEdit(false)
      buscaRota()
    } else if (tipo === 'N') {
      setDisableEdit(false)
      var newData = {
        pedido_id: pedidoID,
        tipo: "",
        nome: "",
        cpfcnpj: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        pais: "",
        cep: "",
        contato: "",
        celular: "",
        telefone: "",
        whats: "",
        email: "",
        motorista_id: null,
        rota_relacionada: null,
      }
      setValues(newData)
    } else if (tipo === 'D') {
      setDisableEdit(true)
      if (rotaID && rotaID > 0) {
        buscaRota()
      }
    }

  }, [rotaID, pedidoID, tipo])

  const findCliente = () => {
    toggleGridUsuarios()
  }

  const callBackCliente = (e) => {
    buscaCliente(e)
  }

  const buscaCliente = async (clienteID) => {
    if (clienteID) {
      await api
        .get(`/usuarios/${clienteID}`)
        .then(response => {
          const { data } = response

          // console.log('**** buscaCliente', data)
          setValues(data)

          formRef.current.setFieldValue('cpfcnpj', data.cpfcnpj)
          formRef.current.setFieldValue('nome', data.nome)
          formRef.current.setFieldValue('logradouro', data.logradouro)
          formRef.current.setFieldValue('numero', data.numero)
          formRef.current.setFieldValue('complemento', data.complemento)
          formRef.current.setFieldValue('bairro', data.bairro)
          formRef.current.setFieldValue('cidade', data.cidade)
          formRef.current.setFieldValue('uf', data.uf)
          formRef.current.setFieldValue('pais', data.pais)
          formRef.current.setFieldValue('cep', data.cep)
          formRef.current.setFieldValue('contato', data.contato)
          formRef.current.setFieldValue('celular', data.celular)
          formRef.current.setFieldValue('telefone', data.telefone)
          formRef.current.setFieldValue('whats', data.whats)
          formRef.current.setFieldValue('email', data.email)

          setValues({ 
            ...values, 
            cpfcnpj: data.cpfcnpj,
            nome: data.nome,
            logradouro: data.logradouro,
            numero: data.numero,
            complemento: data.complemento,
            bairro: data.bairro,
            cidade: data.cidade,
            uf: data.uf,
            pais: data.pais,
            cep: data.cep,
            contato: data.contato,
            celular: data.celular,
            telefone: data.telefone,
            whats: data.whats,
            email: data.email,
          })

        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** data', data)
            }
          } else if (error.request) {
            toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  async function handleSubmit (data, { reset }) {
    try {
      
      const schema = Yup.object().shape({
        cpfcnpj: Yup.string().required('O CNPJ é obrigatório!'),
        // email: Yup.string()
        //   .email('Digite um email válido')
        //   .required('O email é obrigatório')
        //   .min(3, 'No mínimo 3 caracteres'),
      })

      await schema.validate(data, {
        abortEarly: false,
      })
      
      formRef.current.setErrors({})

      console.log('**** Salvar Dados Rotas', data)
      
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
  console.log('**** Values', values)

  if (isShowRotas) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal-rotas">
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

              <Form 
                ref={formRef} 
                onSubmit={handleSubmit} 
                initialData={values}
                height={'370px'} 
                width={'100%'} 
              >
                <BoxTitulo bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                  <Grid>
                    <Row style={{ height: '54px', marginTop: '15px' }}>
                      <Col xs={6}>
                        <Select 
                          // onFocus onBlur 
                          name="tipo" 
                          // label="Tipo"
                          // value={values.tipo}
                          // defaultVal={values.tipo}
                          options={tipos}
                          // onChange={e => setValues({ ...values, tipo: e.target.value })} 
                          disabled={disableEdit}
                        />
                      </Col>
                      <Col xs={6}>
                        <Input 
                          type="text" 
                          onFocus onBlur 
                          name="cpfcnpj" 
                          label="CPF/CNPJ"
                          icon={true} 
                          callSearch={findCliente}
                          height='40px'
                          // value={values.cpfcnpj}
                          // onChange={e => setValues({ ...values, cpfcnpj: e.target.value })} 
                          disabled={disableEdit}
                        />
                      </Col>
                    </Row>
                    <Row style={{ height: '54px', marginTop: '15px' }}>
                      <Col xs={12}>
                        <Input
                          type="text" 
                          onFocus onBlur 
                          name="nome" 
                          label="Nome" 
                          height='40px'
                          // value={values.nome} 
                          disabled={true}
                        />
                      </Col>
                    </Row>
                    <Row style={{ height: '54px', marginTop: '15px' }}>
                      <Col xs={3}>
                        <Input 
                          type="text" 
                          onFocus onBlur 
                          name="contato" 
                          label="Contato" 
                          height='40px'
                          // value={values.contato}
                          disabled={true}
                        />
                      </Col>
                      <Col xs={5}>
                        <Input
                          type="text" 
                          onFocus onBlur 
                          name="email" 
                          label="E-mail" 
                          height='40px'
                          // value={values.email} 
                          disabled={true}
                        />
                      </Col>
                      <Col xs={2}>
                        <Input
                          type="text" 
                          onFocus onBlur 
                          name="celular" 
                          label="Celular" 
                          height='40px'
                          // value={values.celular} 
                          disabled={true}
                        />
                      </Col>
                      <Col xs={2}>
                        <Input
                          type="text" 
                          onFocus onBlur 
                          name="whats" 
                          label="WhatsApp" 
                          height='40px'
                          // value={values.whats} 
                          disabled={true}
                        />
                      </Col>
                    </Row>
                    <Row style={{ height: '54px', marginTop: '15px' }}>
                      <Col xs={6}>
                        <Input 
                          type="text" 
                          onFocus onBlur 
                          name="logradouro" 
                          label="Endereço" 
                          height='40px'
                          // value={values.logradouro}
                          disabled={true}
                        />
                      </Col>
                      <Col xs={2}>
                        <Input
                          type="text" 
                          onFocus onBlur 
                          name="numero" 
                          label="Número" 
                          height='40px'
                          // value={values.numero} 
                          disabled={true}
                        />
                      </Col>
                      <Col xs={4}>
                        <Input
                          type="text" 
                          onFocus onBlur 
                          name="complemento" 
                          label="Complemento" 
                          height='40px'
                          // value={values.complemento} 
                          disabled={true}
                        />
                      </Col>
                    </Row>
                    <Row style={{ height: '54px', marginTop: '15px' }}>
                      <Col xs={3}>
                        <Input 
                          type="text" 
                          onFocus onBlur 
                          name="bairro" 
                          label="Bairro" 
                          height='40px'
                          // value={values.bairro}
                          disabled={true}
                        />
                      </Col>
                      <Col xs={3}>
                        <Input
                          type="text" 
                          onFocus onBlur 
                          name="cidade" 
                          label="Cidade" 
                          height='40px'
                          // value={values.cidade} 
                          disabled={true}
                        />
                      </Col>
                      <Col xs={1}>
                        <Input
                          type="text" 
                          onFocus onBlur 
                          name="uf" 
                          label="UF" 
                          height='40px'
                          // value={values.uf} 
                          disabled={true}
                        />
                      </Col>
                      <Col xs={2}>
                        <Input
                          type="text" 
                          onFocus onBlur 
                          name="cep" 
                          label="CEP" 
                          height='40px'
                          // value={values.cep} 
                          disabled={true}
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
            <GridUsuariosModal 
              isShowing={isShowing}
              hide={toggleGridUsuarios}
              tipoConsulta='C'
              callFind={callBackCliente}
            />
          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default RotasModal