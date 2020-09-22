import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
// import PropTypes from 'prop-types'

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

import {
  TextField,
} from 'final-form-material-ui'

// import MaskedInput from 'react-text-mask'

// import { makeStyles } from '@material-ui/core/styles'

import { 
  Tooltip, 
  withStyles, 
  MenuItem,
  // InputAdornment,
} from '@material-ui/core'

import { FaIcon } from '../../Icone'

import { Grid, Row, Col } from 'react-flexbox-grid'

import { Form, Field } from 'react-final-form'
// import DatePicker from '../../datepicker'
// import { values } from 'lodash'
// import { AiOutlineSearch } from 'react-icons/ai'

import "./modal.css"
import api from '../../../services/rf'
import Axios from 'axios'

import moment from "moment"
import CurrencyTextField from '../../Forms/CurrencyTextField'

const fipeapi = 'https://fipeapi.appspot.com/api/1/'

const CssTextField = withStyles({
  root: {
    '& > *': {
      fontFamily: ['Montserrat', 'sans Serif'],
      fontSize: 14,
    },
    '& label.Mui-focused': {
      color: '#0031FF',
    }, 
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#2699F8',
      },
      '&:hover fieldset': {
        borderColor: '#0031FF',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#225378',
      },
    },
    '& .MuiFormHelperText-root': {
      margin: '1px',
      justifyContent: 'left',
      height: '7px',
    },
    '& .MuiFormHelperText-contained': {
      justifyContent: 'left',
    },
  },

})(TextField)

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

const VeiculosModal = ({ isShowVeiculos, hide, pedidoID, veiculoID, tipoCad, disableEdit, callback }) => {
  const [initialValues, setInitialValues] = useState([])

  const [marcas, setMarcas] = useState([])
  const [modelos, setModelos] = useState([])
  const [anos, setAnos] = useState([])

  const [disableMarca, setDisableMarca] = useState(true)
  const [disableModelo, setDisableModelo] = useState(true)
  const [disableAno, setDisableAno] = useState(true)
  
  let submit

  useEffect(() => {
    // console.log('**** VeiculosModal.buscaVeiculo')
    const buscaVeiculo = async () => {
      await api
        .get(`/veiculos/${veiculoID}`)
        .then(response => {
          const { data } = response
          // console.log('**** VeiculosModal.buscaVeiculo.data', data)
          setInitialValues(data)
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
              console.log('**** VeiculosModal.buscaVeiculo.error.data', data)
            }
          } else if (error.request) {
            console.log('**** VeiculosModal.buscaVeiculo.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }

    // console.log('**** VeiculosModal', veiculoID, tipoCad)

    if (veiculoID && veiculoID > 0 && tipoCad === 'E') {
      buscaVeiculo()
    } else if (tipoCad === 'N') {
      var newData = {
        pedido_id: pedidoID,
        placachassi: "",
        modelo: "",
        estado: "",
        ano: null,
        valor: null,
        fipetipo: null,
        fipemarcaid: null,
        fipemodeloid: null,
        fipeano: null,
        fipe: "",
      }
      setInitialValues(newData)
    } else if (tipoCad === 'D') {
      if (veiculoID && veiculoID > 0) {
        buscaVeiculo()
      }
    }

  }, [veiculoID, pedidoID, tipoCad])

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const buscaMarcas = async (dados) => {
    
    console.log('**** VeiculosModal.buscaMarcas', dados)
    
    if (!dados) {
      return
    }
    
    setInitialValues({ ...initialValues, fipetipo: dados })
    
    await Axios
      .get(`${fipeapi}/${dados}/marcas.json`)
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
        setDisableMarca(false)
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
            console.log('**** VeiculosModal.buscaMarcas.error.data', data)
          }
        } else if (error.request) {
          console.log('**** VeiculosModal.buscaMarcas.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const buscaModelos = async (dados) => {
    // console.log('**** VeiculosModal.buscaModelos', dados)
    if (!dados) {
      return
    }
    
    setInitialValues({ ...initialValues, fipemarcaid: dados })
    
    await Axios
      .get(`${fipeapi}/${initialValues.fipetipo}/veiculos/${dados}.json`)
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
        setDisableModelo(false)
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
            console.log('**** VeiculosModal.buscaModelos.error.data', data)
          }
        } else if (error.request) {
          console.log('**** VeiculosModal.buscaModelos.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
    
  }
  
  const buscaAnos = async (dados) => {
    // console.log('**** VeiculosModal.buscaAnos', dados)
    if (!dados) {
      return
    }
    
    setInitialValues({ ...initialValues, fipemodeloid: dados })

    await Axios
      .get(`${fipeapi}${initialValues.fipetipo}/veiculo/${initialValues.fipemarcaid}/${dados}.json`)
      .then(response => {
        const { data } = response
        // console.log('**** VeiculosModal.buscaAnos.data', data)
        let ma = []
        data.map( m=>{
          ma.push({
            id: m.id, 
            value: m.id, 
            label: m.name,
          })
        })
        setAnos(ma)
        setDisableAno(false)
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
            console.log('**** VeiculosModal.buscaAnos.error.data', data)
          }
        } else if (error.request) {
          console.log('**** VeiculosModal.buscaAnos.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }
  
  const buscaFipe = async (dados) => {
    // console.log('**** VeiculosModal.buscaFipe', dados)
    if (!dados) {
      return
    }

    let anodes = anos.find(opt => opt.value === dados.value)
    let ano = anodes.label.substring(0, 4)

    if (ano.toLocaleLowerCase() === 'zero') {
      ano = moment().format('YYYY')
    }
    // console.log('**** VeiculosModal.buscaFipe.ano', ano)
    await Axios
      .get(`${fipeapi}${initialValues.fipetipo}/veiculo/${initialValues.fipemarcaid}/${initialValues.fipemodeloid}/${dados.value}.json`)
      .then(response => {
        const { data } = response

        let valor = data.preco.replace('R$ ','').replace('.','').replace(',','.')
        // let modelo = `${data.marca} ${data.name} ${data.ano_modelo} ${data.combustivel} (Tabela: ${data.referencia})`
        let modelo = `${data.marca} ${data.name} ${anodes.label} (Tabela: ${data.referencia})`

        setInitialValues({ 
          ...initialValues,
          ano: parseInt(ano),
          fipeano: anodes.value,
          fipe: data.fipe_codigo, 
          valor: valor, 
          modelo: modelo.toLocaleUpperCase() 
        })
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
            console.log('**** VeiculosModal.buscaFipe.error.data', data)
          }
        } else if (error.request) {
          console.log('**** VeiculosModal.buscaFipe.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
    
  }
  
  const fechar = async (e) => {
    // console.log('**** VeiculosModal.fechar', e)
    if (callback) {
      // await sleep(1000)
      callback(typeof e === 'object' ? false : e)
      hide()
    }
  }

  async function onSubmit (values) {
    // console.log('**** VeiculosModal.onSubmit-values', values)

    let newValues = {}

    for (var [key, value] of Object.entries(values)) {
      newValues[key] = value
    }

    let val = values['valor'].replace('.', '')
        val = val.replace(',', '.')
    newValues['valor'] = val

    let apiParams = {}

    if (veiculoID !== null && tipoCad === 'E') {
      apiParams = {
        method: 'put',
        url: `/veiculos/${veiculoID}`,
        data: JSON.stringify(newValues),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    } else {
      apiParams = {
        method: 'post',
        url: `/veiculos`,
        data: JSON.stringify(newValues),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    }
    // console.log('**** VeiculosModal.onSubmit-apiParams', apiParams)

    const placa = values.placachassi

    await api(apiParams, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    .then(response => {
      const { data } = response
      if (response.status !== 200) {
        toast(`Ocorreu um erro no processamento da placa [${placa}]!`,
          { type: 'error' })
        return
      }
      
      setInitialValues(data)
      fechar(true)

    }).catch((error) => {
      if (error.response) {
        const { data } = error.response
        try {
          data.map(mensagem => {
            toast(mensagem.message, { type: 'error' })
          })
        }
        catch (e) {
          console.log('**** VeiculosModal.onSubmit.error.data', data)
        }
      } else if (error.request) {
        console.log('**** VeiculosModal.onSubmit.error', error)
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })

  }

  const required = value => (value ? undefined : '* Obrigatório!')

  if (isShowVeiculos) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal-veiculo">
            <Container>
              <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Grid mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      {initialValues.placachassi ? `Dados do Veículo [${initialValues.placachassi}]` : 'Dados do Veículo'}
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                    { disableEdit ?
                      <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                    :
                      <Tooltip title="Salvar">
                        <Botao onClick={event=>{submit(event)}}><FaIcon icon='Save' size={20} /></Botao>
                      </Tooltip>
                    }
                    <Tooltip title="Fechar Janela">
                      <Botao onClick={fechar}><FaIcon icon='GiExitDoor' size={20} /></Botao>
                    </Tooltip>
                  </RRight>
                </Grid>
              </BoxTitulo>

              <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={required} 
                height={'290px'} width={'100%'}
                mutators={{
                  _setValue: ([field, value], state, { changeValue }) => {
                    changeValue(state, field, () => value)
                  },
                  get setValue() {
                    return this._setValue
                  },
                  set setValue(value) {
                    this._setValue = value
                  },
                }}
                render={({
                  handleSubmit,
                  form,
                  submitting,
                  pristine,
                  values,
                  props,
                }) => {
                  window.setFormValue = form.mutators.setValue
                  submit = handleSubmit

                  return (
                    <form onSubmit={handleSubmit} noValidate>

                      <BoxTitulo bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                        <Grid>
                          <Row style={{ height: '54px', marginTop: '15px' }}>
                            <Col xs={6}>
                              <Field
                                disabled={disableEdit}
                                name="placachassi"
                                component={CssTextField}
                                type="text"
                                label="Placa/Chassi"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                              />
                            </Col>
                            <Col xs={6}>
                              <Field
                                disabled={disableEdit}
                                name="estado"
                                component={CssTextField}
                                type="select"
                                label="Estado"
                                variant="outlined"
                                fullWidth
                                select
                                size="small"
                                margin="dense"
                              >
                                {estado.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Col>
                          </Row>
                          <Row style={{ height: '54px', marginTop: '15px' }}>
                            <Col xs={6}>
                              <Field
                                disabled={disableEdit}
                                name="fipetipo"
                                component={CssTextField}
                                type="select"
                                label="Tipo"
                                variant="outlined"
                                fullWidth
                                select
                                size="small"
                                margin="dense"
                                onClick={e => buscaMarcas(e.target.value)}
                              >
                                {fipeTipo.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Col>
                            <Col xs={6}>
                              <Field
                                disabled={disableMarca}
                                name="fipemarcaid"
                                component={CssTextField}
                                type="select"
                                label="Marca"
                                variant="outlined"
                                fullWidth
                                select
                                size="small"
                                margin="dense"
                                onClick={e => buscaModelos(e.target.value)}
                              >
                                {marcas.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Col>
                          </Row>
                          <Row style={{ height: '54px', marginTop: '15px' }}>
                            <Col xs={6}>
                              <Field
                                disabled={disableModelo}
                                name="fipemodeloid"
                                component={CssTextField}
                                type="select"
                                label="Modelo"
                                variant="outlined"
                                fullWidth
                                select
                                size="small"
                                margin="dense"
                                onClick={e => buscaAnos(e.target.value)}
                              >
                                {modelos.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Col>
                            <Col xs={6}>
                              <Field
                                disabled={disableAno}
                                name="fipeano"
                                component={CssTextField}
                                type="select"
                                label="Ano"
                                variant="outlined"
                                fullWidth
                                select
                                size="small"
                                margin="dense"
                                onClick={e => buscaFipe(e.target)}
                              >
                                {anos.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Col>
                          </Row>
                          <Row style={{ height: '54px', marginTop: '15px' }}>
                            <Col xs={12}>
                              <Field
                                disabled={disableEdit}
                                name="modelo"
                                component={CssTextField}
                                type="text"
                                label="Descrição do Veículo"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                              />
                            </Col>
                          </Row>
                          <Row style={{ height: '54px', marginTop: '15px' }}>
                            <Col xs={2}>
                              <Field
                                disabled={disableEdit}
                                name="ano"
                                component={CssTextField}
                                type="text"
                                label="Ano"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                              />
                            </Col>
                            <Col xs={4}>
                              <Field
                                disabled={disableEdit}
                                name="fipe"
                                component={CssTextField}
                                type="text"
                                label="Código FIPE"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                              />
                            </Col>
                            <Col xs={6}>
                              <Field
                                disabled={disableEdit}
                                name="valor"
                                component={CurrencyTextField}
                                type="text"
                                label="Valor"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                onChange={e => window.setFormValue('valor', e.target.value )}
                              />
                            </Col>
                          </Row>
                        </Grid>
                      </BoxTitulo>
              
                    </form>
                  )
                }}
              />

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