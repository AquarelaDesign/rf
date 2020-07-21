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
  Botao,
  Blank,
} from '../CardUsuario/styles'
import { makeStyles } from '@material-ui/core/styles'

import { Tooltip, withStyles } from '@material-ui/core'
import { FaIcon } from '../../Icone'

import { Grid, Row, Col } from 'react-flexbox-grid'
import { Form, Field } from 'react-final-form'

import {
  TextField,
} from 'final-form-material-ui'

import Upload from '../CardUsuario/upload'
import DatePicker from '../CardUsuario/datepicker'

import "./modal.css"
import api from '../../../services/rf'

const useStyles = makeStyles((theme) => ({
  botoes: {
    position: 'absolute',
    top: 7,
    right: 58,
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

const DocsModal = ({ isShowDocs, hide, userID, veiculoID }) => {
  const classes = useStyles()

  const [veiculo, setVeiculo] = useState([])

  useEffect(() => {
    const buscaVeiculo = async () => {
      await api
        .get(`/veiculosm/${veiculoID}`)
        .then(response => {
          const { data } = response
          setVeiculo(data)
        }).catch((error) => {
          if (error.response) {
            console.error('*** bv-1.1', error)
          } else if (error.request) {
            console.error('*** bv-1.2', error)
          } else {
            console.error('*** bv-1.3')
          }
        })
    }

    if (veiculoID && veiculoID > 0) {
      buscaVeiculo()
    }
  
  },[veiculoID])

  const onSubmit = async (values) => {
    console.log('*** onSubmit', values)
    hide()

    let newValues = {}
    for (let key in values) {
      if (values[key] && typeof values[key] === 'string') {
        if (
          key !== 'habilitacaoimg' && 
          key !== 'ANTTimg' && 
          key !== 'cavaloimg' && 
          key !== 'carretaimg'
        ) {
          newValues[key] = values[key].toUpperCase()
        } else {
          newValues[key] = values[key]
        }
    } else {
        newValues[key] = values[key]
      }
    }

    console.log('*** newValues', JSON.stringify(newValues))
    if (values) {
      await api.put(`/veiculosm/${veiculoID}`,
        JSON.stringify(newValues),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      )
      .then(response => {
        // const { data } = response
        toast(response.status === 200
          ? 'Veículo atualizado com sucesso!'
          : response.data[0].message,
          { type: response.status === 200 ? 'success' : 'error' })
      }).catch((error) => {
        console.log('*** error', error)
        // toast('Ocorreu um erro no envio dos dados do Veículo!', { type: 'error' })
      })
    }
  }

  const required = value => (value ? undefined : '*Campo obrigatório!')

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
                      {`Documentos do Veículo [${veiculo.placachassi}]`}
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                    <Tooltip title="Fechar Janela">
                      <Botao onClick={hide}><FaIcon icon='GiExitDoor' size={20} /> </Botao>
                    </Tooltip>
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
                      </div>

                      <div style={{ paddingTop: '15px', paddingBottom: '20px', height: '100%', backgroundColor: '#FFFFFF' }}>
                        <Grid fluid style={{ marginTop: '15px', height: '100%' }}>
                          <Row>
                            <Col xs={3}>
                              <div style={{ border: '1px dashed #ddd', padding: '5px' }}>
                                <Grid fluid>
                                  <Row>
                                    <Col xs={12}>
                                      <Field
                                        name="habilitacaoimg"
                                        userID={userID}
                                      >
                                        {props => (
                                          <div>
                                            <Upload {...props} />
                                          </div>
                                        )}
                                      </Field>
                                    </Col>
                                  </Row>
                                  <Row style={{height: '65px' }}>
                                    <Col xs={12}>
                                      <Field
                                        name="habilitacao"
                                        validate={required}
                                        message="Informe o Número da CNH"
                                        component={CssTextField}
                                        type="text"
                                        label="Habilitação"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      ></Field>
                                    </Col>
                                  </Row>
                                  <Row style={{height: '65px' }}>
                                    <Col xs={12}>
                                      <Field
                                        label="Vencimento"
                                        name="habilitacaovct"
                                        validate={required}
                                        message="Informe a Data de Vencimento da CNH"
                                        variant="outlined"
                                        type="text"
                                      >
                                        {props => (
                                          <div>
                                            <DatePicker {...props} />
                                          </div>
                                        )}
                                      </Field>
                                    </Col>
                                  </Row>
                                </Grid>
                              </div>
                            </Col>
                            <Col xs={3}>
                              <div style={{ border: '1px dashed #ddd', padding: '5px' }}>
                                <Grid fluid>
                                  <Row>
                                    <Col xs={12}>
                                      <Field
                                        name="ANTTimg"
                                        userID={userID}
                                      >
                                        {props => (
                                          <div>
                                            <Upload {...props} />
                                          </div>
                                        )}
                                      </Field>
                                    </Col>
                                  </Row>
                                  <Row style={{height: '65px' }}>
                                    <Col xs={12}>
                                      <Field
                                        name="ANTT"
                                        validate={required}
                                        message="Informe o Número da ANTT"
                                        component={CssTextField}
                                        type="text"
                                        label="ANTT"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      ></Field>
                                    </Col>
                                  </Row>
                                  <Row style={{height: '65px' }}>
                                    <Col xs={12}>
                                      <Field
                                        label="Vencimento"
                                        name="ANTTvct"
                                        validate={required}
                                        message="Informe a Data de Vencimento da ANTT"
                                        variant="outlined"
                                        type="text"
                                      >
                                        {props => (
                                          <div>
                                            <DatePicker {...props} />
                                          </div>
                                        )}
                                      </Field>
                                      </Col>
                                  </Row>
                                </Grid>
                              </div>
                            </Col>
                            <Col xs={3}>
                              <div style={{ border: '1px dashed #ddd', padding: '5px' }}>
                                <Grid fluid>
                                  <Row>
                                    <Col xs={12}>
                                      <Field
                                  name="cavaloimg"
                                  userID={userID}
                                >
                                  {props => (
                                    <div>
                                      <Upload {...props} />
                                    </div>
                                  )}
                                </Field>
                                    </Col>
                                  </Row>
                                  <Row style={{height: '65px' }}>
                                    <Col xs={12}>
                                      <Field
                                        name="cavalo"
                                        validate={required}
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
                                  <Row style={{height: '65px' }}>
                                    <Col xs={12}>
                                      <Field
                                        label="Vencimento"
                                        name="cavalovct"
                                        validate={required}
                                        message="Informe a Data de Vencimento do Cavalo"
                                        variant="outlined"
                                        type="text"
                                      >
                                        {props => (
                                          <div>
                                            <DatePicker {...props} />
                                          </div>
                                        )}
                                      </Field>
                                    </Col>
                                  </Row>
                                </Grid>
                              </div>
                            </Col>
                            <Col xs={3}>
                              <div style={{ border: '1px dashed #ddd', padding: '5px' }}>
                                <Grid fluid>
                                  <Row>
                                    <Col xs={12}>
                                      <Field
                                  name="carretaimg"
                                  userID={userID}
                                >
                                  {props => (
                                    <div>
                                      <Upload {...props} />
                                    </div>
                                  )}
                                </Field>
                                    </Col>
                                  </Row>
                                  <Row style={{height: '65px' }}>
                                    <Col xs={12}>
                                      <Field
                                  name="carreta"
                                  validate={required}
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
                                  <Row style={{height: '65px' }}>
                                    <Col xs={12}>
                                      <Field
                                  label="Vencimento"
                                  name="carretavct"
                                  validate={required}
                                  message="Informe a Data de Vencimento do Carreta"
                                  variant="outlined"
                                  type="text"
                                >
                                  {props => (
                                    <div>
                                      <DatePicker {...props} />
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
                      {/* {console.log('*** DocModa_hide', hide, values)} */}
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