import React, { useState, useEffect, useRef, createRef } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  Container,
  BoxTitulo,
  Texto,
  RLeft,
  RRight,
  Botao,
  Grid as GridModal,
  Blank,
} from '../CardUsuario/styles'

import { 
  Grid, 
  Row, 
  Col 
} from 'react-flexbox-grid'

import {
  Box,
  InputAdornment,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  withStyles,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import { Form } from './styles'
import Input from '../../Forms/Input'
import * as Yup from 'yup'
import { isCNPJ, isCPF } from 'brazilian-values'
import MaskedInput from 'react-text-mask'

import { AiOutlineSearch } from 'react-icons/ai'
import { FaIcon } from '../../Icone'
import "./modal.css"

import api from '../../../services/rf'
import Axios from 'axios'

import { AgGridReact, gridApi } from 'ag-grid-react'
import agPtBr from '../../agPtBr'

import ConfirmaModal from '../../ConfirmaModal'
import useModalConfirma from '../../ConfirmaModal/useModal'

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
  let sMask = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/]
  if (clearValue.length > 10) {
    sMask = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
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

  const sMask = [/[1-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  withoutLabel: {
    marginTop: theme.spacing(1),
  },
  textField: {
    marginBottom: '1px',
  },
  image: {
    position: 'absolute',
    top: 110,
    left: 50,
  },
  img: {
    display: 'block',
    width: '120px',
    height: '120px',
    borderRadius: 15,
  },
  status: {
    position: 'absolute',
    top: 110,
    left: 170,
  },
  estado: {
    position: 'absolute',
    top: 225,
    left: 30,
    fontSize: '12px',
  },
  botoes: {
    position: 'absolute',
    top: 100,
    right: 100,
  },
  botoesvei: {
    position: 'absolute',
    top: 110,
    right: 32,
  },
}))

const PedidoModal = ({ isShowPedido, hide, tipo, pedidoId }) => {
  const classes = useStyles()
  const formRef = useRef(null)
  const inputRef = useRef()

  const [initialValues, setInitialValues] = useState({
    pedido: pedidoId,
  })

  const [value, setValue] = useState(0)
  const [disableEdit, setDisableEdit] = useState(false)
  const [ultimoCep, setUltimoCep] = useState('')
  const [tipoCad, setTipoCad] = useState(tipo)
  const [tipoCadVei, setTipoCadVei] = useState('')
  const [tipoCadastro, setTipoCadastro] = useState('')
  // const [modo, setModo] = useState('')

  const [vgridApi, setVgridApi] = useState(gridApi)
  const [veiculos, setVeiculos] = useState([])

  const style = {
    background: "#FFF",
    borderRadius: "0.25rem",
    padding: "20px",
    boxShadow:
      "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)"
  };

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    try {

      console.log('**** Inicio', tipoCad, pedidoId)
      if (tipoCad !== 'N' && tipoCad !== 'E') {
        setDisableEdit(true)
      }

      if (pedidoId !== null && tipoCad !== 'N') {
        console.log('**** buscaPedido')
        buscaPedido()
      }

      if (tipoCad === 'N' && tipoCadastro === '') {
        setTipoCadastro('M')
        // valTipoCadastro('M')
        // window.setFormValue('tipo', 'M')
        // window.setFormValue('status', 'I')
        // window.setFormValue('estado', ' ')
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response
        data.map(mensagem => {
          toast(mensagem.message, { type: 'error' })
        })
      } else if (error.request) {
        toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
      } else {
        toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    }
  }, [pedidoId, tipoCad, disableEdit])

  const buscaPedido = async () => {
    if (pedidoId) {
      await api
        .get(`/pedidos/${pedidoId}`)
        .then(response => {
          const { data } = response

          data.limitecoleta = data.limitecoleta ? data.limitecoleta.substring(0, 10) : null
          data.limiteentrega = data.limiteentrega ? data.limiteentrega.substring(0, 10) : null

          setInitialValues(data)
          setTipoCadastro(data.tipo)
          setVeiculos(data.veiculos)
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
  
  /* buscaUsuario
  const buscaUsuario = async () => {
    if (userID) {
      await api
        .get(`/usuarios/${userID}`)
        .then(response => {
          const { data } = response
          setInitialValues(data)
          setTipoCadastro(data.tipo)
          valTipoCadastro(data.tipo)
          setVeiculos(data.veiculos)
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
  */

  /* buscaVeiculos
  const buscaVeiculos = async () => {
    if (pedidoId) {
      await api
        .post(`/buscaveiculosm/${userID}`)
        .then(response => {
          const { data } = response
          setVeiculos(data)
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
  */

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  async function handleSubmit (data, { reset }) {
    try {
      
      console.log('**** data', data)

      const schema = Yup.object().shape({
        pedido: Yup.string().required('O pedido é obrigatório'),
        // email: Yup.string()
        //   .email('Digite um email válido')
        //   .required('O email é obrigatório')
        //   .min(3, 'No mínimo 3 caracteres'),
      })

      await schema.validate(data, {
        abortEarly: false,
      })
      
      console.log('**** formRef.current', formRef.current)
          
      formRef.current.setErrors({})
      reset()
      
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {}

        err.inner.forEach(error => {
          errorMessages[error.path] = error.message
        })

        formRef.current.setErrors(errorMessages)
      }
      console.log('**** err', err, formRef.current)
    }
  }

  if (isShowPedido) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal">
            <Container>
              <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <GridModal mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      CADASTRO DO PEDIDO
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                    <Tooltip title="Fechar Janela">
                      <Botao onClick={hide}><FaIcon icon='GiExitDoor' size={20} /> </Botao>
                    </Tooltip>
                  </RRight>
                </GridModal>
              </BoxTitulo>

              <Form ref={formRef} onSubmit={handleSubmit} height={'490px'} initialData={initialValues}>

                <Tabs value={value} onChange={handleChange} aria-label="Dados do Pedido">
                  <Tab label="Pedido" {...a11yProps(0)} />
                  <Tab label="Veículos" {...a11yProps(1)} />
                </Tabs>

                {!disableEdit &&
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
                          <FaIcon icon='Save' size={24} />
                        </span>
                      </Tooltip>
                    </button>
                  </div>
                }

                <TabPanel
                  value={value}
                  index={0}
                  id='cadPed'
                >
                  <Grid fluid>
                    <Row>
                      <Col xs={2}>
                        <Input 
                          name="id" 
                          label="Pedido" 
                          type="text"
                          onFocus
                          onBlur
                          // value={initialValues.id}
                          // onChange={val => setInitialValues({ ...initialValues, id: val })}
                          // ref={inputRef}
                        />
                      </Col>
                      <Col xs={2}>
                        <Input 
                          name="limitecoleta" 
                          label="Limite Coleta" 
                          type="date"
                          onFocus
                          onBlur
                          // value={initialValues.limitecoleta}
                          // onChange={val => setInitialValues({ ...initialValues, limitecoleta: val })}
                          // ref={inputRef}
                        />
                      </Col>
                      <Col xs={2}>
                        <Input 
                          name="limiteentrega" 
                          label="Limite Entrega" 
                          type="date"
                          onFocus
                          onBlur
                          // value={initialValues.limiteentrega}
                          // onChange={val => setInitialValues({ ...initialValues, limiteentrega: val })}
                          // ref={inputRef}
                        />
                      </Col>
                    </Row>
                  </Grid>
                </TabPanel>

                {/* <button type="submit">Enviar</button> */}
              </Form>

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

export default PedidoModal