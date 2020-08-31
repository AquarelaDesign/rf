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
import InputD from '../../Forms/InputD'
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

import DocsModal from '../DocsModal'
import useModalDocs from '../DocsModal/useModal'

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
        <BoxTitulo mt={5} bgcolor='#2699F8'>
          {children}
        </BoxTitulo>
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

const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #FFFFFF',
    height: 40,
    padding: 5,
  },
  indicator: {
    backgroundColor: '#B5B5B5',
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 100,
    fontWeight: 700,
    height: 40,
    color: '#3b97e3',
    padding: 0,
    // marginRight: theme.spacing(4),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      // backgroundColor: '#0031FF',
      color: '#3b97e3',
      opacity: 1,
    },
    '&$selected': {
      color: '#3b97e3',
      // backgroundColor: '#3b97e3',
      // borderRadius: '5px',
    },
    '&:focus': {
      // backgroundColor: '#0031FF',
      color: '#3b97e3',
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

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
    top: 200,
    right: 200,
    zIndex: 490,
  },
  botoesvei: {
    position: 'absolute',
    top: 200,
    right: 32,
    width: 200,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  demo1: {
    padding: '0px',
    border: '5px solid #2699F8' ,
    backgroundColor: '#FFFFFF',
    borderRadius: '5px',
  },
}))

const PedidoModal = ({ isShowPedido, hide, tipo, pedidoId }) => {
  const classes = useStyles()
  const formRef = useRef(null)

  const [value, setValue] = useState(0)
  const [values, setValues] = useState({})
  const [dadosCliente, setDadosCliente] = useState({})

  const [disableEdit, setDisableEdit] = useState(false)
  const [ultimoCep, setUltimoCep] = useState('')
  const [tipoCad, setTipoCad] = useState(tipo)
  const [tipoCadVei, setTipoCadVei] = useState('')
  const [tipoCadastro, setTipoCadastro] = useState('')
  // const [modo, setModo] = useState('')

  const [vgridApi, setVgridApi] = useState(gridApi)
  const [veiculos, setVeiculos] = useState([])

  const [excluiId, setExcluiId] = useState(null)
  const [placaExclui, setPlacaExclui] = useState(null)
  const [propsE, setPropsE] = useState(null)
  const [sData, setSData] = useState(null)
  const [veiculoId, setVeiculoId] = useState(0)

  const { isShowDocs, toggleDocs } = useModalDocs()
  const { isShowConfirma, toggleConfirma } = useModalConfirma()

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

      // console.log('**** Inicio', tipoCad, pedidoId)
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

          console.log('**** data.veiculos', data.veiculos)

          setValues(data)
          setTipoCadastro(data.tipo)
          setVeiculos(data.veiculos)
          buscaCliente(data.cliente_id)
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
  
  const buscaCliente = async (clienteID) => {
    if (clienteID) {
      await api
        .get(`/usuarios/${clienteID}`)
        .then(response => {
          const { data } = response
          setDadosCliente(data)
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

  const findCliente = () => {
    alert('findCliente')
  }

  const handleDeleteRow = async (props, e) => {
    e.preventDefault()
    const selectedData = props.api.getSelectedRows()

    setExcluiId(selectedData[0].id)
    setPlacaExclui(selectedData[0].placachassi)
    setPropsE(props)
    setSData(selectedData)
    await sleep(300)
    toggleConfirma()
  }

  function getNumericCellEditor() {
    function isCharNumeric(charStr) {
      return !!/\d/.test(charStr)
    }

    function isKeyPressedNumeric(event) {
      var charCode = getCharCodeFromEvent(event);
      var charStr = String.fromCharCode(charCode);
      return isCharNumeric(charStr)
    }

    function getCharCodeFromEvent(event) {
      event = event || window.event
      return typeof event.which === 'undefined' ? event.keyCode : event.which
    }

    function NumericCellEditor() { }

    NumericCellEditor.prototype.init = function (params) {
      this.focusAfterAttached = params.cellStartedEdit
      this.eInput = document.createElement('input')
      this.eInput.style.width = '100%'
      this.eInput.style.height = '100%'
      this.eInput.value = isCharNumeric(params.charPress)
        ? params.charPress
        : params.value
      var that = this
      this.eInput.addEventListener('keypress', function (event) {
        if (!isKeyPressedNumeric(event)) {
          that.eInput.focus()
          if (event.preventDefault) event.preventDefault()
        }
      })
    }

    NumericCellEditor.prototype.getGui = function () {
      return this.eInput
    }

    NumericCellEditor.prototype.afterGuiAttached = function () {
      if (this.focusAfterAttached) {
        this.eInput.focus()
        this.eInput.select()
      }
    }

    NumericCellEditor.prototype.isCancelBeforeStart = function () {
      return this.cancelBeforeStart
    }

    NumericCellEditor.prototype.isCancelAfterEnd = function () { }

    NumericCellEditor.prototype.getValue = function () {
      return this.eInput.value
    }

    NumericCellEditor.prototype.focusIn = function () {
      var eInput = this.getGui()
      eInput.focus()
      eInput.select()
    }

    NumericCellEditor.prototype.focusOut = function () {
    }

    return NumericCellEditor
  }

  const columnDefs = [
    {
      headerName: "Placa/Chassi",
      field: "placachassi",
      width: 120,
      sortable: true,
      // editable: true,
    },
    {
      headerName: "Modelo",
      field: "modelo",
      flex: 1,
      sortable: true,
      // editable: true,
      // cellEditor: 'agSelectCellEditor',
      // cellEditorParams: {
      //   values: TipoVeiculo(), // ['CARRETA', 'CAVALO', 'PLATAFORMA'],
      // },
    },
    {
      headerName: "Situação",
      field: "estado",
      width: 140,
      sortable: true,
      // editable: true,
      // cellEditor: 'numericCellEditor',
    },
    {
      headerName: "",
      width: 30,
      sortable: false,
      editable: false,
      cellRendererFramework: (props) => {
        return (
          <button onClick={(e) => handleDeleteRow(props, e)}
          disabled={disableEdit}
          style={{ backgroundColor: 'transparent' }}
          >
            <Tooltip title="Excluir veículo">
              <span style={{
                alignItems: 'center',
                color: '#FF0000',
                marginLeft: '-18px',
                marginTop: '3px',
              }}>
                <FaIcon icon='Deletar' size={20} />
              </span>
            </Tooltip>
          </button>
        )
      },
    },
  ]

  const onDocs = async (e, tipo) => {
    e.preventDefault()

    if (tipo === 'E') {
      const selectedData = vgridApi.getSelectedRows()

      if (!selectedData) {
        toast('Você deve selecionar um veículo para editar!', { type: 'alert' })
        return
      }

      if (selectedData.length === 0) {
        toast('Você deve selecionar um veículo para editar!', { type: 'alert' })
        return
      }
      setVeiculoId(selectedData[0].id)
    }
    setTipoCadVei(disableEdit ? 'D' : tipo)

    toggleDocs()
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  async function handleSubmit (data, { reset }) {
    try {
      
      console.log('**** data', data)

      const schema = Yup.object().shape({
        id: Yup.string().required('O pedido é obrigatório'),
        // email: Yup.string()
        //   .email('Digite um email válido')
        //   .required('O email é obrigatório')
        //   .min(3, 'No mínimo 3 caracteres'),
      })

      await schema.validate(data, {
        abortEarly: false,
      })
      
      // console.log('**** formRef.current', formRef.current)
          
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
    }
  }

  function submitForm() {
    formRef.current.submitForm()
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
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /></Blank>
                    <Tooltip title="Salvar">
                      <Botao onClick={submitForm}><FaIcon icon='Save' size={20} /></Botao>
                    </Tooltip>
                    <Tooltip title="Fechar Janela">
                      <Botao onClick={hide}><FaIcon icon='GiExitDoor' size={20} /></Botao>
                    </Tooltip>
                  </RRight>
                </GridModal>
              </BoxTitulo>

              <Form ref={formRef} onSubmit={handleSubmit} height={'490px'} width={'100%'} >

                <div className={classes.demo1}>
                  <AntTabs value={value} onChange={handleChange} aria-label="Dados do Pedido">
                    <AntTab label="Pedido" {...a11yProps(0)} />
                    <AntTab label="Veículos" {...a11yProps(1)} />
                    <AntTab label="Rotas" {...a11yProps(1)} />
                  </AntTabs>
                </div>

                <TabPanel value={value} index={0} style={{ width: '100%' }}>
                  <Grid>

                    <Row>
                      <Col xs={12}>
                        <BoxTitulo bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10} mt={10}>
                          <Grid>
                            <Row style={{ height: '22px' }}>
                              <Col xs={12}>
                                <Texto
                                  size={16} height={18} italic={true} bold={700} font='Arial'
                                  mt={2}
                                  color='#2699FB' shadow={true}>
                                  PEDIDO
                                </Texto>
                              </Col>
                            </Row>
                          </Grid>
                        </BoxTitulo>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12}>
                        <BoxTitulo bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                          <Grid>
                            <Row style={{ height: '54px', marginTop: '15px' }}>
                              <Col xs={2}>
                                <InputD 
                                  type="text" 
                                  onFocus onBlur 
                                  name="id" 
                                  label="Pedido"
                                  value={values.id}
                                  disabled 
                                />
                              </Col>
                              <Col xs={2}>
                                <Input 
                                  type="date" 
                                  onFocus onBlur 
                                  name="limitecoleta" 
                                  label="Limite Coleta" 
                                  value={values.limitecoleta}
                                  onChange={e => setValues({ ...values, limitecoleta: e.target.value })} 
                                />
                              </Col>
                              <Col xs={2}>
                                <Input 
                                  type="date" 
                                  onFocus onBlur 
                                  name="limiteentrega" 
                                  label="Limite Entrega" 
                                  value={values.limiteentrega}
                                  onChange={e => setValues({ ...values, limiteentrega: e.target.value })} 
                                />
                              </Col>
                            </Row>
                          </Grid>
                        </BoxTitulo>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12}>
                        <BoxTitulo bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10} mt={1}>
                          <Grid>
                            <Row style={{ height: '22px' }}>
                              <Col xs={12}>
                                <Texto
                                  size={16} height={18} italic={true} bold={700} font='Arial'
                                  mt={2}
                                  color='#2699FB' shadow={true}>
                                  CONTRATANTE
                                </Texto>
                              </Col>
                            </Row>
                          </Grid>
                        </BoxTitulo>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12}>
                        <BoxTitulo bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10} pt={15}>
                          <Grid>
                            <Row style={{ height: '54px' }}>
                              <Col xs={2}>
                                <Input 
                                  type="text" 
                                  onFocus onBlur 
                                  name="cliente_id" 
                                  label="Cliente" 
                                  icon={<AiOutlineSearch />} 
                                  callButton={findCliente}
                                  value={values.cliente_id}
                                  onChange={e => setValues({ ...values, cliente_id: e.target.value })} 
                                />
                              </Col>
                              <Col xs={2}>
                                <InputD 
                                  type="text" 
                                  onFocus onBlur 
                                  name="cpfcnpj" 
                                  label="CPF/CNPJ" 
                                  value={dadosCliente.cpfcnpj} 
                                  disabled
                                />
                              </Col>
                              <Col xs={8}>
                                <InputD 
                                  type="text" 
                                  onFocus onBlur 
                                  name="nome" 
                                  label="Nome" 
                                  value={dadosCliente.nome} 
                                  disabled
                                />
                              </Col>
                            </Row>
                            <Row style={{ height: '54px' }}>
                              <Col xs={3}>
                                <Input 
                                  type="text" 
                                  onFocus onBlur 
                                  name="contato" 
                                  label="Contato" 
                                  value={dadosCliente.contato}
                                  disabled
                                />
                              </Col>
                              <Col xs={5}>
                                <InputD 
                                  type="text" 
                                  onFocus onBlur 
                                  name="email" 
                                  label="E-mail" 
                                  value={dadosCliente.email} 
                                  disabled
                                />
                              </Col>
                              <Col xs={2}>
                                <InputD 
                                  type="text" 
                                  onFocus onBlur 
                                  name="celular" 
                                  label="Celular" 
                                  value={dadosCliente.celular} 
                                  disabled
                                />
                              </Col>
                              <Col xs={2}>
                                <InputD 
                                  type="text" 
                                  onFocus onBlur 
                                  name="whats" 
                                  label="WhatsApp" 
                                  value={dadosCliente.whats} 
                                  disabled
                                />
                              </Col>
                            </Row>

                            <Row style={{ height: '54px' }}>
                              <Col xs={6}>
                                <Input 
                                  type="text" 
                                  onFocus onBlur 
                                  name="logradouro" 
                                  label="Endereço" 
                                  value={dadosCliente.logradouro}
                                  disabled
                                />
                              </Col>
                              <Col xs={2}>
                                <InputD 
                                  type="text" 
                                  onFocus onBlur 
                                  name="numero" 
                                  label="Número" 
                                  value={dadosCliente.numero} 
                                  disabled
                                />
                              </Col>
                              <Col xs={4}>
                                <InputD 
                                  type="text" 
                                  onFocus onBlur 
                                  name="complemento" 
                                  label="Complemento" 
                                  value={dadosCliente.complemento} 
                                  disabled
                                />
                              </Col>
                            </Row>
                            <Row style={{ height: '54px' }}>
                              <Col xs={3}>
                                <Input 
                                  type="text" 
                                  onFocus onBlur 
                                  name="bairro" 
                                  label="Bairro" 
                                  value={dadosCliente.bairro}
                                  disabled
                                />
                              </Col>
                              <Col xs={3}>
                                <InputD 
                                  type="text" 
                                  onFocus onBlur 
                                  name="cidade" 
                                  label="Cidade" 
                                  value={dadosCliente.cidade} 
                                  disabled
                                />
                              </Col>
                              <Col xs={1}>
                                <InputD 
                                  type="text" 
                                  onFocus onBlur 
                                  name="uf" 
                                  label="UF" 
                                  value={dadosCliente.uf} 
                                  disabled
                                />
                              </Col>
                              <Col xs={2}>
                                <InputD 
                                  type="text" 
                                  onFocus onBlur 
                                  name="cep" 
                                  label="CEP" 
                                  value={dadosCliente.cep} 
                                  disabled
                                />
                              </Col>
                            </Row>
                          </Grid>
                        </BoxTitulo>
                      </Col>
                    </Row>

                  </Grid>
                </TabPanel>

                <TabPanel value={value} index={1} style={{ width: '100%', height: '510px' }}>
                  <Grid>
                    <Row style={{ height: '50px' }}>
                      <Col xs={6}>
                        <div
                          className={classes.botoesvei}
                        >
                          {!disableEdit &&
                            <button onClick={(e) => onDocs(e, 'N')}
                              style={{ backgroundColor: 'transparent' }}
                            >
                              <Tooltip title="Adicionar um novo veículo">
                                <span style={{
                                  alignItems: 'center',
                                  color: '#31C417',
                                  cursor: 'pointer',
                                  marginTop: '3px',
                                }}>
                                  <FaIcon icon='Add' size={30} />
                                </span>
                              </Tooltip>
                            </button>
                          }
                        </div>
                      </Col>
                      <Col xs={6}></Col>
                    </Row>

                    <Row>
                      <Col xs={6}>
                        <div className="ag-theme-custom-react" style={{
                            height: '345px',
                            width: '100%',
                            borderRadius: '10px',
                            backgroundColor: '#FFFFFF'
                        }}>
                          <AgGridReact
                            id='agVeiculos'
                            name='agVeiculos'
                            rowSelection="single"
                            onGridReady={(params) => { setVgridApi(params.api) }}
                            columnDefs={columnDefs}
                            rowData={veiculos}
                            singleClickEdit={true}
                            stopEditingWhenGridLosesFocus={true}
                            suppressNavigable={disableEdit}
                            // editType='fullRow'
                            components={{ numericCellEditor: getNumericCellEditor() }}
                            tooltipShowDelay={0}
                            pagination={true}
                            paginationPageSize={10}
                            localeText={agPtBr}
                          >
                          </AgGridReact>
                        </div>
                      </Col>
                      <Col xs={6}>
                      </Col>
                    </Row>
                    <Row style={{ height: '10px' }}>
                      <Col xs={12}></Col>
                    </Row>
                  </Grid>
                </TabPanel>

                <TabPanel value={value} index={2} style={{ width: '100%' }}>
                  Teste
                </TabPanel>
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