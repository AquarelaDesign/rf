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

import Upload from '../CardUsuario/upload'
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

const DocsModal = ({ isShowDocs, hide, userID, veiculoID, tipo, disabled, callback }) => {
  const ref = React.createRef()
  const classes = useStyles()

  const [veiculo, setVeiculo] = useState([])
  const [disableEdit, setDisableEdit] = useState(disabled)

  useEffect(() => {
    const buscaVeiculo = async () => {
      await api
        .get(`/veiculosm/${veiculoID}`)
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
            toast(`Ocorreu um erro no processamento!`, { type: 'error' })
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
        placachassi: "",
        modelo: "",
        ano: null,
        tipo: "CARRETA",
        vagas: 11,
        usuario_id: userID,
        cavalo: "",
        cavaloimg: "",
        cavalovct: "",
        carreta: "",
        carretaimg: "",
        carretavct: "",
      }
      setVeiculo(newData)
    } else if (tipo === 'D') {
      setDisableEdit(true)
      if (veiculoID && veiculoID > 0) {
        buscaVeiculo()
      }
    }

  }, [veiculoID, userID, tipo])

  const onSubmit = async (values) => {
    if (values.cavalovct === "") {
      toast(`Informe a Data de Vencimento do Cavalo!`, { type: 'error' })
      return
    }

    // if (values.carretavct === "") {
    //   toast(`Informe a Data de Vencimento da Carreta!`, { type: 'error' })
    //   return
    // }

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
            toast(`Ocorreu um erro no processamento!`, { type: 'error' })
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

  if (isShowDocs) {
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
                    <form onSubmit={handleSubmit} noValidate>

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
                            <Col xs={4}>
                              <Field
                                name="tipo"
                                component={CssTextField}
                                validate={required}
                                disabled={disableEdit}
                                type="select"
                                label="Tipo"
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
                            <Col xs={4}>
                              <Field
                                name="vagas"
                                component={CssTextField}
                                validate={required}
                                disabled={disableEdit}
                                type="text"
                                label="Vagas"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={6}>
                              <div style={{ border: '1px dashed #ddd', padding: '5px' }}>
                                <Grid fluid>
                                  <Row>
                                    <Col xs={12}>
                                      <Field
                                        name="cavaloimg"
                                        userID={userID}
                                        disabled={disableEdit}
                                        >
                                        {props => (
                                          <div>
                                            <Upload {...props} />
                                          </div>
                                        )}
                                      </Field>
                                    </Col>
                                  </Row>
                                  <Row style={{ height: '65px' }}>
                                    <Col xs={12}>
                                      <Field
                                        name="cavalo"
                                        validate={required}
                                        disabled={disableEdit}
                                        message="Informe o Número da Cavalo"
                                        component={CssTextField}
                                        type="text"
                                        label="Cavalo"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      ></Field>
                                    </Col>
                                  </Row>
                                  <Row style={{ height: '65px' }}>
                                    <Col xs={12}>
                                      <Field
                                        label="Vencimento"
                                        name="cavalovct"
                                        validate={required}
                                        disabled={disableEdit}
                                        message="Informe a Data de Vencimento do Cavalo"
                                        variant="outlined"
                                        type="text"
                                      >
                                        {props => (
                                          <div>
                                            <DatePicker ref={ref} {...props} />
                                          </div>
                                        )}
                                      </Field>
                                    </Col>
                                  </Row>
                                </Grid>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <div style={{ border: '1px dashed #ddd', padding: '5px' }}>
                                <Grid fluid>
                                  <Row>
                                    <Col xs={12}>
                                      <Field
                                        name="carretaimg"
                                        userID={userID}
                                        disabled={disableEdit}
                                        >
                                        {props => (
                                          <div>
                                            <Upload {...props} />
                                          </div>
                                        )}
                                      </Field>
                                    </Col>
                                  </Row>
                                  <Row style={{ height: '65px' }}>
                                    <Col xs={12}>
                                      <Field
                                        name="carreta"
                                        // validate={required}
                                        disabled={disableEdit}
                                        message="Informe o Número da Carreta"
                                        component={CssTextField}
                                        type="text"
                                        label="Carreta"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      ></Field>
                                    </Col>
                                  </Row>
                                  <Row style={{ height: '65px' }}>
                                    <Col xs={12}>
                                      <Field
                                        label="Vencimento"
                                        name="carretavct"
                                        // validate={required}
                                        disabled={disableEdit}
                                        message="Informe a Data de Vencimento do Carreta"
                                        variant="outlined"
                                        type="text"
                                      >
                                        {props => (
                                          <div>
                                            <DatePicker ref={ref} {...props} />
                                          </div>
                                        )}
                                      </Field>
                                    </Col>
                                  </Row>
                                </Grid>
                              </div>
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

export default DocsModal