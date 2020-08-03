/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import {
  Container,
  BoxTitulo,
  Texto,
  RLeft,
  RRight,
  // Botao,
  GridModal,
  // Blank,
} from './styles'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Tooltip,} from '@material-ui/core'
import { FaIcon } from '../../Icone'

import "./modal.css"

import api from '../../../services/rf'

import { makeStyles } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/core'

import { Grid, Row, Col } from 'react-flexbox-grid'
import { Form, Field } from 'react-final-form'

import {
  TextField
} from 'final-form-material-ui'

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

const UserModal = ({ isShowUser, hide, userID }) => {
  const classes = useStyles()

  const [novo, setNovo] = useState(true)
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
  const [user, setUser] = useState({
    id: null,
    username: "",
    email: "",
    password: "",
    password1: "",
    usuario_id: null
  })

  useEffect(() => {
    if (userID) {
      buscaUsuario()
    } else {
      toast(`O registro do usuário ainda não foi criado, por favor salve o registro e tente novamente!`, { type: 'error' })
      hide()
    }
  }, [userID])

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const buscaUsuario = async () => {
    if (userID) {
      await api
        .get(`/usuarios/${userID}`)
        .then(response => {
          const { data } = response
          
          setUser({
            id: data.id,
            username: data.nome,
            email: data.email,
            password: "",
            password1: "",
            usuario_id: userID
          })
          setNovo(false)

        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('*** data', data)
            }
          } else if (error.request) {
            toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  const onSubmit = async (values) => {
    if (values.password !== values.password1) {
      toast('As senhas informadas não são iguais!', { type: 'error' })
      return
    }

    let apiParams = {}
    if (novo) {
      apiParams = {
        url: `/users`,
        method: 'post',
        data: values
      }
    } else {
      apiParams = {
        url: `/users/${values.id}`,
        method: 'put',
        data: values
      }
    } 

    delete values['id']
    delete values['password1']

    if (values) {
      await api(apiParams, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      .then(response => {
        if (response.status !== 200) {
          toast(`Ocorreu um erro ao atualizar os dados!`, {type: 'error'})
          return
        } 
        if (novo) {
          toast(`Acesso Liberado!`, {type: 'success'})
        } else {
          toast(`Dados Atualizados!`, {type: 'success'})
        }
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

  const fechar = async () => {
    await sleep(1000)
    hide()
  }

  const required = value => (value ? undefined : '* Obrigatório!')

  if (isShowUser) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal-user">
            <Container>
              <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <GridModal mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      {novo ? 'LIBERAÇÃO DE ACESSO' : 'ALTERAÇÃO DA SENHA'}
                    </Texto>
                  </RLeft>
                  <RRight>
                    {/* <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank> */}
                    {/* <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank> */}
                    {/* <Tooltip title="Fechar Janela">
                      <Botao onClick={hide}><FaIcon icon='GiExitDoor' size={20} /> </Botao>
                    </Tooltip> */}
                  </RRight>
                </GridModal>
              </BoxTitulo>

              <Form
                onSubmit={onSubmit}
                initialValues={user}
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
                            <Col xs={12}>
                              <Field
                                name="username"
                                component={CssTextField}
                                // validate={required}
                                type="text"
                                label="Usuário"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                disabled={true}
                              />
                            </Col>
                          </Row>
                          <Row style={{ minHeight: '65px' }}>
                            <Col xs={12}>
                              <Field
                                name="email"
                                component={CssTextField}
                                // validate={required}
                                type="text"
                                label="Email"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                disabled={true}
                              />
                            </Col>
                          </Row>
                          <Row style={{ minHeight: '65px' }}>
                            <Col xs={6}>
                              <Field
                                name="password"
                                component={CssTextField}
                                validate={required}
                                type="password"
                                label="Senha"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                              />
                            </Col>
                            <Col xs={6}>
                              <Field
                                name="password1"
                                component={CssTextField}
                                // validate={required}
                                type="password"
                                label="Confirme a Senha"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                              />
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

export default UserModal