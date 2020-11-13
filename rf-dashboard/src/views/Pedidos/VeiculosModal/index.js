import React, { useState, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

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
} from '../../Cadastro/CardUsuario/styles'

import { TextField } from 'final-form-material-ui'

import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { 
  Tooltip, 
  withStyles, 
  MenuItem,
  InputAdornment,
} from '@material-ui/core'

import { Autocomplete, TextField as MuiTextField } from 'mui-rff'

import { FaIcon } from '../../../components/Icone'

import { Grid, Row, Col } from 'react-flexbox-grid'

import { Form, Field } from 'react-final-form'
import { values } from 'lodash'
import { AiOutlineSearch } from 'react-icons/ai'

import "./modal.css"
import api from '../../../services/rf'
import Axios from 'axios'

import moment from "moment"

import estadoVeiculo from '../../../services/json/estadoVeiculo.json'

const fipeapi = 'https://fipeapi.appspot.com/api/1'

/*
"insert into `veiculos` 
(`ano`, `created_at`, `estado`, `fipe`, `modelo`, `pedido_id`, `placachassi`, `updated_at`, `valor`) values 
('2005', '2020-11-09 21:49:16', 'Funcionando', NULL, 'meu carro velho', 29, 'vbf', '2020-11-09 21:49:16', '5.000,') - WARN_DATA_TRUNCATED: Data truncated for column 'valor' at row 1"
*/

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
      '&.Mui-disabled': {
        color: '#666666',
        fontWeight: 500,
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

const CssMuiTextField = withStyles({
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
      '&.Mui-disabled': {
        color: '#666666',
        fontWeight: 500,
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

})(MuiTextField)

const numberMask = createNumberMask({
  prefix: '',
  suffix: '',
  thousandsSeparatorSymbol: '.',
  decimalSymbol: ',',
  decimalScale: 2,
  fixedDecimalScale: true,
  requireDecimal: true, 
})

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
  
  const [mostraFipe, setMostraFipe] = useState(true)
  const [tipoFipe, setTipoFipe] = useState(null)
  const [marcaFipe, setMarcaFipe] = useState(null)
  const [modeloFipe, setModeloFipe] = useState(null)
  const [anoFipe, setAnoFipe] = useState(null)
  
  let submit

  useEffect(() => {
    // console.log('**** VeiculosModal.buscaVeiculo')
    limpaCampos()

    const buscaVeiculo = async () => {
      await api
        .get(`/veiculos/${veiculoID}`)
        .then(response => {
          const { data } = response
          // console.log('**** VeiculosModal.buscaVeiculo.data', data)
          setInitialValues(data)

          // setTipoFipe(data.fipeTipo)
          // setMarcaFipe(data.fipemarcaid)
          // setModeloFipe(data.fipemodeloid)
          // setAnoFipe(data.fipeano)
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
      limpaCampos()
    } else if (tipoCad === 'D') {
      if (veiculoID && veiculoID > 0) {
        buscaVeiculo()
      }
    }

  }, [veiculoID, pedidoID, tipoCad])

  const limpaCampos = () => {
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
    setMarcas([])
    setModelos([])
    setAnos([])
    setDisableMarca(true)
    setDisableModelo(true)
    setDisableAno(true)
  }

  // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const buscaMarcas = async (e, item) => {
    // console.log('**** VeiculosModal.buscaMarcas.dados', item)
    if (item === undefined) {
      return
    }
    if (item.value === undefined) {
      return
    }
    
    let dados = item.value

    if (!dados) {
      return
    }
    
    window.setFormValue('fipetipo', dados)
    window.setFormValue('tipoFipe', dados)

    setTipoFipe(dados)
    
    // console.log('**** VeiculosModal.buscaMarcas.dados', `${fipeapi}/${dados}/marcas.json`)

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

  const buscaModelos = async (e, item) => {
    // console.log('**** VeiculosModal.buscaModelos', item)
    if (item === undefined) {
      return
    }
    if (item.value === undefined) {
      return
    }

    let dados = item.value
    if (!dados) {
      return
    }
    
    window.setFormValue('fipemarcaid', dados)
    window.setFormValue('marcaFipe', dados)

    setMarcaFipe(dados)
    
    await Axios
      .get(`${fipeapi}/${tipoFipe}/veiculos/${dados}.json`)
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
  
  const buscaAnos = async (e, item) => {
    // console.log('**** VeiculosModal.buscaAnos', item)
    if (item === undefined) {
      return
    }
    if (item.value === undefined) {
      return
    }
    
    let dados = item.value
    if (!dados) {
      return
    }
    
    window.setFormValue('fipemodeloid', dados)
    window.setFormValue('modeloFipe', dados)

    setModeloFipe(dados)

    await Axios
      .get(`${fipeapi}/${tipoFipe}/veiculo/${marcaFipe}/${dados}.json`)
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
  
  const buscaFipe = async (e, item) => {
    // console.log('**** VeiculosModal.buscaFipe', item)
    if (item === undefined) {
      return
    }
    if (item.value === undefined) {
      return
    }
    
    let dados = item.value
    if (!dados) {
      return
    }

    setAnoFipe(dados)

    try {
      let anofipe = dados
      // let anodes = anos.find(opt => opt.value === dados.value)
      let anodes = item
      let ano = anodes.label.substring(0, 4)

      if (ano.toLocaleLowerCase() === 'zero') {
        ano = moment().format('YYYY')
      }

      await Axios
        .get(`${fipeapi}/${tipoFipe}/veiculo/${marcaFipe}/${modeloFipe}/${item.value}.json`)
        .then(response => {
          const { data } = response

          let valor = data.preco.replace('R$ ','').replace('.','').replace(',','.')

          // console.log('**** VeiculosModal.buscaFipe.valor', valor)

          // let modelo = `${data.marca} ${data.name} ${data.ano_modelo} ${data.combustivel} (Tabela: ${data.referencia})`
          let modelo = `${data.marca} ${data.name} ${anodes.label}` // (Tabela: ${data.referencia})`

          window.setFormValue('ano', parseInt(ano))
          window.setFormValue('fipeano', anodes.value)
          window.setFormValue('fipe', data.fipe_codigo)
          window.setFormValue('modelo', modelo.toLocaleUpperCase())
          window.setFormValue('anoFipe', anofipe)
          window.setFormValue('valor', valor)
          setMostraFipe(true)
          // console.log('**** buscaFipe', data)
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
    catch (error) {
      console.log('**** VeiculosModal.buscaFipe.error', error)
    }
  }
  
  const fechar = async (e) => {
    // console.log('**** VeiculosModal.fechar', e)
    if (callback) {
      // await sleep(1000)
      callback(typeof e === 'object' ? false : e)
      limpaCampos()
      hide()
    }
  }

  async function onSubmit (values) {
    // console.log('**** VeiculosModal.onSubmit-values', values)

    let newValues = {}

    for (var [key, value] of Object.entries(values)) {
      if (key === 'placachassi') {
        let val = value
            val = val.trim()
            val = val.replace('-','')
            val = val.toLocaleUpperCase()
        newValues[key] = val
      } else {
        if (value !== null) {
          let val = value.toString()
          newValues[key] = val.toLocaleUpperCase()
        } else {
          newValues[key] = value
        }
      }
    }

    if (values['valor'] !== null) {
      let val = values['valor'].toString()
      if (val.indexOf(",") !== -1) {
        val = values['valor'].replace('.', '')
        val = val.replace(',', '.')
        newValues['valor'] = val
      }
    } 

    console.log('**** VeiculosModal.onSubmit-newValues', newValues)

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

  function formatCurrency(props) {
    const { inputRef, value, ...other } = props

    let val = value
    val = val.toString().replace('.', ',')

    // console.log('**** VeiculosModal.formatCurrency', val)

    return (
      <MaskedInput
        {...other}
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null);
        }}
        value={val}
        mask={numberMask}
        placeholderChar={'\u2000'}
        showMask
        style={{
          textAlign:"right",
        }}
      />
    )
  }

  formatCurrency.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
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
                              <Autocomplete
                                disabled={disableEdit}
                                name="estado"
                                label="Estado"
                                fullWidth
                                options={estadoVeiculo}
                                getOptionValue={option => option.value}
                                getOptionLabel={option => option.label}
                                renderInput={(params) => 
                                  <CssMuiTextField 
                                    {...params}
                                    name="estado1"
                                    label="Estado" 
                                    variant="outlined" 
                                    size="small"
                                    margin="dense"
                                  />
                                }
                              />
                            </Col>
                          </Row>

                          {mostraFipe && 
                            <div>
                              <Row style={{ height: '54px', marginTop: '15px' }}>
                                <Col xs={6}>
                                  <Autocomplete
                                    disabled={disableEdit}
                                    name="tipoFipe"
                                    label="Tipo"
                                    fullWidth
                                    options={fipeTipo}
                                    getOptionValue={option => option.value}
                                    getOptionLabel={option => option.label}
                                    onChange={buscaMarcas}
                                    renderInput={(params) => 
                                      <CssMuiTextField 
                                        {...params}
                                        name="tipoFipe1"
                                        label="Tipo" 
                                        variant="outlined" 
                                        size="small"
                                        margin="dense"
                                      />
                                    }
                                  />
                                </Col>
                                <Col xs={6}>
                                  <Autocomplete
                                    disabled={disableMarca}
                                    name="marcaFipe"
                                    label="Marca"
                                    fullWidth
                                    options={marcas}
                                    getOptionValue={option => option.value}
                                    getOptionLabel={option => option.label}
                                    onChange={buscaModelos}
                                    renderInput={(params) => 
                                      <CssMuiTextField 
                                        {...params}
                                        name="marcaFipe1"
                                        label="Marca" 
                                        variant="outlined" 
                                        size="small"
                                        margin="dense"
                                      />
                                    }
                                  />
                                </Col>
                              </Row>
                              <Row style={{ height: '54px', marginTop: '15px' }}>
                                <Col xs={6}>
                                  <Autocomplete
                                    disabled={disableModelo}
                                    name="modeloFipe"
                                    label="Modelo"
                                    fullWidth
                                    options={modelos}
                                    getOptionValue={option => option.value}
                                    getOptionLabel={option => option.label}
                                    onChange={buscaAnos}
                                    renderInput={(params) => 
                                      <CssMuiTextField 
                                        {...params}
                                        name="modeloFipe1"
                                        label="Modelo" 
                                        variant="outlined" 
                                        size="small"
                                        margin="dense"
                                      />
                                    }
                                  />
                                </Col>
                                <Col xs={6}>
                                  <Autocomplete
                                    disabled={disableAno}
                                    name="anoFipe"
                                    label="Ano"
                                    fullWidth
                                    options={anos}
                                    getOptionValue={option => option.value}
                                    getOptionLabel={option => option.label}
                                    onChange={buscaFipe}
                                    renderInput={(params) => 
                                      <CssMuiTextField 
                                        {...params}
                                        name="anoFipe1"
                                        label="Ano" 
                                        variant="outlined" 
                                        size="small"
                                        margin="dense"
                                      />
                                    }
                                  />
                                </Col>
                              </Row>
                            </div>
                          }

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
                                InputProps={{
                                  // inputComponent: formatCep,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <button type="button" onClick={() => { setMostraFipe(true) }}
                                        style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
                                      >
                                        <AiOutlineSearch />
                                      </button>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Col>
                            <Col xs={6}>
                              <Field
                                disabled={disableEdit}
                                name="valor"
                                component={CssTextField}
                                type="text"
                                label="Valor"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                // onChange={e => window.setFormValue('valor', e.target.value )}
                                // InputProps={{
                                //   inputComponent: formatCurrency,
                                // }}
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