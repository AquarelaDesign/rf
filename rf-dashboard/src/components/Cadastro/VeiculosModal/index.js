/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Container,
  BoxTitulo,
  Texto,
  RLeft,
  RRight,
  Blank,
} from '../CardUsuario/styles'
import { makeStyles } from '@material-ui/core/styles'

import { Tooltip, withStyles, MenuItem } from '@material-ui/core'
import { FaIcon } from '../../Icone'

import { Grid, Row, Col } from 'react-flexbox-grid'
import { Form, Field } from 'react-final-form'

import {
  TextField,
} from 'final-form-material-ui'

import Upload from '../CardUsuario/uploadNew'
import DatePicker from '../../datepicker'

import "./modal.css"
import api from '../../../services/rf'

import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  botoes: {
    position: 'absolute',
    top: 12,
    right: 5,
  },
}))

const CssTextField = withStyles({
  root: {
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

const VeiculosModal = ({ isShowVeiculos, hide, pedidoID, veiculoID, tipo, disabled, callback }) => {
  const ref = React.createRef()
  const classes = useStyles()

  const [veiculo, setVeiculo] = useState([])
  const [disableEdit, setDisableEdit] = useState(disabled)

  useEffect(() => {
    const buscaVeiculo = async () => {
      await api
        .get(`/veiculos/${veiculoID}`)
        .then(response => {
          const { data } = response
          setVeiculo(data)
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
              console.log('*** data', data.message)
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
      setVeiculo(newData)
    } else if (tipo === 'D') {
      setDisableEdit(true)
      if (veiculoID && veiculoID > 0) {
        buscaVeiculo()
      }
    }

  }, [veiculoID, pedidoID, tipo])

  const onSubmit = async (values) => {
    if (values.cavalovct === "") {
      toast(`Informe a Data de Vencimento do Cavalo!`, { type: 'error' })
      return
    }

    let newValues = {}
    for (let key in values) {
      if (key === 'placachassi') {
        newValues[key] = values[key].toUpperCase()
      } else if (
        key === 'habilitacaovct' ||
        key === 'ANTTvct' ||
        key === 'cavalovct' ||
        key === 'carretavct'
      ) {
        if (values[key]) {
          newValues[key] = moment(values[key]).format('YYYY-MM-DD')
        } else {
          newValues[key] = values[key]
        }
      } else {
        newValues[key] = values[key]
      }
    }

    let apiParams = {}
    if (veiculoID) {
      apiParams = {
        url: `/veiculosm/${veiculoID}`,
        method: 'put',
        data: newValues
      }
    } else {
      delete newValues['id']
      apiParams = {
        url: `/veiculosm`,
        method: 'post',
        data: newValues
      }
    }

    if (newValues) {
      const placa = newValues.placachassi

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
          
          setVeiculo(data)
          fechar()

        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('*** error data', data)
            }
          } else if (error.request) {
            toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
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


  const required = value => (value ? undefined : '* Obrigatório!')

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
                      {veiculo.placachassi ? `Dados do Veículo [${veiculo.placachassi}]` : 'Dados do Veículo'}
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                  </RRight>
                </Grid>
              </BoxTitulo>

              <Form
                onSubmit={onSubmit}
                initialValues={veiculo}
                validate={required}
                render={({
                  handleSubmit,
                  form,
                  submitting,
                  pristine,
                  values,
                  props,
                }) => {
                  return (
                    <form onSubmit={handleSubmit} >

                      <div className={classes.botoes}>
                        {!disableEdit &&
                          <button type="submit"
                            style={{ backgroundColor: 'transparent' }}
                          >
                            <Tooltip title="Salvar">
                              <span style={{
                                alignItems: 'center',
                                color: '#0000FF',
                                cursor: 'pointer',
                                marginTop: '3px',
                              }}>
                                <FaIcon icon='Save' size={20} />
                              </span>
                            </Tooltip>
                          </button>
                        }

                        <button type="button"
                          onClick={hide}
                          style={{ backgroundColor: 'transparent' }}
                        >
                          <Tooltip title="Fechar Janela">
                            <span style={{
                              alignItems: 'center',
                              cursor: 'pointer',
                              marginTop: '3px',
                            }}>
                              <FaIcon icon='GiExitDoor' size={20} />
                            </span>
                          </Tooltip>
                        </button>

                      </div>

                      <div style={{ paddingTop: '15px', paddingBottom: '20px', height: '100%', backgroundColor: '#FFFFFF' }}>
                        <Grid fluid style={{ marginTop: '15px', height: '100%' }}>
                          <Row style={{ minHeight: '65px' }}>
                            <Col xs={4}>
                              <Field
                                name="placachassi"
                                component={CssTextField}
                                validate={required}
                                disabled={disableEdit}
                                type="text"
                                label="Placa/Chassi"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                inputProps={{
                                  inputProps: { maxLength: 7 },
                                }}
                              />
                            </Col>
                            <Col xs={8}>
                              <Field
                                name="modelo"
                                component={CssTextField}
                                validate={required}
                                disabled={disableEdit}
                                type="text"
                                label="Modelo"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={4}>
                              <Field
                                name="estado"
                                component={CssTextField}
                                validate={required}
                                disabled={disableEdit}
                                type="select"
                                label="Estado"
                                variant="outlined"
                                fullWidth
                                select
                                size="small"
                                margin="dense"
                              >
                                <MenuItem value="CARRETA">CARRETA</MenuItem>
                                <MenuItem value="CAVALO">CAVALO</MenuItem>
                                <MenuItem value="PLATAFORMA">PLATAFORMA</MenuItem>
                              </Field>
                            </Col>

                          </Row>
                          <Row>
                            <Col xs={12}>
                            </Col>
                          </Row>
                        </Grid>
                      </div>
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