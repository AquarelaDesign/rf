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
// import { makeStyles } from '@material-ui/core/styles'

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

const tipos = [
  { value: 'C', label: 'Coleta' },
  { value: 'E', label: 'Entrega' },
]

const cadStatus = [
  { Id: 1, Code: 'D', Description: 'Aguardando Coleta' },
  { Id: 2, Code: 'C', Description: 'Coletando' },
  { Id: 3, Code: 'A', Description: 'A Caminho' },
  { Id: 4, Code: 'E', Description: 'Entregue' },
]

const RotasModal = ({ isShowRotas, hide, pedidoID, rotaID, tipoCad, disableEdit, callback }) => {
  const [initialValues, setInitialValues] = useState([])
  const { isShowing, toggleGridUsuarios } = useModalUsuarios()
  
  const [atualizaCEP, setAtualizaCEP] = useState(false)
  const [ultimoCep, setUltimoCep] = useState('')
  
  let submit

  useEffect(() => {
    limpaCampos()

    // console.log('**** RotasModal.buscaRota')
    const buscaRota = async () => {
      await api
        .get(`/rotas/${rotaID}`)
        .then(response => {
          const { data } = response

          data.tipo = data.tipo === "V" ? true : false
          // console.log('**** RotasModal.buscaRota.data', data)
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
              console.log('**** RotasModal.buscaRota.error.data', data)
            }
          } else if (error.request) {
            console.log('**** RotasModal.buscaRota.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }

    // console.log('**** RotasModal', rotaID, tipoCad)

    if (rotaID && rotaID > 0 && tipoCad === 'E') {
      // setDisableEdit(false)
      buscaRota()
    } else if (tipoCad === 'N') {
      limpaCampos()
    } else if (tipoCad === 'D') {
      if (rotaID && rotaID > 0) {
        buscaRota()
      }
    }

    return () => {
      limpaCampos()
    }

  }, [rotaID, pedidoID, tipoCad])

  // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const limpaCampos = () => {
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
      status: "D",
    }
    setInitialValues(newData)
  }

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
          // console.log('**** RotasModal.buscaCliente.data', data)
          /*
          setInitialValues({ 
            ...initialValues, 
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
          */

          window.setFormValue('cpfcnpj', data.cpfcnpj)
          window.setFormValue('nome', data.nome)
          window.setFormValue('logradouro', data.logradouro)
          window.setFormValue('numero', data.numero)
          window.setFormValue('complemento', data.complemento)
          window.setFormValue('bairro', data.bairro)
          window.setFormValue('cidade', data.cidade)
          window.setFormValue('uf', data.uf)
          window.setFormValue('pais', data.pais)
          window.setFormValue('cep', data.cep)
          window.setFormValue('contato', data.contato)
          window.setFormValue('celular', data.celular)
          window.setFormValue('telefone', data.telefone)
          window.setFormValue('whats', data.whats)
          window.setFormValue('email', data.email)

        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** RotasModal.buscaCliente.error.data', data)
            }
          } else if (error.request) {
            console.log('**** RotasModal.buscaCliente.error', error)
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

  const validaCEP = async (value) => {
    setAtualizaCEP(true)

    // console.log('**** RotasModal.validaCEP.values', value, values.logradouro)

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

    // console.log('**** RotasModal.validaCEP.Axios.service', service)

    Axios.get(service, {})
      .then(response => {
        const { data } = response.data
        if (response.data.error) {
          // toast(response.data.message, { type: 'error' })
          toast('O CEP informado não foi encontrado', { type: 'error' })
          setAtualizaCEP(false)
          return
        }

        // console.log('**** RotasModal.validaCEP.Axios.data', data)

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
          window.setFormValue('latitude', data[0].data[0].geo.latitude)
          window.setFormValue('longitude', data[0].data[0].geo.longitude)
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
            console.log('**** RotasModal.validaCEP.error.data', data)
          }
        } else if (error.request) {
          console.log('**** RotasModal.validaCEP.error.data', error)
        } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
        setAtualizaCEP(false)
      })
  }
  
  const fechar = async (e) => {
    // console.log('**** RotasModal.fechar', e)
    if (callback) {
      // await sleep(1000)
      callback(typeof e === 'object' ? false : e)
      limpaCampos()
      hide()
    }
  }

  async function onSubmit (values) {
    if (atualizaCEP) {
      return
    }

    // console.log('**** RotasModal.onSubmit-values', values)

    values.cpfcnpj = clearNumber(values.cpfcnpj)
    values.celular = clearNumber(values.celular)
    values.whats = clearNumber(values.whats)
    values.cep = clearNumber(values.cep)

    values.tipo = values.tipo === true ? "V" : null

    let apiParams = {}
    if (rotaID !== null && tipoCad === 'E') {
      apiParams = {
        method: 'put',
        url: `/rotas/${rotaID}`,
        data: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    } else {
      apiParams = {
        method: 'post',
        url: `/rotas`,
        data: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    }
    
    // console.log('**** RotasModal.onSubmit-apiParams', apiParams)
    const cidade = values.cidade

    await api(apiParams, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    .then(response => {
      const { data } = response
      if (response.status !== 200) {
        toast(`Ocorreu um erro no processamento da rota [${cidade}]!`,
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
          console.log('**** RotasModal.onSubmit.error.data', data)
        }
      } else if (error.request) {
        console.log('**** RotasModal.onSubmit.error', error)
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
          <div className="modal-rotas">
            <Container>
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
                height={'370px'} width={'100%'}
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
                            <Col xs={3}>
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
                            <Col xs={3}>
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
                                      <button 
                                        type="button" 
                                        disabled={disableEdit}
                                        onClick={() => validaCEP(values.cep)}
                                        style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
                                      >
                                        <AiOutlineSearch />
                                      </button>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Col>
                            <Col xs={2}>
                            <label>
                              <Field
                                disabled={disableEdit}
                                name="tipo"
                                component="input"
                                type="checkbox"
                                // value="F"
                                // validate={valTipoCadastro}
                              />{' '}
                              Exclusivo?
                            </label>
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
                            <Col xs={6}>
                              <Field
                                disabled={disableEdit}
                                name="contato"
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
                          </Row>
                          <Row style={{ height: '54px', marginTop: '15px' }}>
                            <Col xs={6}>
                              <Field
                                disabled={disableEdit}
                                name="email"
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
                                name="celular"
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
                                name="whats"
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
                                name="logradouro"
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
                                name="numero"
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
                          </Row>
                          <Row style={{ height: '54px', marginTop: '15px' }}>
                            <Col xs={5}>
                              <Field
                                disabled={disableEdit}
                                name="bairro"
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
                                name="cidade"
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
                                name="uf"
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
                          
                          <Row style={{ height: '54px', marginTop: '15px' }}>
                          <Col xs={3}>
                              <Field
                                disabled={disableEdit}
                                name="latitude"
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
                                name="longitude"
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