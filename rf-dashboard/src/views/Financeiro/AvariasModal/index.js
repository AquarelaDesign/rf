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

import {
  TextField,
} from 'final-form-material-ui'

import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
// import { makeStyles } from '@material-ui/core/styles'

import { 
  Tooltip, 
  withStyles, 
  MenuItem,
  InputAdornment,
} from '@material-ui/core'

import { FaIcon } from '../../../components/Icone'

import { Grid, Row, Col } from 'react-flexbox-grid'

import { Form, Field } from 'react-final-form'
// import DatePicker from '../../datepicker'
import { AiOutlineSearch } from 'react-icons/ai'

import "./modal.css"
import api from '../../../services/rf'
import Axios from 'axios'
import { values } from 'lodash'

import GridUsuariosModal from '../../Cadastro/GridUsuariosModal'
import useModalUsuarios from '../../Cadastro/GridUsuariosModal/useModal'

// import exclusive from '../../../assets/logo-exclusive.png'
// import exclusive_pb from '../../../assets/logo-exclusive-pb.png'
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

const cadStatus = [
  { Id: 1, Code: 'A', Description: 'Em Analise' },
  { Id: 2, Code: 'R', Description: 'Em Reparo' },
  { Id: 3, Code: 'L', Description: 'Liberado' },
  { Id: 4, Code: 'F', Description: 'Fechado' },
]

const AvariasModal = ({ isShowAvarias, hide, pedidoID, placa, avariaID, tipoCad, disableEdit, callback }) => {
  const [initialValues, setInitialValues] = useState([])
  const [fornecedor, setFornecedor] = useState([])
  const { isShowing, toggleGridUsuarios } = useModalUsuarios()
  const [atualiza, setAtualiza] = useState(true)
  
  let submit

  useEffect(() => {
    limpaCampos()

    // console.log('**** AvariasModal.avariaID', avariaID)
    const buscaAvaria = async () => {
      await api
        .get(`/avarias/${avariaID}`)
        .then(response => {
          const { data } = response

          if (data.fornecedor_id !== null && data.fornecedor_id !== undefined) {
            buscaCliente(data.fornecedor_id)
          }

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
              console.log('**** AvariasModal.buscaAvaria.error.data', data)
            }
          } else if (error.request) {
            console.log('**** AvariasModal.buscaAvaria.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }

    // console.log('**** AvariasModal', avariaID, tipoCad)
    if (avariaID && avariaID > 0 && tipoCad === 'E') {
      // setDisableEdit(false)
      buscaAvaria()
    } else if (tipoCad === 'N') {
      limpaCampos()
    } else if (tipoCad === 'D') {
      if (avariaID && avariaID > 0) {
        buscaAvaria()
      }
    }

    return () => {
      limpaCampos()
    }

  }, [avariaID, pedidoID, tipoCad, atualiza])

  // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const limpaCampos = () => {
    var newData = {
      pedido_id: pedidoID,
      financeiro_id: "",
      fornecedor_id: "",
      placa: "",
      descricao: "",
      valor: "",
      status: "",
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
          console.log('**** AvariasModal.buscaCliente.data', data)

          setFornecedor(data)
          window.setFormValue('cpfcnpj', data.cpfcnpj)
          window.setFormValue('nome', data.nome)
          window.setFormValue('contato', data.contato)
          window.setFormValue('telefone', data.telefone)
          window.setFormValue('whats', data.whats)
          window.setFormValue('email', data.email)

          if (data.celular === null && data.whats !== null) {
            window.setFormValue('celular', data.whats)
          } else {
            window.setFormValue('celular', data.celular)
          }

        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** AvariasModal.buscaCliente.error.data', data)
            }
          } else if (error.request) {
            console.log('**** AvariasModal.buscaCliente.error', error)
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
  
  const fechar = async (e) => {
    // console.log('**** AvariasModal.fechar', e)
    if (callback) {
      // await sleep(1000)
      callback(typeof e === 'object' ? false : e)
      limpaCampos()
      setAtualiza(!atualiza)
      hide()
    }
  }

  async function onSubmit (values) {
    // console.log('**** AvariasModal.onSubmit-values-0', values)
    
    values.cpfcnpj = clearNumber(values.cpfcnpj)
    values.celular = clearNumber(values.celular)
    values.whats = clearNumber(values.whats)

    console.log('**** AvariasModal.values.valor', values['valor'])
    if (values['valor']) {
      let val = values['valor'].toString()
          val = val.replace('.', '')
          val = val.replace(',', '.')
      values.valor = parseFloat(val).toFixed(2)
    }

    // console.log('**** AvariasModal.onSubmit-values-1', values)
    let apiParams = {}
    if (avariaID !== null && tipoCad === 'E') {
      apiParams = {
        method: 'put',
        url: `/avarias/${avariaID}`,
        data: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    } else {
      apiParams = {
        method: 'post',
        url: `/avarias`,
        data: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    }
    
    await api(apiParams, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    .then(response => {
      const { data } = response
      if (response.status !== 200) {
        toast(`Ocorreu um erro no processamento da avaria [${placa}]!`,
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
          console.log('**** AvariasModal.onSubmit.error.data', data)
        }
      } else if (error.request) {
        console.log('**** AvariasModal.onSubmit.error', error)
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
    
  }

  const required = value => (value ? undefined : '* Obrigatório!')

  // const checkExclusive = (props) => {
  //   return <Checkbox icon={<exclusive_pb />} checkedIcon={<exclusive />} {...props} />
  // }

  if (isShowAvarias) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal-avarias">
            <Container>
              <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Grid mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      {`Dados da Avaria Veículo [${placa}]`}
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
                                initialValue={fornecedor.cpfcnpj}
                                value={fornecedor.cpfcnpj}
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
                                name="valor"
                                component={CssTextField}
                                type="text"
                                label="Valor Pago"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                InputProps={{
                                  inputComponent: formatCurrency,
                                }}
                              />
                            </Col>

                            <Col xs={6}>
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
                                disabled={true}
                                name="nome"
                                validate={required}
                                component={CssTextField}
                                type="text"
                                label="Nome"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                initialValue={fornecedor.nome}
                                value={fornecedor.nome}
                              />
                            </Col>

                            <Col xs={6}>
                              <Field
                                disabled={true}
                                name="contato"
                                // validate={required}
                                component={CssTextField}
                                type="text"
                                label="Contato"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                initialValue={fornecedor.contato}
                                value={fornecedor.contato}
                              />
                            </Col>
                          </Row>
                          
                          <Row style={{ height: '54px', marginTop: '15px' }}>
                            <Col xs={6}>
                              <Field
                                disabled={true}
                                name="email"
                                component={CssTextField}
                                type="text"
                                label="E-mail"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                initialValue={fornecedor.email}
                                value={fornecedor.email}
                              />
                            </Col>

                            <Col xs={3}>
                              <Field
                                disabled={true}
                                name="celular"
                                // validate={required}
                                component={CssTextField}
                                type="text"
                                label="Celular"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                initialValue={fornecedor.celular}
                                value={fornecedor.celular}
                                pattern="[\d|(|)|-]{11,12}"
                                InputProps={{
                                  inputComponent: formatCelular,
                                }}
                              />
                            </Col>
                            <Col xs={3}>
                              <Field
                                disabled={true}
                                name="whats"
                                component={CssTextField}
                                type="text"
                                label="WhatsApp"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                initialValue={fornecedor.whats}
                                value={fornecedor.whats}
                                pattern="[\d|(|)|-]{11,12}"
                                InputProps={{
                                  inputComponent: formatCelular,
                                }}
                              />
                            </Col>
                          </Row>
                          
                          <Row style={{ height: '120px', marginTop: '15px' }}>
                            <Col xs={12}>
                              <Field
                                disabled={disableEdit}
                                name="descricao"
                                validate={required}
                                component={CssTextField}
                                type="text"
                                label="Descrição"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                multiline
                                rows={4}                                
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
              tipoConsulta='F'
              callFind={callBackCliente}
            />
          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default AvariasModal