import React, { useState, useEffect } from 'react'
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
// import { makeStyles } from '@material-ui/core/styles'

import { AiOutlineSearch } from 'react-icons/ai'
import { 
  Box,
  InputAdornment,
  MenuItem,
  Tabs,
  Tab,
  Tooltip, 
  withStyles, 
} from '@material-ui/core'

import { isCNPJ, isCPF } from 'brazilian-values'

import { FaIcon } from '../../../components/Icone'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { Form, Field } from 'react-final-form'

import "./modal.css"
import api from '../../../services/rf'
import Axios from 'axios'
import { values } from 'lodash'

import { Autocomplete, TextField as MuiTextField } from 'mui-rff'

import dadosUF from '../../../services/json/uf.json'
import dadosCidadesJSON from '../../../services/json/cidade.json'
import cadBancos from '../../../services/json/bancos.json'

const numberMask = createNumberMask({
  prefix: '',
  suffix: '',
  thousandsSeparatorSymbol: '.',
  decimalSymbol: ',',
  decimalScale: 2,
  fixedDecimalScale: true,
  requireDecimal: true, 
})

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          {children}
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

function clearNumber(value = '') {
  return value.replace(/\D+/g, '')
}

function formatCurrency(props) {
  const { inputRef, value, ...other } = props

  let val = value
  val = val.toString().replace('.', ',')

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null)
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

function formatCpfCnpj(props) {
  const { inputRef, value, ...other } = props

  // if (!value) {
  //   return value
  // }

  const clearValue = clearNumber(value)
  let sMask = [/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/]
  if (clearValue.length > 11) {
    sMask = [/[0-9]/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]
  }

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      value={value}
      mask={sMask}
      placeholderChar={'\u2000'}
      showMask
    />
  )
}

formatCpfCnpj.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

function formatCelular(props) {
  const { inputRef, value, ...other } = props

  let valor = value
  if (!valor) {
    valor = ''
  }

  const clearValue = clearNumber(value)
  let sMask = ['(', /[0-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/]
  if (clearValue.length > 10) {
    sMask = ['(', /[0-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  }

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      value={valor}
      mask={sMask}
      placeholderChar={'\u2000'}
      showMask
    />
  )
}

formatCelular.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

function formatCep(props) {
  const { inputRef, value, ...other } = props

  let valor = value
  if (!valor) {
    valor = ''
  }

  const sMask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      value={valor}
      mask={sMask}
      placeholderChar={'\u2000'}
      showMask
    />
  )
}

formatCep.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

const PatioModal = ({ 
  isShowPatio, 
  hide, 
  patioID, 
  tipoCad, 
  disableEdit, 
  callback,
}) => {
  
  const [initialValues, setInitialValues] = useState([])
  const [ufCidades, setUfCidades] = useState([])
  const [value, setValue] = useState(0)
  const [atualizaCEP, setAtualizaCEP] = useState(false)
  const [ultimoCep, setUltimoCep] = useState('')
  
  let dCidades = []
  let submit

  useEffect(() => {
    limpaCampos()

    dCidades = []
    dadosCidadesJSON.forEach(cidade => {
      dCidades.push({
        codigo_ibge : cidade.codigo_ibge,
        nome : cidade.nome.normalize("NFD").replace(/[^a-zA-Z s]/g, "").toUpperCase(),
        latitude : cidade.latitude,
        longitude : cidade.longitude,
        capital : cidade.capital,
        codigo_uf : cidade.codigo_uf
      })
    })

    const buscaPatio = async () => {
      await api
        .get(`/patios/${patioID}`)
        .then(response => {
          const { data } = response

          data.cidade = data.cidade.normalize("NFD").replace(/[^a-zA-Z s]/g, "").toUpperCase()
          
          setInitialValues(data)

          if (data.uf !== undefined && data.uf !== null) {
            filterCidade(null, data.uf)
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
              console.log('**** PatioModal.buscaPatio.error.data', data)
            }
          } else if (error.request) {
            console.log('**** PatioModal.buscaPatio.error', error)
          } else {
          }
        })
    }
    // console.log('**** PatioModal', patioID, tipoCad)
    if (patioID && patioID > 0 && tipoCad === 'E') {
      buscaPatio()
    } else if (tipoCad === 'N') {
      limpaCampos()
    } else if (tipoCad === 'D') {
      if (patioID && patioID > 0) {
        buscaPatio()
      }
    }

    return () => {
      limpaCampos()
    }

  }, [patioID, tipoCad])

  // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const filterCidade = (e, uf) => {
    window.setFormValue('uf', uf)
    const filteredUf = dadosUF.filter(uff => uff.uf.includes(uf))
    const filteredUfCidades = dCidades.filter(cidade => cidade.codigo_uf === filteredUf[0].codigo_uf)
    setUfCidades(filteredUfCidades)
  }

  const limpaCampos = () => {

    var newData = {
      "uf": "",
      "cidade": "",
      "prioridade": 0,
      "nome": "",
      "cnpjcpf": "",
      "endereco": "",
      "numero": "",
      "complemento": "",
      "bairro": "",
      "cep": "",
      "contato": "",
      "celular": "",
      "celular1": "",
      "celular2": "",
      "fone": "",
      "fone1": "",
      "fone2": "",
      "email": "",
      "email1": "",
      "email2": "",
      "atendimento": "24 HORAS",
      "valor_coleta": 0,
      "valor_embarque_carro": 0,
      "valor_embarque_van": 0,
      "valor_embarque_moto": 0,
      "valor_embarque_moto_300": 0,
      "raio_coleta": 0,
      "numero_diarias_gratis": 0,
      "diaria_carro": 0,
      "diaria_van": 0,
      "diaria_moto": 0,
      "diaria_moto_grande": 0,
      "motorista": "",
      "motorista_cpf": "",
      "motorista_placa": "",
      "banco": "",
      "agencia": "",
      "tipo_conta": "",
      "conta": "",
      "titular": "",
      "cpf_titular": "",
      "observacoes": "",
      "latitude": 0,
      "longitude": 0,
      "status": "A"
    }

    setInitialValues(newData)
  }

  const CpfCnpjValido = (value) => {
    if (!value) {
      return value
    }

    const valor = value
      .replace('.', '')
      .replace('-', '')
      .replace('/', '')
      .replace(' ', '')
      .replace('.', '')

    if (valor.trim().length === 11) {
      // console.log('**** valor CPF', valor, isCPF(valor))

      if (!isCPF(valor.trim())) {
        return 'CPF Inválido!'
      } else {
        return undefined
      }
    } else if (valor.trim().length === 14) {
      // console.log('**** valor CNPJ', valor, isCNPJ(valor))

      if (!isCNPJ(valor.trim())) {
        return 'CNPJ Inválido!'
      } else {
        return undefined
      }
    } else {
      return undefined
    }
  }

  const validaCEP = async (value) => {
    setAtualizaCEP(true)

    if (!value) {
      setAtualizaCEP(false)
      return value
    }

    const cep = value.replace('-', '')
    if (cep.trim().length < 8) {
      setAtualizaCEP(false)
      return value
    }

    if (ultimoCep === cep) {
      setAtualizaCEP(false)
      return
    }
    setUltimoCep(cep)

    const prot = window.location.protocol // === 'http' ? 'http' : 'https'
    const port = window.location.protocol === 'http:' ? 3003 : 3004
    const service = `${prot}//www.retornofacil.com.br:${port}/api/cep/${cep}`

    Axios.get(service, {})
      .then(response => {
        const { data } = response.data
        if (response.data.error) {
          // toast(response.data.message, { type: 'error' })
          toast('O CEP informado não foi encontrado', { type: 'error' })
          setAtualizaCEP(false)
          return
        }

        const Logradouro = `${data[0].data[0].Tipo_Logradouro} ${data[0].data[0].Logradouro}`
        const Bairro = data[0].data[0].Bairro
        const Cidade = data[0].data[0].Cidade
        const UF = data[0].data[0].UF

        if (values.logradouro === '' ||
          values.logradouro === null ||
          values.logradouro === undefined) {
          window.setFormValue('logradouro', Logradouro.toUpperCase())
          window.setFormValue('bairro', Bairro.toUpperCase())
          window.setFormValue('cidade', Cidade.toUpperCase())
          window.setFormValue('uf', UF.toUpperCase())
        }
        setAtualizaCEP(false)
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** CardUsuario.validaCEP.error.data', data)
          }
        } else if (error.request) {
          console.log('**** CardUsuario.validaCEP.error.data', error)
        } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
        setAtualizaCEP(false)
      })
  }


  const fechar = async (e) => {
    // console.log('**** PatioModal.fechar', e)
    if (callback) {
      // await sleep(1000)
      callback(typeof e === 'object' ? false : e)
      limpaCampos()
    }
    hide()
  }

  async function onSubmit (values) {
    console.log('**** PatioModal.onSubmit-values', values)
    return

    let newValues = {}
    newValues['cidade_origem'] = values['cidade_origem']
    newValues['uf_origem'] = values['uf_origem']
    newValues['cidade_destino'] = values['cidade_destino']
    newValues['uf_destino'] = values['uf_destino']
    newValues['tipo_de_veiculo_id'] = values['tipo_de_veiculo_id']
    
    if (values['valor'] !== null) {
      let val = values['valor'].toString()
      if (val.indexOf(",") !== -1) {
        val = values['valor'].replace('.', '')
        val = val.replace(',', '.')
        newValues['valor'] = parseFloat(val).toFixed(2)
      }
    } else {
      newValues['valor'] = parseFloat(values['valor']).toFixed(2)
    }
    
    // console.log('**** PatioModal.onSubmit-values-1', values)
    let apiParams = {}
    if (patioID !== null && tipoCad === 'E') {
      apiParams = {
        method: 'put',
        url: `/patiostabela/${patioID}`,
        data: JSON.stringify(newValues),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    } else {
      apiParams = {
        method: 'post',
        url: `/patiostabela`,
        data: JSON.stringify(newValues),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    }
    
    // console.log('**** PatioModal.onSubmit-apiParams', apiParams)
    const patio = `${values.cidade_origem}/${values.uf_origem} X ${values.cidade_destino}/${values.uf_destino}`

    await api(apiParams, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    .then(response => {
      const { data } = response
      if (response.status !== 200) {
        toast(`Ocorreu um erro no processamento da patio [${patio}]!`,
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
          console.log('**** PatioModal.onSubmit.error.data', data)
        }
      } else if (error.request) {
        console.log('**** PatioModal.onSubmit.error', error)
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
    
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const composeValidators = (...validators) => value =>
    validators.reduce((error, validator) => error || validator(value), undefined)

  const required = value => (value ? undefined : '* Obrigatório!')

  if (isShowPatio) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal-patio">
            <Container>
              <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Grid mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      Cadastro de Patio
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
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

              <BoxTitulo height={400} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Form
                  onSubmit={onSubmit}
                  initialValues={initialValues}
                  validate={required} 
                  height={'300px'} width={'100%'}
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

                        <Tabs value={value} onChange={handleChange} aria-label="Dados do Patio">
                          <Tab label="Dados" {...a11yProps(0)} />
                          <Tab label="Valores" {...a11yProps(1)} />
                          <Tab label="Outros" {...a11yProps(2)} />
                        </Tabs>

                        <TabPanel value={value} index={0} id='cadDados'>
                          <Grid style={{ width: '1080px' }}>
                            
                            <Row style={{ minHeight: '65px' }}>
                              <Col xs={3}>
                                <Field
                                  disabled={disableEdit}
                                  name="cnpjcpf"
                                  component={CssTextField}
                                  type="text"
                                  validate={composeValidators(required, CpfCnpjValido)}
                                  label="CPF/CNPJ"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  margin="dense"
                                  InputProps={{
                                    inputComponent: formatCpfCnpj,
                                  }}
                                />
                              </Col>
                              <Col xs={9}>
                                <Field
                                  disabled={disableEdit}
                                  name="nome"
                                  component={CssTextField}
                                  type="text"
                                  validate={required}
                                  label="Nome/Razão Social"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  margin="dense"
                                />
                              </Col>
                            </Row>

                            <Row style={{ minHeight: '65px' }}>
                              <Col xs={3}>
                                <Field
                                  disabled={disableEdit}
                                  name="contato"
                                  component={CssTextField}
                                  type="text"
                                  label="Contato"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={3}>
                                <Field
                                  disabled={disableEdit}
                                  name="celular"
                                  component={CssTextField}
                                  type="text"
                                  label="Celular"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                  pattern="[\d|(|)|-]{11,12}"
                                  InputProps={{
                                    inputComponent: formatCelular,
                                  }}
                                />
                              </Col>
                              <Col xs={3}>
                                <Field
                                  disabled={disableEdit}
                                  name="celular1"
                                  component={CssTextField}
                                  type="text"
                                  validate={required}
                                  label="Celular 1"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                  InputProps={{
                                    inputComponent: formatCelular,
                                  }}
                                />
                              </Col>
                              <Col xs={3}>
                                <Field
                                  disabled={disableEdit}
                                  name="celular2"
                                  component={CssTextField}
                                  type="text"
                                  validate={required}
                                  label="Celular 2"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                  InputProps={{
                                    inputComponent: formatCelular,
                                  }}
                                />
                              </Col>
                            </Row>

                            <Row style={{ minHeight: '65px' }}>
                              <Col xs={3}>
                              </Col>
                              <Col xs={3}>
                                <Field
                                  disabled={disableEdit}
                                  name="fone"
                                  component={CssTextField}
                                  type="text"
                                  label="Telefone"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                  InputProps={{
                                    inputComponent: formatCelular,
                                  }}
                                />
                              </Col>
                              <Col xs={3}>
                                <Field
                                  disabled={disableEdit}
                                  name="fone1"
                                  component={CssTextField}
                                  type="text"
                                  label="Telefone 1"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                  InputProps={{
                                    inputComponent: formatCelular,
                                  }}
                                />
                              </Col>
                              <Col xs={3}>
                                <Field
                                  disabled={disableEdit}
                                  name="fone2"
                                  component={CssTextField}
                                  type="text"
                                  label="Telefone 2"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                  InputProps={{
                                    inputComponent: formatCelular,
                                  }}
                                />
                              </Col>
                            </Row>

                            <Row style={{ minHeight: '65px' }}>
                              <Col xs={6}>
                                <Field
                                  disabled={disableEdit}
                                  name="email"
                                  component={CssTextField}
                                  type="text"
                                  label="Email"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={6}>
                                <Field
                                  disabled={disableEdit}
                                  name="email1"
                                  component={CssTextField}
                                  type="text"
                                  label="Email 1"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                            </Row>

                            <Row style={{ minHeight: '65px' }}>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="cep"
                                  component={CssTextField}
                                  type="text"
                                  label="CEP"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                  InputProps={{
                                    inputComponent: formatCep,
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <button type="button" onClick={() => validaCEP(values.cep)}
                                          style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
                                        >
                                          <AiOutlineSearch />
                                        </button>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Col>
                              <Col xs={7}>
                                <Field
                                  disabled={disableEdit}
                                  name="endereco"
                                  component={CssTextField}
                                  type="text"
                                  label="Endereço"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={3}>
                                <Field
                                  disabled={disableEdit}
                                  name="numero"
                                  component={CssTextField}
                                  type="text"
                                  label="Número"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                            </Row>
                            
                            <Row style={{ minHeight: '65px' }}>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="complemento"
                                  component={CssTextField}
                                  type="text"
                                  label="Complemento"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={4}>
                                <Field
                                  disabled={disableEdit}
                                  name="bairro"
                                  component={CssTextField}
                                  type="text"
                                  label="Bairro"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={2}>
                                <Autocomplete
                                  disabled={disableEdit}
                                  name="uf"
                                  label="UF"
                                  fullWidth
                                  options={dadosUF}
                                  getOptionValue={option => option.uf}
                                  getOptionLabel={option => option.uf}
                                  onChange={(e, newValue) => filterCidade(e, newValue.uf)}
                                  renderInput={(params) => 
                                    <CssMuiTextField 
                                      {...params}
                                      name="uf1"
                                      label="UF" 
                                      variant="outlined" 
                                      size="small"
                                      margin="dense"
                                    />
                                  }
                                />
                              </Col>
                              <Col xs={4}>
                                <Autocomplete
                                  disabled={disableEdit}
                                  name="cidade"
                                  label="Cidade"
                                  fullWidth
                                  options={ufCidades}
                                  getOptionValue={option => option.nome}
                                  getOptionLabel={option => option.nome}
                                  renderInput={(params) => 
                                    <CssMuiTextField 
                                      {...params}
                                      name="cidade1"
                                      label="Cidade" 
                                      variant="outlined" 
                                      size="small"
                                      margin="dense"
                                    />
                                  }
                                />
                              </Col>
                            </Row>
                            
                          </Grid>
                        </TabPanel>

                        <TabPanel value={value} index={1} id='cadValores'>
                          <Grid style={{ width: '1080px' }}>
                            
                            <Row style={{ minHeight: '30px' }}>
                              <Col xs={12}>
                                <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mt={0} mb={10}>
                                  <Texto
                                    size={18} height={24} italic={true} bold={500} font='Arial'
                                    mt={3}
                                    color='#2699FB' shadow={true}>
                                    Valores Cobrados
                                  </Texto>

                                  
                                </BoxTitulo>
                              </Col>
                            </Row>

                            <Row style={{ minHeight: '65px' }}>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="raio_coleta"
                                  component={CssTextField}
                                  type="text"
                                  label="Raio Coleta (KM)"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="valor_coleta"
                                  component={CssTextField}
                                  type="text"
                                  label="Valor Coleta"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="valor_embarque_carro"
                                  component={CssTextField}
                                  type="text"
                                  label="Embarque Carro"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="valor_embarque_van"
                                  component={CssTextField}
                                  type="text"
                                  label="Embarque Van"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="valor_embarque_moto"
                                  component={CssTextField}
                                  type="text"
                                  label="Embarque Moto"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="valor_embarque_moto_300"
                                  component={CssTextField}
                                  type="text"
                                  label="Emb. Moto (+300cc)"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                            </Row>

                            <Row style={{ minHeight: '65px' }}>
                              <Col xs={2}>
                              </Col>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="numero_diarias_gratis"
                                  component={CssTextField}
                                  type="text"
                                  label="Diárias Grátis (Dias)"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="diaria_carro"
                                  component={CssTextField}
                                  type="text"
                                  label="Diária Carro"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="diaria_van"
                                  component={CssTextField}
                                  type="text"
                                  label="Diária Van"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="diaria_moto"
                                  component={CssTextField}
                                  type="text"
                                  label="Diária Moto"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="diaria_moto_grande"
                                  component={CssTextField}
                                  type="text"
                                  label="Diária Moto (+300cc)"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                            </Row>

                            <Row style={{ minHeight: '30px' }}>
                              <Col xs={12}>
                                <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mt={0} mb={10}>
                                  <Texto
                                    size={18} height={24} italic={true} bold={500} font='Arial'
                                    mt={3}
                                    color='#2699FB' shadow={true}>
                                    Dados Bancários
                                  </Texto>
                                </BoxTitulo>
                              </Col>
                            </Row>

                            <Row style={{ minHeight: '65px' }}>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="tipo_conta"
                                  component={CssTextField}
                                  type="select"
                                  label="Tp Conta"
                                  variant="outlined"
                                  fullWidth
                                  select
                                  size="small"
                                  margin="dense"
                                >
                                  <MenuItem value="CCPJ">Conta Corrente PJ</MenuItem>
                                  <MenuItem value="CCPF">Conta Corrente PF</MenuItem>
                                  <MenuItem value="P">Poupança</MenuItem>
                                </Field>
                              </Col>
                              <Col xs={6}>
                                <Autocomplete
                                  disabled={disableEdit}
                                  name="banco"
                                  label="Banco"
                                  fullWidth
                                  options={cadBancos}
                                  getOptionValue={option => option.Code}
                                  getOptionLabel={option => option.Name}
                                  renderInput={(params) => 
                                    <CssMuiTextField 
                                      {...params}
                                      name="banco1"
                                      label="Banco" 
                                      variant="outlined" 
                                      size="small"
                                      margin="dense"
                                    />
                                  }
                                />
                              </Col>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="agencia"
                                  component={CssTextField}
                                  type="text"
                                  label="Agência"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={2}>
                                <Field
                                  disabled={disableEdit}
                                  name="conta"
                                  component={CssTextField}
                                  type="text"
                                  label="Conta"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                            </Row>

                            <Row style={{ minHeight: '65px' }}>
                              <Col xs={3}>
                                <Field
                                  disabled={disableEdit}
                                  name="cpf_titular"
                                  component={CssTextField}
                                  type="text"
                                  validate={composeValidators(required, CpfCnpjValido)}
                                  label="CPF/CNPJ Titular"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  margin="dense"
                                  InputProps={{
                                    inputComponent: formatCpfCnpj,
                                  }}
                                />
                              </Col>
                              <Col xs={9}>
                                <Field
                                  disabled={disableEdit}
                                  name="titular"
                                  component={CssTextField}
                                  type="text"
                                  validate={required}
                                  label="Nome/Razão Social Titular"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  margin="dense"
                                />
                              </Col>
                            </Row>

                            <Row style={{ minHeight: '55px' }}>
                              <Col xs={12}>
                              </Col>
                            </Row>

                          </Grid>
                        </TabPanel>
                        
                        <TabPanel value={value} index={2} id='cadOutros'>
                          <Grid style={{ width: '1080px' }}>
                            <Row style={{ minHeight: '65px' }}>
                              <Col xs={3}>
                                <Field
                                  disabled={disableEdit}
                                  name="latitude"
                                  component={CssTextField}
                                  type="text"
                                  label="Latitude"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={3}>
                                <Field
                                  disabled={disableEdit}
                                  name="longitude"
                                  component={CssTextField}
                                  type="text"
                                  label="Longitude"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                              <Col xs={3}>
                                <Field
                                  disabled={disableEdit}
                                  name="status"
                                  component={CssTextField}
                                  type="select"
                                  label="Status"
                                  variant="outlined"
                                  fullWidth
                                  select
                                  size="small"
                                  margin="dense"
                                >
                                  <MenuItem value="A">Ativo</MenuItem>
                                  <MenuItem value="I">Inativo</MenuItem>
                                  <MenuItem value="B">Bloqueado</MenuItem>
                                </Field>
                              </Col>
                            </Row>

                            <Row style={{ minHeight: '150px' }}>
                              <Col xs={12}>
                                <Field
                                  disabled={disableEdit}
                                  name="observacoes"
                                  component={CssTextField}
                                  type="text"
                                  label="Observações"
                                  variant="outlined"
                                  fullWidth
                                  multiline={true}
                                  rows={20}
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                            </Row>
                          </Grid>
                        </TabPanel>

                      </form>
                    )
                  }}
                />
              </BoxTitulo>

            </Container>
          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default PatioModal