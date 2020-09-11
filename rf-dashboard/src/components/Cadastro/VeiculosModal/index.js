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
import Select from '../../Forms/Select'
import * as Yup from 'yup'

import "./modal.css"
import api from '../../../services/rf'
import Axios from 'axios'

const fipeapi = 'https://fipeapi.appspot.com/api/1/'

const useStyles = makeStyles((theme) => ({
  botoes: {
    position: 'absolute',
    top: 12,
    right: 5,
  },
}))

const fipeTipo = [
  { value: 'carros', label: 'Carros' },
  { value: 'motos', label: 'Motos' },
  { value: 'caminhoes', label: 'Caminhões' },
]

const estado = [
  { value: 'Funcionando', label: 'Funcionando' },
  { value: 'Pane', label: 'Pane' },
  { value: 'Sinistrado', label: 'Sinistrado' },
]

const VeiculosModal = ({ isShowVeiculos, hide, pedidoID, veiculoID, tipo, disabled, callback }) => {
  const formRef = useRef(null)
  const classes = useStyles()

  const [values, setValues] = useState([])
  const [marcas, setMarcas] = useState([])
  const [modelos, setModelos] = useState([])
  const [anos, setAnos] = useState([])
  const [fipe, setFipe] = useState([])
  const [disableEdit, setDisableEdit] = useState(disabled)
  const [disableMarca, setDisableMarca] = useState(true)
  const [disableModelo, setDisableModelo] = useState(true)
  const [disableAno, setDisableAno] = useState(true)

  useEffect(() => {
    const buscaVeiculo = async () => {
      await api
        .get(`/veiculos/${veiculoID}`)
        .then(response => {
          const { data } = response
          setValues(data)
          // console.log('**** buscaVeiculo', data)
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
        fipe_tipo: null,
        fipe_marca_id: null,
        fipe_modelo_id: null,
        fipe_ano_id: null,
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

  const buscaMarcas = async (dados) => {
    setValues({ ...values, fipe_tipo: dados.value })
    await Axios
      .get(`${fipeapi}/${dados.value}/marcas.json`)
      .then(response => {
        const { data } = response

        let ma = []
        data.map( m=>{
          ma.push({
            value: m.id, 
            label: m.fipe_name,
          })
        })
        setMarcas(ma)
        if (!disableEdit){
          setDisableMarca(false)
        }
        // console.log('**** buscaMarcas', ma)
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

  const buscaModelos = async (dados) => {
    setValues({ ...values, fipe_marca_id: dados.value })
    await Axios
      .get(`${fipeapi}/${values.fipe_tipo}/veiculos/${dados.value}.json`)
      .then(response => {
        const { data } = response

        let ma = []
        data.map( m=>{
          ma.push({
            value: m.id, 
            label: m.fipe_name,
          })
        })
        setModelos(ma)
        if (!disableEdit){
          setDisableModelo(false)
        }
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
  
  const buscaAnos = async (dados) => {
    setValues({ ...values, fipe_modelo_id: dados.value })
    // https://fipeapi.appspot.com/api/1/carros/veiculo/21/4828.json
    // console.log('**** buscaAnos', `${fipeapi}${values.fipe_tipo}/veiculo/${values.fipe_marca_id}/${dados.value}.json`)
    
    await Axios
      .get(`${fipeapi}${values.fipe_tipo}/veiculo/${values.fipe_marca_id}/${dados.value}.json`)
      .then(response => {
        const { data } = response

        let ma = []
        data.map( m=>{
          ma.push({
            value: m.id, 
            label: m.name,
          })
        })
        setAnos(ma)
        if (!disableEdit){
          setDisableAno(false)
        }
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
  
  const buscaFipe = async (dados) => {
    setValues({ ...values, fipe_ano_id: dados.value })
    // https://fipeapi.appspot.com/api/1/carros/veiculo/21/4828/2013-1.json
    // console.log('**** buscaFipe', `${fipeapi}${values.fipe_tipo}/veiculo/${values.fipe_marca_id}/${values.fipe_modelo_id}/${dados.value}.json`)
    
    await Axios
      .get(`${fipeapi}${values.fipe_tipo}/veiculo/${values.fipe_marca_id}/${values.fipe_modelo_id}/${dados.value}.json`)
      .then(response => {
        const { data } = response

        setValues({ ...values, fipe: data.fipe_codigo })
        setValues({ ...values, valor: data.preco })
        console.log('**** buscaFipe', data)
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

              <Form ref={formRef} onSubmit={handleSubmit} height={'290px'} width={'100%'} >
                <BoxTitulo bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                  <Grid>
                    <Row style={{ height: '54px', marginTop: '15px' }}>
                      <Col xs={6}>
                        <Input 
                          type="text" 
                          onFocus onBlur 
                          name="placachassi" 
                          label="Placa/Chassi"
                          height='40px'
                          value={values.placachassi}
                          onChange={e => setValues({ ...values, placachassi: e.target.value })} 
                          disabled={disableEdit}
                        />
                      </Col>
                      <Col xs={6}>
                        <Select 
                          onFocus onBlur 
                          name="estado" 
                          label="Estado"
                          defaultValue={values.estado}
                          options={estado}
                          // onChange={e => setValues({ ...values, estado: e.target.value })} 
                          disabled={disableEdit}
                        />
                      </Col>
                    </Row>
                    <Row style={{ height: '54px', marginTop: '15px' }}>
                      <Col xs={6}>
                        <Select 
                          onFocus onBlur 
                          name="fipe_tipo" 
                          label="Tipo"
                          defaultValue={values.fipe_tipo}
                          onChange={buscaMarcas}
                          options={fipeTipo}
                          disabled={disableEdit}
                        />
                      </Col>
                      <Col xs={6}>
                        <Select 
                          onFocus onBlur 
                          name="fipe_marca_id" 
                          label="Marca"
                          defaultValue={values.fipe_marca_id}
                          onChange={buscaModelos}
                          options={marcas}
                          disabled={disableMarca}
                        />
                      </Col>
                    </Row>
                    <Row style={{ height: '54px', marginTop: '15px' }}>
                      <Col xs={6}>
                        <Select 
                          onFocus onBlur 
                          name="fipe_modelo_id" 
                          label="Modelo"
                          defaultValue={values.fipe_modelo_id}
                          onChange={buscaAnos}
                          options={modelos}
                          disabled={disableModelo}
                        />
                      </Col>
                      <Col xs={6}>
                        <Select 
                          onFocus onBlur 
                          name="fipe_ano_id" 
                          label="Ano"
                          defaultValue={values.fipe_ano_id}
                          onChange={buscaFipe}
                          options={anos}
                          disabled={disableAno}
                        />
                      </Col>
                    </Row>
                    <Row style={{ height: '54px', marginTop: '15px' }}>
                      <Col xs={6}>
                        <Input 
                          type="text" 
                          onFocus onBlur 
                          name="fipe" 
                          label="Código FIPE"
                          height='40px'
                          value={values.fipe}
                          onChange={e => setValues({ ...values, fipe: e.target.value })} 
                          disabled={disableEdit}
                        />
                      </Col>
                      <Col xs={6}>
                        <Input 
                          type="text" 
                          onFocus onBlur 
                          name="valor" 
                          label="Valor"
                          height='40px'
                          value={values.valor}
                          onChange={e => setValues({ ...values, valor: e.target.value })} 
                          disabled={disableEdit}
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