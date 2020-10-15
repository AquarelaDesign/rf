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
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { 
  Tooltip, 
  withStyles, 
  MenuItem,
  InputAdornment,
} from '@material-ui/core'

import { FaIcon } from '../../Icone'

import { Grid, Row, Col } from 'react-flexbox-grid'

import { Form, Field } from 'react-final-form'

import "./modal.css"
import api from '../../../services/rf'

import moment from "moment"

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

const numberMask = createNumberMask({
  prefix: '',
  suffix: '',
  thousandsSeparatorSymbol: '.',
  decimalSymbol: ',',
  decimalScale: 2,
  fixedDecimalScale: true,
  requireDecimal: true, 
})

const HistoricoModal = ({ 
  isShowHistorico, 
  hide,
  historicoID,
  motoristaID,
  clienteID,
  operadorID,
  pedidoID, 
  tituloPagID,
  tituloRecID,
  tipoCad, 
  disableEdit, 
  callback 
}) => {
  const [initialValues, setInitialValues] = useState([])

  let submit

  useEffect(() => {
    // console.log('**** HistoricoModal.buscaVeiculo')
    limpaCampos()

    if (historicoID && historicoID > 0 && tipoCad === 'E') {
      buscaHistorico()
    } else if (tipoCad === 'N') {
      limpaCampos()
    } else if (tipoCad === 'D') {
      if (historicoID && historicoID > 0) {
        buscaHistorico()
      }
    }

  }, [historicoID, tipoCad])

  const limpaCampos = () => {
    var newData = {
      motorista_id: motoristaID,
      cliente_id: clienteID,
      operador_id: operadorID,
      pedido_id: pedidoID,
      titulo_pagar_id: tituloPagID,
      titulo_receber_id: tituloRecID,
      observacao: "",
    }
    setInitialValues(newData)
  }

  // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const buscaUsuario = async (userID, tipo) => {
    await api
      .get(`/usuarios/${userID}`)
      .then(response => {
        const { data } = response

        switch (tipo) {
          case 'M': window.setFormValue('motorista', data.nome); break;
          case 'C': window.setFormValue('cliente', data.nome); break;
          case 'O': window.setFormValue('operador', data.nome); break;
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
            console.log('**** HistoricoModal.buscaUsuario.error.data', data)
          }
        } else if (error.request) {
          console.log('**** HistoricoModal.buscaUsuario.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const buscaHistorico = async () => {
    await api
      .get(`/historicos/${historicoID}`)
      .then(response => {
        const { data } = response
        setInitialValues(data)
        if (data.motorista_id && data.motorista_id > 0) { buscaUsuario(data.motorista_id, 'M') }
        if (data.cliente_id && data.cliente_id > 0) { buscaUsuario(data.cliente_id, 'C') }
        if (data.operador_id && data.operador_id > 0) { buscaUsuario(data.operador_id, 'O') }
        // if (pedidoID && pedidoID > 0) { buscaUsuario(pedidoID, 'P') }
        // if (tituloPagID && tituloPagID > 0) { buscaUsuario(tituloPagID, 'G') }
        // if (tituloRecID && tituloRecID > 0) { buscaUsuario(tituloRecID, 'R') }
  
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** HistoricoModal.buscaHistorico.error.data', data)
          }
        } else if (error.request) {
          console.log('**** HistoricoModal.buscaHistorico.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const fechar = async (e) => {
    // console.log('**** HistoricoModal.fechar', e)
    if (callback) {
      // await sleep(1000)
      callback(typeof e === 'object' ? false : e)
      hide()
    }
  }

  async function onSubmit (values) {
    // console.log('**** HistoricoModal.onSubmit-values', values)

    let newValues = {}

    for (var [key, value] of Object.entries(values)) {
      newValues[key] = value
    }

    // let val = values['valor'].replace('.', '')
    //     val = val.replace(',', '.')
    // newValues['valor'] = val

    //console.log('**** HistoricoModal.onSubmit-newValues', newValues)

    let apiParams = {}

    if (historicoID !== null && tipoCad === 'E') {
      apiParams = {
        method: 'put',
        url: `/historicos/${historicoID}`,
        data: JSON.stringify(newValues),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    } else {
      apiParams = {
        method: 'post',
        url: `/historicos`,
        data: JSON.stringify(newValues),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    }
    // console.log('**** HistoricoModal.onSubmit-apiParams', apiParams)

    await api(apiParams, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    .then(response => {
      const { data } = response
      if (response.status !== 200) {
        toast(`Ocorreu um erro no processamento do histórico!`,
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
          console.log('**** HistoricoModal.onSubmit.error.data', data)
        }
      } else if (error.request) {
        console.log('**** HistoricoModal.onSubmit.error', error)
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })

  }

  function formatCurrency(props) {
    const { inputRef, value, ...other } = props

    let val = value
    val = val.toString().replace('.', ',')

    return (
      <MaskedInput
        {...other}
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null);
        }}
        value={val}
        mask={numberMask}
        // displayType={'text'}
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
  
  function formataData(props) {
    let tmpDate = props.value ? props.value : undefined
    let data = tmpDate ? moment(tmpDate).format('DD/MM/YYYY hh:mm:ss') : ""
    return (<span style={{ paddingLeft: '15px', marginTop: '15px', paddingBottom: '10px',  height: '25px' }}>{data}</span>)
  }

  const required = value => (value ? undefined : '* Obrigatório!')

  if (isShowHistorico) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal-historico">
            <Container>
              <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Grid mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      Dados do Histórico
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
                height={'290px'} 
                width={'100%'}
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
                            {values.pedido_id && values.pedido_id > 0 ?
                              <Col xs={2}>
                                <Field
                                  disabled={true}
                                  name="pedido_id"
                                  component={CssTextField}
                                  type="text"
                                  label="Pedido"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                            : null }

                            {values.operador_id && values.operador_id > 0 ?
                              <Col xs={10}>
                                <Field
                                  disabled={true}
                                  name="operador"
                                  component={CssTextField}
                                  type="text"
                                  label="Operador"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                            : null }
                          </Row>

                          {values.motorista_id && values.motorista_id > 0 ?
                            <Row style={{ height: '54px', marginTop: '15px' }}>
                              <Col xs={12}>
                                <Field
                                  disabled={true}
                                  name="motorista"
                                  component={CssTextField}
                                  type="text"
                                  label="Motorista"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                            </Row>
                          : null }

                          {values.cliente_id && values.cliente_id > 0 ?
                            <Row style={{ height: '54px', marginTop: '15px' }}>
                              <Col xs={12}>
                                <Field
                                  disabled={true}
                                  name="cliente"
                                  component={CssTextField}
                                  type="text"
                                  label="Cliente"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                />
                              </Col>
                            </Row>
                          : null }

                          {(values.titulo_pagar_id && values.titulo_pagar_id) > 0 || (values.titulo_receber_id && values.titulo_receber_id > 0) ?
                            <Row style={{ height: '54px', marginTop: '15px' }}>
                              {values.titulo_pagar_id && values.titulo_pagar_id > 0 ?
                                <Col xs={6}>
                                  <Field
                                    disabled={true}
                                    name="titulopag"
                                    component={CssTextField}
                                    type="text"
                                    label="Título à Pagar"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    margin="dense"
                                  />
                                </Col>
                              : null }

                              {values.titulo_receber_id && values.titulo_receber_id > 0 ?
                                <Col xs={6}>
                                  <Field
                                    disabled={true}
                                    name="titulorec"
                                    component={CssTextField}
                                    type="text"
                                    label="Título à Receber"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    margin="dense"
                                  />
                                </Col>
                              : null }

                              <Col xs={6}>
                                <Field
                                  disabled={true}
                                  name="valor"
                                  component={CssTextField}
                                  type="text"
                                  label="Valor"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                  InputProps={{
                                    inputComponent: formatCurrency,
                                  }}
                                />
                              </Col>
                            </Row>
                          : null }

                          <Row style={{ height: '130px', marginTop: '15px' }}>
                            <Col xs={12}>
                              <Field
                                disabled={true}
                                name="observacao"
                                component={CssTextField}
                                type="text"
                                label="Observação"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                multiline={true}
                                rows={5}
                              />
                            </Col>
                          </Row>

                          <Row style={{ height: '64px' }}>
                            <Col xs={6}>
                              <Field
                                disabled={true}
                                name="created_at"
                                component={CssTextField}
                                type="text"
                                label="Data da Criação"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                InputProps={{
                                  inputComponent: formataData,
                                }}
                              />
                            </Col>
                            <Col xs={6}>
                              <Field
                                disabled={true}
                                name="updated_at"
                                component={CssTextField}
                                type="text"
                                label="Última Atualização"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                InputProps={{
                                  inputComponent: formataData,
                                }}
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

export default HistoricoModal