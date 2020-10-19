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
} from '../CardUsuario/styles'

import {
  TextField,
} from 'final-form-material-ui'

import MaskedInput from 'react-text-mask'

import { makeStyles } from '@material-ui/core/styles'

import {
  Tooltip,
  withStyles,
  MenuItem,
  InputAdornment,
} from '@material-ui/core'

import { FaIcon } from '../../Icone'

import { Grid, Row, Col } from 'react-flexbox-grid'

import { Form, Field } from 'react-final-form'
// import DatePicker from '../../datepicker'
// import { values } from 'lodash'
import { AiOutlineSearch } from 'react-icons/ai'

import "./modal.css"
import api from '../../../services/rf'
import Axios from 'axios'
import { values } from 'lodash'

import GridUsuariosModal from '../GridUsuariosModal'
import useModalUsuarios from '../GridUsuariosModal/useModal'

const CssTextField = withStyles({
  root: {
    '& > *': {
      fontFamily: ['Montserrat', 'sans Serif'],
      fontSize: 12,
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
      fontSize: 10,
    },
    '& .MuiFormHelperText-contained': {
      justifyContent: 'left',
    },
  },

})(TextField)

const cadStatus = [
  { Id: 1, Code: 'D', Description: 'Aguardando Coleta' },
  { Id: 2, Code: 'C', Description: 'Coletando' },
  { Id: 3, Code: 'A', Description: 'A Caminho' },
  { Id: 4, Code: 'E', Description: 'Entregue' },
]

const RotasPedidoModal = ({ isShowRotas, hide, pedidoID, rotaID, tipoCad, disableEdit, callback }) => {
  const [initialValues, setInitialValues] = useState([])
  const { isShowing, toggleGridUsuarios } = useModalUsuarios()

  const [atualizaCEP, setAtualizaCEP] = useState(false)
  const [ultimoCep, setUltimoCep] = useState('')

  let submit

  useEffect(() => {
    // console.log('**** RotasPedidoModal.buscaRota')
    const buscaRota = async () => {
      await api
        .get(`/buscarotaspedidos/${rotaID}`)
        .then(response => {
          const { data } = response
          console.log('**** RotasPedidoModal.buscaRota.data', data)
          setInitialValues(data[0])
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
              console.log('**** RotasPedidoModal.buscaRota.error.data', data)
            }
          } else if (error.request) {
            console.log('**** RotasPedidoModal.buscaRota.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }

    // console.log('**** RotasPedidoModal', rotaID, tipoCad)

    if (rotaID && rotaID > 0 && tipoCad === 'E') {
      // setDisableEdit(false)
      buscaRota()
    } else if (tipoCad === 'N') {
      var newData = {
        pedido_id: pedidoID,
        nome: "",
        cpfcnpj: "",
        motorista_id: null,
        ordem: null,
        status: "",
        logradouro_origem: "",
        numero_origem: "",
        complemento_origem: "",
        bairro_origem: "",
        cidade_origem: "",
        uf_origem: "",
        pais_origem: "",
        cep_origem: "",
        contato_origem: "",
        celular_origem: "",
        telefone_origem: "",
        whats_origem: "",
        email_origem: "",
        logradouro_destino: "",
        numero_destino: "",
        complemento_destino: "",
        bairro_destino: "",
        cidade_destino: "",
        uf_destino: "",
        pais_destino: "",
        cep_destino: "",
        contato_destino: "",
        celular_destino: "",
        telefone_destino: "",
        whats_destino: "",
        email_destino: "",
      }
      setInitialValues(newData)
    } else if (tipoCad === 'D') {
      if (rotaID && rotaID > 0) {
        buscaRota()
      }
    }

  }, [rotaID, pedidoID, tipoCad])

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

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
          // console.log('**** RotasPedidoModal.buscaCliente.data', data)

          setInitialValues({
            ...initialValues,
            cpfcnpj: data.cpfcnpj,
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
              console.log('**** RotasPedidoModal.buscaCliente.error.data', data)
            }
          } else if (error.request) {
            console.log('**** RotasPedidoModal.buscaCliente.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  function clearNumber(value = '') {
    return value.replace(/\D+/g, '')
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

  const validaCEP = async (value, campo) => {
    setAtualizaCEP(true)

    // console.log('**** RotasPedidoModal.validaCEP.campo', campo, value)

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

    // console.log('**** RotasPedidoModal.validaCEP.Axios.service', service)

    Axios.get(service, {})
      .then(response => {
        const { data } = response.data
        if (response.data.error) {
          // toast(response.data.message, { type: 'error' })
          toast('O CEP informado não foi encontrado', { type: 'error' })
          setAtualizaCEP(false)
          return
        }

        // console.log('**** RotasPedidoModal.validaCEP.Axios.data', data)

        const Logradouro = `${data[0].data[0].Tipo_Logradouro} ${data[0].data[0].Logradouro}`
        const Bairro = data[0].data[0].Bairro
        const Cidade = data[0].data[0].Cidade
        const UF = data[0].data[0].UF
        const latitude = data[0].data[0].geo.latitude
        const longitude = data[0].data[0].geo.longitude

        if (campo === 'O') {
          if (values.logradouro_origem === '' ||
            values.logradouro_origem === null ||
            values.logradouro_origem === undefined) {
            window.setFormValue('logradouro_origem', Logradouro.toUpperCase())
            window.setFormValue('bairro_origem', Bairro.toUpperCase())
            window.setFormValue('cidade_origem', Cidade.toUpperCase())
            window.setFormValue('uf_origem', UF.toUpperCase())
            window.setFormValue('latitude_origem', latitude)
            window.setFormValue('longitude_origem', longitude)
          }
        }
        if (campo === 'D') {
          if (values.logradouro_destino === '' ||
            values.logradouro_destino === null ||
            values.logradouro_destino === undefined) {
            window.setFormValue('logradouro_destino', Logradouro.toUpperCase())
            window.setFormValue('bairro_destino', Bairro.toUpperCase())
            window.setFormValue('cidade_destino', Cidade.toUpperCase())
            window.setFormValue('uf_destino', UF.toUpperCase())
            window.setFormValue('latitude_destino', latitude)
            window.setFormValue('longitude_destino', longitude)
          }
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
            console.log('**** RotasPedidoModal.validaCEP.error.data', data)
          }
        } else if (error.request) {
          console.log('**** RotasPedidoModal.validaCEP.error.data', error)
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
        setAtualizaCEP(false)
      })
  }

  const fechar = async (e) => {
    // console.log('**** RotasPedidoModal.fechar', e)
    if (callback) {
      // await sleep(1000)
      callback(typeof e === 'object' ? false : e)
      hide()
    }
  }

  async function onSubmit(values) {
    if (atualizaCEP) {
      return
    }

    console.log('**** RotasPedidoModal.onSubmit-values', values)

    values.cpfcnpj = clearNumber(values.cpfcnpj)
    values.celular_origem = clearNumber(values.celular_origem)
    values.whats_origem = clearNumber(values.whats_origem)
    values.cep_origem = clearNumber(values.cep_origem)
    values.celular_destino = clearNumber(values.celular_destino)
    values.whats_destino = clearNumber(values.whats_destino)
    values.cep_destino = clearNumber(values.cep_destino)

    let apiParams = {}
    if (rotaID !== null && tipoCad === 'E') {
      apiParams = {
        method: 'put',
        url: `/rotaspedidos/${rotaID}`,
        data: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    } else {
      apiParams = {
        method: 'post',
        url: `/rotaspedidos`,
        data: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    }

    // console.log('**** RotasPedidoModal.onSubmit-apiParams', apiParams)
    const nome = values.nome

    await api(apiParams, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
      .then(response => {
        const { data } = response
        if (response.status !== 200) {
          toast(`Ocorreu um erro no processamento da rota [${nome}]!`,
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
            console.log('**** RotasPedidoModal.onSubmit.error.data', data)
          }
        } else if (error.request) {
          console.log('**** RotasPedidoModal.onSubmit.error', error)
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })

  }

  const required = value => (value ? undefined : '* Obrigatório!')

  if (isShowRotas) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal-rotas-pedido">
            <Container width={1250}>
              <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Grid mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      Dados da Rota
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                    {disableEdit ?
                      <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                      :
                      <Tooltip title="Salvar">
                        <Botao onClick={event => { submit(event) }}><FaIcon icon='Save' size={20} /></Botao>
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
                height={'410px'} width={'100%'}
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
                                name="nome"
                                validate={required}
                                component={CssTextField}
                                type="text"
                                label="Nome"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                              />
                            </Col>
                            <Col xs={2}>
                              <Field
                                disabled={disableEdit}
                                name="cpfcnpj"
                                component={CssTextField}
                                type="text"
                                label="CPF/CNPJ"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                InputProps={{
                                  inputComponent: formatCpfCnpj,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <button
                                        type="button"
                                        disabled={disableEdit}
                                        onClick={findCliente}
                                        style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
                                      >
                                        <AiOutlineSearch />
                                      </button>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Col>
                            <Col xs={4}>
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
                                {/* { Id: 1, Code: '', Description: 'Aguardando' } */}
                                {cadStatus.map((option) => (
                                  <MenuItem key={option.Code} value={option.Code}>
                                    {option.Description}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Col>
                          </Row>

                          <Row>
                            <Col xs={6}>
                              <BoxTitulo bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10} mt={10}>
                                <Grid>
                                  <Row style={{ height: '45px', marginTop: '10px' }}>
                                    <Col xs={8}>
                                      <Texto
                                        size={22} height={24} italic={true} bold={700} font='Arial'
                                        mt={8}
                                        color='#2699FB' shadow={true}>
                                        ORIGEM
                                      </Texto>
                                    </Col>
                                    <Col xs={4}>
                                      <Field
                                        disabled={disableEdit}
                                        name="cep_origem"
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
                                              <button
                                                type="button"
                                                disabled={disableEdit}
                                                onClick={() => validaCEP(values.cep_origem, 'O')}
                                                style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
                                              >
                                                <AiOutlineSearch />
                                              </button>
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                  <Row style={{ height: '54px', marginTop: '15px' }}>
                                    <Col xs={6}>
                                      <Field
                                        disabled={disableEdit}
                                        name="contato_origem"
                                        validate={required}
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
                                        name="celular_origem"
                                        validate={required}
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
                                        name="whats_origem"
                                        component={CssTextField}
                                        type="text"
                                        label="WhatsApp"
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
                                  </Row>
                                  <Row style={{ height: '54px', marginTop: '15px' }}>
                                    <Col xs={6}>
                                      <Field
                                        disabled={disableEdit}
                                        name="email_origem"
                                        component={CssTextField}
                                        type="text"
                                        label="E-mail"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={3}>
                                      <Field
                                        disabled={disableEdit}
                                        name="latitude_origem"
                                        // validate={required}
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
                                        name="longitude_origem"
                                        // validate={required}
                                        component={CssTextField}
                                        type="text"
                                        label="Longitude"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                  </Row>
                                  <Row style={{ height: '54px', marginTop: '15px' }}>
                                    <Col xs={6}>
                                      <Field
                                        disabled={disableEdit}
                                        name="logradouro_origem"
                                        validate={required}
                                        component={CssTextField}
                                        type="text"
                                        label="Endereço"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={2}>
                                      <Field
                                        disabled={disableEdit}
                                        name="numero_origem"
                                        validate={required}
                                        component={CssTextField}
                                        type="text"
                                        label="Número"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={4}>
                                      <Field
                                        disabled={disableEdit}
                                        name="complemento_origem"
                                        component={CssTextField}
                                        type="text"
                                        label="Complemento"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                  </Row>
                                  <Row style={{ height: '54px', marginTop: '15px', marginBottom: '15px' }}>
                                    <Col xs={5}>
                                      <Field
                                        disabled={disableEdit}
                                        name="bairro_origem"
                                        validate={required}
                                        component={CssTextField}
                                        type="text"
                                        label="Bairro"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={5}>
                                      <Field
                                        disabled={disableEdit}
                                        name="cidade_origem"
                                        validate={required}
                                        component={CssTextField}
                                        type="text"
                                        label="Cidade"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={2}>
                                      <Field
                                        disabled={disableEdit}
                                        name="uf_origem"
                                        validate={required}
                                        component={CssTextField}
                                        type="text"
                                        label="UF"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                  </Row>
                                </Grid>
                              </BoxTitulo>
                            </Col>
                            <Col xs={6}>
                              <BoxTitulo bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10} mt={10}>
                                <Grid>
                                  <Row style={{ height: '45px', marginTop: '10px' }}>
                                    <Col xs={8}>
                                      <Texto
                                        size={22} height={24} italic={true} bold={700} font='Arial'
                                        mt={8}
                                        color='#2699FB' shadow={true}>
                                        DESTINO
                                      </Texto>
                                    </Col>
                                    <Col xs={4}>
                                      <Field
                                        disabled={disableEdit}
                                        name="cep_destino"
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
                                              <button
                                                type="button"
                                                disabled={disableEdit}
                                                onClick={() => validaCEP(values.cep_destino, 'D')}
                                                style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
                                              >
                                                <AiOutlineSearch />
                                              </button>
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                  <Row style={{ height: '54px', marginTop: '15px' }}>
                                    <Col xs={6}>
                                      <Field
                                        disabled={disableEdit}
                                        name="contato_destino"
                                        validate={required}
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
                                        name="celular_destino"
                                        validate={required}
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
                                        name="whats_destino"
                                        component={CssTextField}
                                        type="text"
                                        label="WhatsApp"
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
                                  </Row>
                                  <Row style={{ height: '54px', marginTop: '15px' }}>
                                    <Col xs={6}>
                                      <Field
                                        disabled={disableEdit}
                                        name="email_destino"
                                        component={CssTextField}
                                        type="text"
                                        label="E-mail"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={3}>
                                      <Field
                                        disabled={disableEdit}
                                        name="latitude_destino"
                                        // validate={required}
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
                                        name="longitude_destino"
                                        // validate={required}
                                        component={CssTextField}
                                        type="text"
                                        label="Longitude"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                  </Row>
                                  <Row style={{ height: '54px', marginTop: '15px' }}>
                                    <Col xs={6}>
                                      <Field
                                        disabled={disableEdit}
                                        name="logradouro_destino"
                                        validate={required}
                                        component={CssTextField}
                                        type="text"
                                        label="Endereço"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={2}>
                                      <Field
                                        disabled={disableEdit}
                                        name="numero_destino"
                                        validate={required}
                                        component={CssTextField}
                                        type="text"
                                        label="Número"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={4}>
                                      <Field
                                        disabled={disableEdit}
                                        name="complemento_destino"
                                        component={CssTextField}
                                        type="text"
                                        label="Complemento"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                  </Row>
                                  <Row style={{ height: '54px', marginTop: '15px', marginBottom: '15px' }}>
                                    <Col xs={5}>
                                      <Field
                                        disabled={disableEdit}
                                        name="bairro_destino"
                                        validate={required}
                                        component={CssTextField}
                                        type="text"
                                        label="Bairro"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={5}>
                                      <Field
                                        disabled={disableEdit}
                                        name="cidade_destino"
                                        validate={required}
                                        component={CssTextField}
                                        type="text"
                                        label="Cidade"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={2}>
                                      <Field
                                        disabled={disableEdit}
                                        name="uf_destino"
                                        validate={required}
                                        component={CssTextField}
                                        type="text"
                                        label="UF"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                  </Row>
                                </Grid>
                              </BoxTitulo>
                            </Col>
                          </Row>

                          <Row>
                            <Col xs={6}>

                              <Grid>
                              </Grid>

                            </Col>
                          </Row>
                        </Grid>
                      </BoxTitulo>

                    </form>
                  )
                }}
              />

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

export default RotasPedidoModal