import React, { useState, useEffect } from 'react'
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
  // Box,
  InputAdornment,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  withStyles,
} from '@material-ui/core'

import {
  TextField,
} from 'final-form-material-ui'

import { makeStyles } from '@material-ui/core/styles'

import { Form, Field } from 'react-final-form'
import DatePicker from '../../datepicker'
import { values } from 'lodash'
import { AiOutlineSearch } from 'react-icons/ai'
import { RiMoneyDollarBoxLine } from 'react-icons/ri'

// import * as Yup from 'yup'
// import { isCNPJ, isCPF } from 'brazilian-values'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
// import CurrencyTextField from '../../Forms/CurrencyTextField'
// import NumberFormat from 'react-number-format'
// import NumberFormat from 'react-number-format'
// import { IMaskInput } from 'react-imask'

import { FaIcon } from '../../Icone'
import "./modal.css"

import api from '../../../services/rf'
import Axios from 'axios'

import { AgGridReact, gridApi } from 'ag-grid-react'
import agPtBr from '../../agPtBr'

// import DocsModal from '../DocsModal'
// import useModalDocs from '../DocsModal/useModal'

import ConfirmaModal from '../../ConfirmaModal'
import useModalConfirma from '../../ConfirmaModal/useModal'

import GridUsuariosModal from '../GridUsuariosModal'
import useModalUsuarios from '../GridUsuariosModal/useModal'

import VeiculosModal from '../VeiculosModal'
import useModalVeiculos from '../VeiculosModal/useModal'

import RotasModal from '../RotasModal'
import useModalRotas from '../RotasModal/useModal'

import HistoricoModal from '../HistoricoModal'
import useModalHistorico from '../HistoricoModal/useModal'

import moment from 'moment'
import Map from '../../Map'
// import GoogleMaps from '../../GoogleMaps'

import cadStatus from '../../../services/json/statusPedido.json'

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
  botoesVeiculos: {
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 130,
    left: 13.5,
    paddingTop: '3px',
    paddingRight: '5px',
    width: '48.1%',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  botoesRotas: {
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 120,
    right: 20,
    paddingTop: '3px',
    paddingRight: '5px',
    width: '95%',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  demo1: {
    padding: '0px',
    border: '5px solid #2699F8',
    backgroundColor: '#FFFFFF',
    borderRadius: '5px',
  },
}))

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

const apiKey = "AIzaSyBoV-kvy8LfddqcUb6kcHvs5TmrRJ09KXY"

const numberMask = createNumberMask({
  prefix: '',
  suffix: '',
  thousandsSeparatorSymbol: '.',
  decimalSymbol: ',',
  decimalScale: 2,
  fixedDecimalScale: true,
  requireDecimal: true, 
})

const PedidoModal = ({ isShowPedido, hide, tipoCad, disableEdit, pedidoID }) => {
  const classes = useStyles()

  const [initialValues, setInitialValues] = useState({})
  const [value, setValue] = useState(0)
  const [tipoCadVei, setTipoCadVei] = useState('')

  const [vgridHistorico, setVgridHistorico] = useState(gridApi)
  const [historico, setHistorico] = useState([])
  const [usuarios, setUsuarios] = useState([])

  const [vgridVeiculos, setVgridVeiculos] = useState(gridApi)
  const [veiculos, setVeiculos] = useState([])
  const [veiculoID, setVeiculoID] = useState(0)
  const [veiculoExclui, setVeiculoExclui] = useState(null)
  const [VeiculoProps, setVeiculoProps] = useState(null)
  const [veiculoData, setVeiculoData] = useState(null)
  const { isShowVeiculos, toggleVeiculos } = useModalVeiculos()

  const [vgridRotas, setVgridRotas] = useState(gridApi)
  const [rotas, setRotas] = useState([])
  const [rotaID, setRotaID] = useState(0)
  const [rotaExclui, setRotaExclui] = useState(null)
  const [RotaProps, setRotaProps] = useState(null)
  const [rotaData, setRotaData] = useState(null)
  const { isShowRotas, toggleRotas } = useModalRotas()
  
  const [historicoID, setHistoricoID] = useState(null)
  const [motoristaID, setMotoristaID] = useState(null)
  const [clienteID, setClienteID] = useState(null)
  const [operadorID, setOperadorID] = useState(null)

  const [confTexto, setConfTexto] = useState('')
  const [confTexto1, setConfTexto1] = useState('')
  const [modulo, setModulo] = useState('')

  const [responseMap, setResponseMap] = useState(null)
  const [waypoints, setWaypoints] = useState([])
  const [dadosInfo, setDadosInfo] = useState(null)
  // const [rotasMap, setRotasMap] = useState([])

  const [origem, setOrigem] = useState({
    lat: 0,
    lng: 0,
  })
  const [destino, setDestino] = useState({
    lat: 0,
    lng: 0,
  })
  const [paradas, setParadas] = useState([])

  const [places, setPlaces] = useState([{
    latitude: 0,
    longitude: 0,
  }])
  const [center, setCenter] = useState({
    lat: -25.486878,
    lng: -49.319317,
  })

  const [distancia, setDistancia] = useState([])
  const [valoresAgregados, setValoresAgregados] = useState([])
  const [seguros, setSeguros] = useState([])
  const [tabelaDeRotas, setTabelaDeRotas] = useState([])

  const { isShowConfirma, toggleConfirma } = useModalConfirma()
  const { isShowing, toggleGridUsuarios } = useModalUsuarios()
  const { isShowHistorico, toggleHistorico } = useModalHistorico()

  let submit

  const style = {
    background: "#FFF",
    borderRadius: "0.25rem",
    padding: "20px",
    boxShadow:
      "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)"
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    // novoPedido()
    buscaValoresAgregados() // <-- Adicionar busca direta no banco
    buscaSeguros() // <-- Adicionar busca direta no banco
    buscaTabRotas() // <-- Adicionar busca direta no banco
    buscaUsuarios()
    setOperadorID(localStorage.getItem('@rf/userID'))
  }, [tipoCad])

  useEffect(() => {
    try {
      setValue(0)
      buscaPedido(pedidoID)
    } catch (error) {
      if (error.response) {
        const { data } = error.response
        data.map(mensagem => {
          toast(mensagem.message, { type: 'error' })
        })
      } else if (error.request) {
        toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
      } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    }
  }, [pedidoID, tipoCad, disableEdit])

  const buscaPedido = async (pedidoId) => {
    if (pedidoId) {
      await api
        .get(`/pedidos/${pedidoId}`)
        .then(response => {
          const { data } = response

          data.limitecoleta = data.limitecoleta ? data.limitecoleta.substring(0, 10) : undefined
          data.limiteentrega = data.limiteentrega ? data.limiteentrega.substring(0, 10) : undefined

          // console.log('**** PedidosModal.buscaPedido.data', data)

          setInitialValues(data)
          setVeiculos(data.veiculos)
          setRotas(data.rotas)
          updateMap(data.rotas)
          buscaHistorico(data.id)
          setMotoristaID(data.motorista_id)

          if (data.cliente_id !== null) {
            setClienteID(data.cliente_id)
            buscaCliente(data.cliente_id)
            buscaRotas(true)
            buscaVeiculos(true)
          } else {
            semCliente()
          }

          let temNull = false
          data.rotas.forEach(r => {
            if (r.rota_relacionada === null) {
              temNull = true
            }
          })

          if (temNull === true) {
            data.rotas.forEach(function(row, index) {
              atualizaOrdem(row.id, index)
            })
            buscaRotas(true)
          }

          window.setFormValue('valor', data.valor)
        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** PedidosModal.buscaPedido.error.data', data)
            }
          } else if (error.request) {
            console.log('**** PedidosModal.buscaPedido.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    } else {
      // novoPedido()
    }
  }

  const novoPedido = () => {
    setValue(0)
    setInitialValues({
      cliente_id: null,
      limitecoleta: undefined,
      limiteentrega: undefined,
      localcoleta: null,
      localentrega: null,
      motorista_id: null,
      status: "",
      tipo: "C",
    })
    semCliente()
    setVeiculos([])
    setRotas([])

    // setRotasMap([])
    setOrigem({ lat: 0, lng: 0 })
    setDestino({ lat: 0, lng: 0 })
    setParadas([])
    setPlaces([{ latitude: 0, longitude: 0 }])
    confGeo()
  }

  const semCliente = () => {
    try {
      window.setFormValue('cpfcnpj', '')
      window.setFormValue('nome', '')
      window.setFormValue('contato', '')
      window.setFormValue('email', '')
      window.setFormValue('celular', '')
      window.setFormValue('whats', '')
      window.setFormValue('logradouro', '')
      window.setFormValue('numero', '')
      window.setFormValue('complemento', '')
      window.setFormValue('bairro', '')
      window.setFormValue('cidade', '')
      window.setFormValue('uf', '')
      window.setFormValue('cep', '')
      setClienteID(null)
    } catch (error) { }
  }

  const buscaCliente = async (clienteID) => {
    if (clienteID) {
      // await sleep(500)
      await api
        .get(`/usuarios/${clienteID}`)
        .then(response => {
          const { data } = response

          // console.log('**** PedidoModal.buscaCliente', data)
          // setDadosCliente(data)
          window.setFormValue('cpfcnpj', data.cpfcnpj)
          window.setFormValue('nome', data.nome)
          window.setFormValue('contato', data.contato)
          window.setFormValue('email', data.email)
          window.setFormValue('celular', data.celular)
          window.setFormValue('whats', data.whats)
          window.setFormValue('logradouro', data.logradouro)
          window.setFormValue('numero', data.numero)
          window.setFormValue('complemento', data.complemento)
          window.setFormValue('bairro', data.bairro)
          window.setFormValue('cidade', data.cidade)
          window.setFormValue('uf', data.uf)
          window.setFormValue('cep', data.cep)

        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** PedidosModal.buscaCliente.error.data', data)
            }
          } else if (error.request) {
            console.log('**** PedidosModal.buscaCliente.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  const findCliente = () => {
    toggleGridUsuarios()
  }

  const callBackCliente = (e) => {
    // setInitialValues({ ...initialValues, cliente_id: e })
    window.setFormValue('cliente_id', e)
    buscaCliente(e)
  }

  const frameworkComponents = {
    formataData: FormataData,
    buscaNome: BuscaNome,
  }

  function FormataData(params) {
    let tmpDate = params.value ? params.value : undefined
    let data = tmpDate ? moment(tmpDate).format('DD/MM/YYYY hh:mm:ss') : ""
    return (<span>{data}</span>)
  }

  function BuscaNome(params) {
    return usuarios.filter(user => user.id === params.value).map(
      fusu => {
        return fusu['nome']
      }
    )
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


  const buscaUsuarios = async () => {
    await api
      .post(`/buscausuarios`, {
        "email": "",
        "tipo": "M",
        "status": "",
        "estado": ""
      })
      .then(response => {
        const { data } = response
        setUsuarios(data)
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** PedidosModal.buscaUsuarios.error.data', data)
          }
        } else if (error.request) {
          console.log('**** PedidosModal.buscaUsuarios.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const buscaHistorico = async (pedidoId) => {
    // console.log('**** PedidosModal.buscaHistorico.pedidoId', pedidoId)
    await api
      .post(`/buscahistoricos`, {
        "motorista_id": null,
        "cliente_id": null,
        "operador_id": null,
        "pedido_id": pedidoId,
        "titulo_pagar_id": null,
        "titulo_receber_id": null,
      })
      .then(response => {
        const { data } = response
        setHistorico(data)
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** PedidosModal.buscaHistorico.error.data', data)
          }
        } else if (error.request) {
          console.log('**** PedidosModal.buscaHistorico.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const salvaHistorico = async (pedidoId, motoristaId, clienteId, operadorId, observacao) => {
    // console.log('**** PedidosModal.salvaHistorico.pedidoId', pedidoId)
    await api
      .post(`/historicos`, {
        "motorista_id": motoristaId,
        "cliente_id": clienteId,
        "operador_id": operadorId,
        "pedido_id": pedidoId,
        "titulo_pagar_id": null,
        "titulo_receber_id": null,
        "observacao": observacao, 
        "valor": 0
      })
      .then(response => {
        const { data } = response
        buscaHistorico(data.pedido_id)
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** PedidosModal.salvaHistorico.error.data', data)
          }
        } else if (error.request) {
          console.log('**** PedidosModal.salvaHistorico.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const onRowDoubleClickedHistorico = (params) => {
    setTipoCadVei('V')
    setHistoricoID(params.data.id)
    toggleHistorico()
  }

  const callBackHistorico = (e) => {
    buscaHistorico(pedidoID)
  }

  const colDefsHistorico = [
    {
      headerName: "Data",
      field: "updated_at",
      width: 170,
      sortable: true,
      cellRenderer: 'formataData',
    },
    {
      headerName: "Motorista",
      field: "motorista_id",
      width: 150,
      sortable: true,
      cellRenderer: 'buscaNome',
    },
    {
      headerName: "Observação",
      field: "observacao",
      flex: 1,
      sortable: false,
    },
  ]


  const colDefsVeiculos = [
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
      headerName: "Ano",
      field: "ano",
      width: 80,
      sortable: false,
      // editable: true,
      // cellEditor: 'agSelectCellEditor',
      // cellEditorParams: {
      //   values: TipoVeiculo(), // ['CARRETA', 'CAVALO', 'PLATAFORMA'],
      // },
    },
    {
      headerName: "Valor",
      field: "valor",
      width: 100,
      sortable: false,
      valueFormatter: params => params.data.valor.toFixed(2),
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
      hide: disableEdit,
      cellRendererFramework: (props) => {
        return (
          <Botao onClick={(e) => deleteRowVeiculo(props, e)}
            disabled={disableEdit}
            style={{ backgroundColor: 'transparent' }}
          >
            <Tooltip title="Excluir veículo">
              <span style={{
                alignItems: 'center',
                color: '#FF0000',
                marginLeft: '-35px',
                marginTop: '7px',
              }}>
                <FaIcon icon='Deletar' size={20} />
              </span>
            </Tooltip>
          </Botao>
        )
      },
    },
  ]

  const onVeiculos = async (e, tipo) => {
    e.preventDefault()

    if (tipo === 'E') {
      const selectedData = vgridVeiculos.getSelectedRows()

      if (!selectedData) {
        toast('Você deve selecionar um veículo para editar!', { type: 'error' })
        return
      }

      if (selectedData.length === 0) {
        toast('Você deve selecionar um veículo para editar!', { type: 'error' })
        return
      }
      setVeiculoID(selectedData[0].id)
    }
    setTipoCadVei(tipo !== 'E' && tipo !== 'N' ? 'D' : tipo)

    toggleVeiculos()
  }

  const deleteRowVeiculo = async (props, e) => {
    e.preventDefault()
    const selectedData = props.api.getSelectedRows()

    console.log('**** PedidoModal.deleteRowVeiculo', selectedData)

    setVeiculoExclui(selectedData[0].id)
    setVeiculoProps(props)
    setVeiculoData(selectedData)

    setConfTexto('Confirma a Exclusão do Veículo?')
    setConfTexto1(selectedData[0].placachassi)
    setModulo('V')

    toggleConfirma()
  }

  const excluiVeiculo = async () => {
    if (veiculoExclui) {
      api.delete(`/veiculos/${veiculoExclui}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      ).then(response => {
        if (response.status === 200) {
          toast('Veículo removido com sucesso!',
            { type: 'success' })
          VeiculoProps.api.applyTransaction({ remove: veiculoData })

        } else {
          toast(response.data[0].message,
            { type: 'error' })
        }

        setVeiculoExclui(null)
        setVeiculoProps(null)
        setVeiculoData(null)
        setConfTexto('')
        setConfTexto1('')
        setModulo('')

      }).catch((error) => {

        setVeiculoExclui(null)
        setVeiculoProps(null)
        setVeiculoData(null)
        setConfTexto('')
        setConfTexto1('')
        setModulo('')

        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** PedidoModal.excluiVeiculo.error.data', data)
          }
        } else if (error.request) {
          console.log('**** PedidoModal.excluiVeiculo.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
    }
  }

  const callBackVeiculos = (e) => {
    buscaVeiculos(e)
  }

  const onRowDoubleClickedVeiculo = (params) => {
    setTipoCadVei('V')
    setVeiculoID(params.data.id)
    toggleVeiculos()
  }

  
  const buscaVeiculos = async (stRetorno) => {
    
    await sleep(500)
    if (stRetorno && pedidoID) {
      await api
        .post(`/buscaveiculos/${pedidoID}`)
        .then(response => {
          const { data } = response
          setVeiculos(data)
        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** PedidosModal.buscaVeiculos.error.data', data)
            }
          } else if (error.request) {
            console.log('**** PedidosModal.buscaVeiculos.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  async function calculaValorPedido() {
    if (veiculos !== undefined && 
      rotas !== undefined && 
      seguros !== undefined && 
      tabelaDeRotas !== undefined 
      // initialValues.valor === 0
    ) {

      // console.log('**** PedidosModal.calculaValorPedido', veiculos, rotas)

      if (veiculos.length === 0) {
        toast('Não foram encontrados veículos cadastrados no pedido!', { 
          type: 'info',
          autoClose: 7000, 
          closeOnClick: true,
          pauseOnHover: true,
        })
      }

      if (rotas.length === 0) {
        toast('Não foram encontradas rotas cadastradas no pedido!', { 
          type: 'info',
          autoClose: 7000, 
          closeOnClick: true,
          pauseOnHover: true,
        })
        return
      }


      try {

        let valorTotal = 0
        let valor = 0
        let rotaval = 0
        let seguro = 0
        let seguroRoubo = 0
        let valAgregados = 0
        let imposto = 0
        let RotaDesc = ""
        let rotaOk = false
    
        veiculos.forEach(vei => {
          let tipoVei = 1
          if (vei.tipo === "motos") {
            tipoVei = 3
          } else {
            tipoVei = 1
          }

          valor = vei.valor // Valor do Veiculo

          // console.log('**** Busca valores agregados', valor)
          // Busca valores agregados
          valAgregados = 0
          valoresAgregados.forEach(valor => {
            if (valor.tipo_de_veiculo_id === tipoVei && valor.imposto === 0 && valor.exclusivo === 0) {
              valAgregados += valor.valor
            }
          })

          // console.log('**** Busca os valores do seguro conforme a tabela', valAgregados)
          // Busca os valores do seguro conforme a tabela
          seguro = 0
          rotaval = 0

          let rtSeg = []
          let cont = 0
          let reg = {
            origem: '',
            destino: ''
          }

          let _tipo = 'O'
          let _cidAnt = ''
          let _ufAnt = ''
          rotas.forEach(r => {

            if (_tipo === 'O') {
              reg['origem'] = {cidade: r.cidade, uf: r.uf}
              _tipo = 'D'
            } else {
              reg['destino'] = {cidade: r.cidade, uf: r.uf}
            }

            // console.log('**** Rotas.reg', cont, reg, r.rota_relacionada +1, rotas.length, _tipo)
            if (cont > 0) {
              rtSeg.push(reg)
              cont = 0
              reg = {
                origem: '',
                destino: ''
              }
              // console.log('**** Rotas.reg', reg, r.rota_relacionada +1, rotas.length, _tipo)
              if (r.rota_relacionada +1 < rotas.length) {
                reg['origem'] = {cidade: r.cidade, uf: r.uf}
              } 
              
            } else {
              if (r.rota_relacionada +1 === rotas.length) {
                rtSeg.push(reg)
              }

              cont++
            }
          })

          // console.log('**** Rotas', rtSeg)
          rtSeg.forEach(r => {

            RotaDesc = `${r.origem.cidade}/${r.origem.uf} X ${r.destino.cidade}/${r.destino.uf}`

            // console.log('**** Busca os valores dos seguros para rotas', RotaDesc)
            // Busca os valores dos seguros para rotas
            seguros.forEach(seg => {

              let uf1 = seg.uf
              let uf2 = r.origem.uf
                  
              if (uf1.toLowerCase() === uf2.toLowerCase()) {
                seguro += (valor * seg[r.destino.uf.toLowerCase()]) / 100
                // console.log('**** PedidosModal.calculaValorPedido.seguro', seguro)
              }
            })

            // console.log('**** Busca o valor adicional para Rota', seguro)
            // Busca o valor adicional para Rota
            tabelaDeRotas.forEach(rot => {
              let cidade_origem = rot.cidade_origem.toLowerCase()
              let cidade_destino = rot.cidade_destino.toLowerCase()
              let cid_origem = r.origem.cidade.toLowerCase()
              let cid_destino = r.destino.cidade.toLowerCase()

              cidade_origem = cidade_origem.normalize("NFD").replace(/[^a-zA-Zs]/g, "")
              cidade_destino = cidade_destino.normalize("NFD").replace(/[^a-zA-Zs]/g, "")
              cid_origem = cid_origem.normalize("NFD").replace(/[^a-zA-Zs]/g, "")
              cid_destino = cid_destino.normalize("NFD").replace(/[^a-zA-Zs]/g, "")

              // console.log('**** PedidosModal.calculaValorPedido.tabelaDeRotas', {
              //   cidade_origem, cid_origem,
              //   rot_uf_origem: rot.uf_origem.toLowerCase(), r_uf_origem: r.origem.uf.toLowerCase(),
              //   cidade_destino, cid_destino,
              //   rot_uf_destino: rot.uf_destino.toLowerCase(), r_uf_destino: r.destino.uf.toLowerCase(),
              //   rot_tipo: rot.tipo_de_veiculo_id, tipoVei
              // })

              if (
                cidade_origem === cid_origem &&
                rot.uf_origem.toLowerCase() === r.origem.uf.toLowerCase() &&
                cidade_destino === cid_destino &&
                rot.uf_destino.toLowerCase() === r.destino.uf.toLowerCase() &&
                rot.tipo_de_veiculo_id === tipoVei
              ) {
                rotaval += rot.valor
                rotaOk = true
              }
            })

          })

          seguroRoubo = (valor * 0.03) / 100

          // console.log(
          //   '**** PedidosModal.calculaValorPedido', 
          //   {valor,
          //   rotaval,
          //   seguro,
          //   seguroRoubo,
          //   valAgregados,
          //   imposto,
          //   valorTotal}
          // )

        })

        imposto = 1.12

        valorTotal = (rotaval + seguro + seguroRoubo + valAgregados) * imposto
        let valor_imposto = (rotaval + seguro + seguroRoubo + valAgregados) * (imposto - 1)
        
      // try {
        let val = valorTotal.toString().replace('.', ',')

        if (!rotaOk) {
          let msg = `A rota [${RotaDesc}] não foi localizada na tabela de rotas patio a patio, ` +
                    `por favor verifique as rotas cadastradas para que possam ser efetuados os cálculos de valores`
          toast(msg, { 
            type: 'info',
            autoClose: 7000, 
            closeOnClick: true,
            pauseOnHover: true,
          })
          return
        } 

        window.setFormValue('valor', val)

        console.log(
          '**** PedidosModal.calculaValorPedido', 
          {
            valor_do_veiculo: valor.toFixed(2),
            valor_transporte_rotas: rotaval.toFixed(2),
            valor_do_seguro: seguro.toFixed(2),
            valor_do_seguro_roubo: seguroRoubo.toFixed(2),
            valor_custo_operacional: valAgregados.toFixed(2),
            percentual_imposto: imposto.toFixed(2),
            valor_imposto: valor_imposto.toFixed(2),
            valor_total_cliente: valorTotal.toFixed(2)
          }
        )
      }
      catch(e) {}

    }
  }

  const buscaValoresAgregados = async () => {
    await api
    .get(`/valoresadicionais`)
    .then(response => {
      const { data } = response
      setValoresAgregados(data)
    }).catch((error) => {
      if (error.response) {
        const { data } = error.response
        try {
          data.map(mensagem => {
            toast(mensagem.message, { type: 'error' })
          })
        }
        catch (e) {
          console.log('**** PedidosModal.buscaValoresAgregados.error.data', data)
        }
      } else if (error.request) {
        console.log('**** PedidosModal.buscaValoresAgregados.error', error)
        // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
      } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
  }

  const buscaSeguros = async () => {
    await api
    .get(`/seguros`)
    .then(response => {
      const { data } = response
      setSeguros(data)
    }).catch((error) => {
      if (error.response) {
        const { data } = error.response
        try {
          data.map(mensagem => {
            toast(mensagem.message, { type: 'error' })
          })
        }
        catch (e) {
          console.log('**** PedidosModal.buscaSeguros.error.data', data)
        }
      } else if (error.request) {
        console.log('**** PedidosModal.buscaSeguros.error', error)
        // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
      } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
  }

  const buscaTabRotas = async () => {
    await api
    .get(`/rotastabela`)
    .then(response => {
      const { data } = response
      setTabelaDeRotas(data)
    }).catch((error) => {
      if (error.response) {
        const { data } = error.response
        try {
          data.map(mensagem => {
            toast(mensagem.message, { type: 'error' })
          })
        }
        catch (e) {
          console.log('**** PedidosModal.buscaTabRotas.error.data', data)
        }
      } else if (error.request) {
        console.log('**** PedidosModal.buscaTabRotas.error', error)
        // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
      } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
  }

  function buscaDistancia(orig, dest) {
    let w = []
    paradas.map(way => {
      w.push({
        location: way
      })
    })

    /*
    const uniqueW = Array.from(new Set(w.map(a => a.lat)))
      .map(lat => {
        return w.find(a => a.lat === lat)
      })

    setWaypoints(uniqueW)
    */

    // const consulta = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origem.lat},${origem.lng}&destinations=${destino.lat},${destino.lng}&key=${apiKey}`
    // https://retornofacil.com.br/scripts/directions.php?origins=-25.486878,-49.319317&destinations=-5.889387,-35.175128&key=AIzaSyBoV-kvy8LfddqcUb6kcHvs5TmrRJ09KXY

    // const consulta = `https://retornofacil.com.br/scripts/directions.php?origins=-25.486878,-49.319317|-23.769382,-46.598601&destinations=-23.769382,-46.598601|-5.889387,-35.175128&key=AIzaSyBoV-kvy8LfddqcUb6kcHvs5TmrRJ09KXY`
    const consulta = `https://retornofacil.com.br/scripts/directions.php?origins=${orig}&destinations=${dest}&key=${apiKey}`

    // console.log('**** PedidosModal.buscaDistancia.consulta', consulta)

    Axios.get(consulta, {
    }).then(response => {
      const { data } = response
      let dist = 0
      data.rows[0].elements.map(d => {
        dist += d.distance.value
      })

      setDistancia({
        distancia: `${Math.round(dist / 1000)} km`,
        tempo: `${Math.round((dist / 1000) / 500)} dias`,
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
          console.log('**** PedidosModal.buscaDistancia.error.data', data)
        }
      } else if (error.request) {
        console.log('**** PedidosModal.buscaDistancia.error.data', error)
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
  }

  const colDefsRotas = [
    {
      headerName: "O",
      field: "rota_relacionada",
      width: 30,
      sortable: false,
      // editable: true,
      rowDrag: true,      
    },
    {
      headerName: "Cidade",
      field: "cidade",
      width: 200,
      sortable: false,
      // editable: true,
    },
    {
      headerName: "UF",
      field: "uf",
      width: 100,
      sortable: false,
      // editable: true,
    },
    {
      headerName: "Contato",
      field: "contato",
      flex: 1,
      sortable: false,
      // editable: true,
      // cellEditor: 'agSelectCellEditor',
      // cellEditorParams: {
      //   values: TipoVeiculo(), // ['CARRETA', 'CAVALO', 'PLATAFORMA'],
      // },
    },
    {
      headerName: "Telefone",
      field: "telefone",
      width: 150,
      sortable: true,
      // editable: true,
      // cellEditor: 'numericCellEditor',
    },
    {
      headerName: "",
      width: 30,
      sortable: false,
      editable: false,
      hide: disableEdit,
      cellRendererFramework: (props) => {
        return (
          <button onClick={(e) => deleteRowRota(props, e)}
            disabled={disableEdit}
            style={{ backgroundColor: 'transparent' }}
          >
            <Tooltip title="Excluir rota">
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

  const onRotas = async (e, tipo) => {
    e.preventDefault()

    if (tipo === 'E') {
      const selectedData = vgridRotas.getSelectedRows()

      if (!selectedData) {
        toast('Você deve selecionar uma rota para editar!', { type: 'error' })
        return
      }

      if (selectedData.length === 0) {
        toast('Você deve selecionar uma rota para editar!', { type: 'error' })
        return
      }
      setRotaID(selectedData[0].id)
    }

    if (tipo === 'N') {
      setTipoCadVei(tipo)
    } else {
      setTipoCadVei(tipo !== 'E' && tipo !== 'N' ? 'D' : tipo)
    }

    toggleRotas()
  }

  const deleteRowRota = async (props, e) => {
    e.preventDefault()
    const selectedData = props.api.getSelectedRows()

    console.log('**** PedidoModal.deleteRowRota', selectedData)

    setRotaExclui(selectedData[0].id)
    setRotaProps(props)
    setRotaData(selectedData)

    setConfTexto('Confirma a Exclusão da Rota?')
    setConfTexto1(selectedData[0].cidade)
    setModulo('R')

    toggleConfirma()
  }

  const excluiRota = async () => {
    if (rotaExclui) {
      await api.delete(`/rotas/${rotaExclui}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      ).then(response => {
        if (response.status === 200) {
          toast('Rota removida com sucesso!',
            { type: 'success' })
          RotaProps.api.applyTransaction({ remove: rotaData })

        } else {
          toast(response.data[0].message,
            { type: 'error' })
        }

        setRotaExclui(null)
        setRotaProps(null)
        setRotaData(null)
        setConfTexto('')
        setConfTexto1('')
        setModulo('')

      }).catch((error) => {

        setRotaExclui(null)
        setRotaProps(null)
        setRotaData(null)
        setConfTexto('')
        setConfTexto1('')
        setModulo('')

        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** PedidoModal.excluiRota.error.data', data)
          }
        } else if (error.request) {
          console.log('**** PedidoModal.excluiRota.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
    }
  }

  const callBackRotas = (e) => {
    buscaRotas(e)
  }

  const onRowDoubleClickedRota = (params) => {
    setTipoCadVei('V')
    setRotaID(params.data.id)
    toggleRotas()
  }

  const buscaRotas = async (stRetorno) => {
    if (stRetorno && pedidoID) {
      await api
        .post(`/buscarotas/${pedidoID}`)
        .then(response => {
          const { data } = response
          setRotas(data)
          updateMap(data)

          let temNull = false
          data.forEach(r => {
            if (r.rota_relacionada === null) {
              temNull = true
            }
          })

          if (temNull === true) {
            console.log('**** PedidosModal.buscaRotas.temNull', temNull)
            data.forEach(function(row, index) {
              console.log('**** PedidosModal.buscaRotas.row.index', row, index)
              atualizaOrdem(row.id, index)
            })
          }

          // calculaValorPedido()
        }).catch((error) => {
          if (error.response) {
            const { data } = error.response
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** PedidosModal.buscaRotas.error.data', data)
            }
          } else if (error.request) {
            console.log('**** PedidosModal.buscaRotas.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  const updateMap = (rotas) => {

    if (rotas.length === 0) {
      confGeo()
      setOrigem({ lat: 0, lng: 0 })
      setDestino({ lat: 0, lng: 0 })
      setParadas([])
      setPlaces([{ latitude: 0, longitude: 0 }])
      return
    }

    let rt = []
    rotas.map(r => {
      rt.push({
        lat: parseFloat(r.latitude),
        lng: parseFloat(r.longitude),
        nome: r.nome,
        logradouro: r.logradouro,
        numero: r.numero,
        complemento: r.complemento,
        bairro: r.bairro,
        cidade: r.cidade,
        uf: r.uf,
      })
    })

    setCenter({
      lat: parseFloat(rt[0].lat),
      lng: parseFloat(rt[0].lng),
    })

    setPlaces(rt)
    setParadas([])

    if (rt.length > 0) {
      setOrigem(rt[0])
      setDestino(rt[rt.length - 1])

      if (rt.length > 2) {
        let waypoints = []
        for (let x = 1; x < rt.length - 1; x++) {

          // console.log('**** PedidoModal.buscaPedido.waypoints', rt[x])

          waypoints.push({
            lat: rt[x].lat,
            lng: rt[x].lng,
          })
        }
        setParadas(waypoints)
        // console.log('**** PedidoModal.buscaPedido.waypoints', waypoints)
      }
    }
    // console.log('**** PedidoModal.buscaPedido.rt', rt)

    let rm = []
    let orig = []
    let dest = []
    let cont = 0
    let reg = {
      origem: '',
      destino: ''
    }
    rotas.map(r => {

      if (r.tipo === 'C') {
        reg['origem'] = `${r.latitude},${r.longitude}`
        orig.push(reg)
      } else {
        reg['destino'] = `${r.latitude},${r.longitude}`
        dest.push(reg)
      }

      if (cont > 0) {
        rm.push(reg)
        cont = 0
        reg = {
          origem: '',
          destino: ''
        }
      } else {
        cont++
      }

    })
    
    let o = ''
    orig.map(r => {
      o = o + r.origem + '|'
    })
    
    let d = ''
    dest.map(r => {
      d = d + r.destino + '|'
    })

    // setRotasMap(rm)
    buscaDistancia(o, d)
  }

  const confGeo = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        showLocation,
        errorHandler,
        { timeout: 60000 }
      )
    } else {
      alert("Desculpe, o navegador não suporta geolocalização!")
    }
  }

  const showLocation = (position) => {
    setCenter({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
  }

  const errorHandler = (err) => {
    if (err.code === 1) {
      console.log("Erro: acesso negado!")
    } else if (err.code === 2) {
      console.log("Erro: a posição não está disponível!")
    }
  }

  const callBack = (e) => {
    if (e) {
      if (e === 'V') {
        excluiVeiculo()
        buscaVeiculos(true)
      } else if (e === 'R') {
        excluiRota()
        buscaRotas(true)
      }
    }
  }


  const onRowDragEnter = (e) => {
    // console.log('**** PedidoModal.onRowDragEnter', e)
  }

  const onRowDragEnd = async (e) => {
    // console.log('**** PedidoModal.onRowDragEnd', e)
    console.log('**** PedidoModal.onRowDragEnd.setVgridRotas.data', vgridRotas)

    vgridRotas.forEachNode(function(rowNode, index) {
      // console.log(index +' node ' + rowNode.data.id + ' is in the grid')
      atualizaOrdem(rowNode.data.id, index)
    })

    await sleep(1000)
    await buscaRotas(true)

  }

  const onRowDragMove = (e) => {
    // console.log('**** PedidoModal.onRowDragMove', e)
  }

  const onRowDragLeave = (e) => {
    // console.log('**** PedidoModal.onRowDragLeave', e)
  }


  const atualizaOrdem = async (rotaID, Ordem) => {

    const apiParams = {
      method: 'put',
      url: `/rotas/${rotaID}`,
      data: {
        rota_relacionada: Ordem,
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }
    
    // console.log('**** PedidoModal.atualizaOrdem', apiParams)

    await api(apiParams, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    .then(response => {
      const { data } = response
      if (response.status !== 200) {
        toast(`Ocorreu um erro na ordenação da rota!`,
          { type: 'error' })
        return
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
          console.log('**** PedidoModal.atualizaOrdem.error.data', data)
        }
      } else if (error.request) {
        console.log('**** PedidoModal.atualizaOrdem.error', error)
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
    
  }


  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  async function onSubmit(values) {

    // console.log('**** PedidoModal.onSubmit-values', values)
    let newValues = {}
    newValues['limitecoleta'] = moment(values['limitecoleta']).format('YYYY-MM-DD')
    newValues['limiteentrega'] = moment(values['limiteentrega']).format('YYYY-MM-DD')
    newValues['tipo'] = values['tipo']
    newValues['cliente_id'] = values['cliente_id']
    newValues['motorista_id'] = values['motorista_id']
    newValues['localcoleta'] = values['localcoleta']
    newValues['localentrega'] = values['localentrega']
    newValues['status'] = values['status']

    if (values['valor']) {
      let val = values['valor'].replace('.', '')
      val = val.replace(',', '.')
      newValues['valor'] = Math.round(val)
    } else {
      newValues['valor'] = Math.round(values['valor'])
    }

    // console.log('**** PedidoModal.onSubmit-newValues', newValues)
    // return

    let apiParams = {}

    if (pedidoID !== null && tipoCad === 'E') {
      apiParams = {
        method: 'put',
        url: `/pedidos/${pedidoID}`,
        data: JSON.stringify(newValues),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    } else {
      // newValues['status'] = 'I'
      apiParams = {
        method: 'post',
        url: `/pedidos`,
        data: JSON.stringify(newValues),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    }

    // console.log('**** PedidoModal.onSubmit-newValues', newValues)
    const userID = await localStorage.getItem('@rf/userID')

    await api(apiParams)
      .then(response => {
        const { data } = response

        setInitialValues(data)
        buscaCliente(data.cliente_id)
        if (response.status === 200) {
          toast('Registro atualizado com sucesso!', { type: 'success' })
          salvaHistorico(
            data.id, 
            data.motorista_id, 
            data.cliente_id, 
            userID,
            `Pedido Atualizado com sucesso, ` +
            `valor R$ ${parseFloat(data.valor).toFixed(2)}, ` +
            `limite coleta em ${moment(data.limitecoleta).format('DD/MM/YYYY')}, ` +
            `limite entrega em ${moment(data.limiteentrega).format('DD/MM/YYYY')}` 
          )
  
        } else if (response.status === 400) {
          response.data.map(mensagem => {
            toast(mensagem.message, { type: 'error' })
          })
        } else {
          response.data.map(mensagem => {
            toast(mensagem.message, { type: 'error' })
          })
        }
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
            console.log('**** PedidoModal.onSubmit.error.data', data)
          }
        } else if (error.request) {
          console.log('**** PedidoModal.onSubmit.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }


  const onMapLoad = (map) => {
    // mapRef.current = map;

    // console.log('**** Map.onMapLoad', origem, destino, paradas)

    let w = []
    paradas.map(way => {
      w.push({
        location: way
      })
    })

    const uniqueW = Array.from(new Set(w.map(a => a.lat)))
      .map(lat => {
        return w.find(a => a.lat === lat)
      })

    setWaypoints(uniqueW)

    // console.log('**** Map.montaRotas', uniqueW, waypoints)

  }

  const directionsCallback = (resp) => {
    console.log('**** Maps.directionsCallback', resp)
    
    if (resp !== null) {
      try {
        if (resp.status === 'OK') {
          // console.log('**** Maps.directionsCallback', resp.routes[0].legs[0].distance)
          if (dadosInfo === null) {
            setResponseMap(resp)
            const lgs = resp.routes[0].legs
            let dist = 0
            lgs.map(d => {
              dist += d.distance.value
            })

            setDadosInfo({
              distancia: `${Math.round(dist / 1000)} km`,
              tempo: `${Math.round((dist / 1000) / 500)} dias`,
            })
          }
        } else {
          // console.log('resp: ', resp)
        }
      }
      catch (e) {}
    }
    
  }


  const required = value => (value ? undefined : '* Obrigatório!')

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
                    {disableEdit ?
                      <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                      :
                      <Tooltip title="Salvar">
                        <Botao onClick={event => { submit(event) }}><FaIcon icon='Save' size={20} /></Botao>
                      </Tooltip>
                    }
                    <Tooltip title="Fechar Janela">
                      <Botao onClick={hide}><FaIcon icon='GiExitDoor' size={20} /></Botao>
                    </Tooltip>
                  </RRight>
                </GridModal>
              </BoxTitulo>

              <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={required}
                height={'490px'} width={'100%'}
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

                  // console.log('**** PedidoModal-Form-values', values)

                  return (
                    <form onSubmit={handleSubmit} noValidate>

                      <div className={classes.demo1}>
                        <AntTabs value={value} onChange={handleChange} aria-label="Dados do Pedido">
                          <AntTab label="Pedido" {...a11yProps(0)} />
                          <AntTab label="Veiculos" {...a11yProps(1)} />
                          <AntTab label="Rotas" {...a11yProps(2)} />
                          <AntTab label="Mapa" {...a11yProps(3)} />
                          <AntTab label="Histórico" {...a11yProps(4)} />
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
                                  <Row style={{ height: '65px', marginTop: '5px', alignItems: 'center' }}>
                                    <Col xs={2}>
                                      <Field
                                        disabled={true}
                                        name="id"
                                        component={CssTextField}
                                        type="text"
                                        label="Pedido"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={2}>
                                      <Field
                                        label="Limite Coleta"
                                        name="limitecoleta"
                                        validate={required}
                                        disabled={disableEdit}
                                        message="Informe a Data Limite da Coleta"
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
                                    <Col xs={2}>
                                      <Field
                                        label="Limite Entrega"
                                        name="limiteentrega"
                                        // validate={required}
                                        disabled={disableEdit}
                                        message="Informe a Data Limite da Entrega"
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
                                    <Col xs={3}>
                                      <Field
                                        disabled={disableEdit}
                                        name="valor"
                                        component={CssTextField}
                                        type="text"
                                        label="Valor"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                        // onChange={e => window.setFormValue('valor', e.target.value)}
                                        InputProps={{
                                          inputComponent: formatCurrency,
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              <button type="button" onClick={calculaValorPedido}
                                                style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
                                              >
                                                <RiMoneyDollarBoxLine />
                                              </button>
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </Col>
                                    <Col xs={3}>
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
                                          <MenuItem key={option.Id} value={option.Code}>
                                            {option.Description}
                                          </MenuItem>
                                        ))}
                                      </Field>
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
                                  <Row style={{ height: '65px' }}>
                                    <Col xs={2}>
                                      <Field
                                        disabled={disableEdit}
                                        name="cliente_id"
                                        component={CssTextField}
                                        type="text"
                                        label="Cliente"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                        pattern="[\d|-]{8}"
                                        InputProps={{
                                          // inputComponent: formatCep,
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              <button type="button" onClick={findCliente}
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
                                      <Field
                                        disabled={true}
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
                                        }}
                                      />
                                    </Col>
                                    <Col xs={8}>
                                      <Field
                                        disabled={true}
                                        name="nome"
                                        component={CssTextField}
                                        type="text"
                                        label="Nome"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                  </Row>
                                  <Row style={{ height: '65px' }}>
                                    <Col xs={3}>
                                      <Field
                                        disabled={true}
                                        name="contato"
                                        component={CssTextField}
                                        type="text"
                                        label="Contato"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={5}>
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
                                      />
                                    </Col>
                                    <Col xs={2}>
                                      <Field
                                        disabled={true}
                                        name="celular"
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
                                    <Col xs={2}>
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
                                        pattern="[\d|(|)|-]{11,12}"
                                        InputProps={{
                                          inputComponent: formatCelular,
                                        }}
                                      />
                                    </Col>
                                  </Row>

                                  <Row style={{ height: '65px' }}>
                                    <Col xs={6}>
                                      <Field
                                        disabled={true}
                                        name="logradouro"
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
                                        disabled={true}
                                        name="numero"
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
                                        disabled={true}
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
                                  <Row style={{ height: '65px' }}>
                                    <Col xs={3}>
                                      <Field
                                        disabled={true}
                                        name="bairro"
                                        component={CssTextField}
                                        type="text"
                                        label="Bairro"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={3}>
                                      <Field
                                        disabled={true}
                                        name="cidade"
                                        component={CssTextField}
                                        type="text"
                                        label="Cidade"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={1}>
                                      <Field
                                        disabled={true}
                                        name="uf"
                                        component={CssTextField}
                                        type="text"
                                        label="UF"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                      />
                                    </Col>
                                    <Col xs={2}>
                                      <Field
                                        disabled={true}
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
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                </Grid>
                              </BoxTitulo>
                            </Col>
                          </Row>

                        </Grid>
                      </TabPanel>

                      <TabPanel value={value} index={1} style={{ width: '100%', height: '455px' }}>
                        <BoxTitulo
                            size={465}
                            width='99%'
                            bgcolor='#FFFFFF'
                            border='1px solid #2699F8'
                            mb={10}
                        >
                          <Grid>
                            <Row style={{ height: '45px' }}>
                              <Col xs={12}>
                                <div
                                  className={classes.botoesRotas}
                                >
                                  <button onClick={(e) => onVeiculos(e, 'E')}
                                    style={{ backgroundColor: 'transparent' }}
                                  >
                                    <Tooltip title="Editar Veículo">
                                      <span style={{
                                        alignItems: 'center',
                                        color: '#000000',
                                        cursor: 'pointer',
                                        marginTop: '3px',
                                      }}>
                                        <FaIcon icon='Documentos' size={30} />
                                      </span>
                                    </Tooltip>
                                  </button>

                                  {!disableEdit &&
                                    <button onClick={(e) => onVeiculos(e, 'N')}
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
                            </Row>

                            <Row>
                              <Col xs={12}>
                                <div className="ag-theme-custom-react" style={{
                                  height: '410px',
                                  width: '100%',
                                  // borderRadius: '10px',
                                  backgroundColor: '#FFFFFF',
                                  border: '5px solid #FFFFFF',
                                }}>
                                  <AgGridReact
                                    id='agVeiculos'
                                    name='agVeiculos'
                                    rowSelection="single"
                                    onGridReady={(params) => { setVgridVeiculos(params.api) }}
                                    columnDefs={colDefsVeiculos}
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
                                    onRowDoubleClicked={onRowDoubleClickedVeiculo}
                                  >
                                  </AgGridReact>
                                </div>
                              </Col>
                            </Row>
                          </Grid>
                        </BoxTitulo>
                      </TabPanel>

                      <TabPanel value={value} index={2} style={{ width: '100%', height: '455px' }}>
                        <BoxTitulo
                          size={465}
                          width='99%'
                          bgcolor='#FFFFFF'
                          border='1px solid #2699F8'
                          mb={10}
                        >
                          <Grid>
                            <Row style={{ height: '45px' }}>
                              <Col xs={12}>
                                <div
                                  className={classes.botoesRotas}
                                >
                                  <button onClick={(e) => onRotas(e, 'E')}
                                    style={{ backgroundColor: 'transparent' }}
                                  >
                                    <Tooltip title="Editar Rota">
                                      <span style={{
                                        alignItems: 'center',
                                        color: '#000000',
                                        cursor: 'pointer',
                                        marginTop: '3px',
                                      }}>
                                        <FaIcon icon='Documentos' size={30} />
                                      </span>
                                    </Tooltip>
                                  </button>

                                  {!disableEdit &&
                                    <button onClick={(e) => onRotas(e, 'N')}
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
                            </Row>
                            <Row>
                              <Col xs={12}>
                                <div className="ag-theme-custom-react" style={{
                                  height: '410px',
                                  width: '100%',
                                  // borderRadius: '10px',
                                  backgroundColor: '#FFFFFF',
                                  border: '5px solid #FFFFFF',
                                }}>
                                  <AgGridReact
                                    id='agRotas'
                                    name='agRotas'
                                    rowSelection="single"
                                    onGridReady={(params) => { setVgridRotas(params.api) }}
                                    columnDefs={colDefsRotas}
                                    rowData={rotas}
                                    singleClickEdit={true}
                                    stopEditingWhenGridLosesFocus={true}
                                    suppressNavigable={disableEdit}
                                    // editType='fullRow'
                                    components={{ numericCellEditor: getNumericCellEditor() }}
                                    tooltipShowDelay={0}
                                    // pagination={true}
                                    // paginationPageSize={10}
                                    rowDragManaged={true}
                                    animateRows={true}
                                    onRowDragEnter={onRowDragEnter}
                                    onRowDragEnd={onRowDragEnd}
                                    onRowDragMove={onRowDragMove}
                                    onRowDragLeave={onRowDragLeave}                                    
                                    localeText={agPtBr}
                                    onRowDoubleClicked={onRowDoubleClickedRota}
                                  >
                                  </AgGridReact>
                                </div>
                              </Col>
                            </Row>
                          </Grid>

                        </BoxTitulo>
                      </TabPanel>

                      <TabPanel value={value} index={3} style={{ width: '100%', height: '455px' }}>
                        <BoxTitulo
                          size={465}
                          width='99%'
                          bgcolor='#FFFFFF'
                          border='1px solid #2699F8'
                          mb={10}
                        >
                          {/*
                          <GoogleMaps 
                            origem={origem}
                            destino={destino}
                            paradas={paradas}
                            defaultCenter={center}
                            defaultZoom={4}
                          /> 
                          */}

                          <Map
                            markers={places}
                            origem={origem}
                            destino={destino}
                            paradas={paradas}
                            defaultCenter={center}
                            defaultZoom={4}
                          />

                        </BoxTitulo>
                      </TabPanel>

                      <TabPanel value={value} index={4} style={{ width: '100%', height: '455px' }}>
                        <BoxTitulo
                          size={465}
                          width='99%'
                          bgcolor='#FFFFFF'
                          border='1px solid #2699F8'
                          mb={10}
                        >
                          <Grid>
                            <Row>
                              <Col xs={12}>
                                <div className="ag-theme-custom-react" style={{
                                  height: '460px',
                                  width: '100%',
                                  // borderRadius: '10px',
                                  backgroundColor: '#FFFFFF',
                                  border: '5px solid #FFFFFF',
                                }}>
                                  <AgGridReact
                                    id='agHistorico'
                                    name='agHistorico'
                                    rowSelection="single"
                                    onGridReady={(params) => { setVgridHistorico(params.api) }}
                                    columnDefs={colDefsHistorico}
                                    rowData={historico}
                                    frameworkComponents={frameworkComponents}
                                    suppressNavigable={disableEdit}
                                    tooltipShowDelay={0}
                                    pagination={true}
                                    paginationPageSize={10}
                                    rowDragManaged={true}
                                    animateRows={true}
                                    localeText={agPtBr}
                                    onRowDoubleClicked={onRowDoubleClickedHistorico}
                                  >
                                  </AgGridReact>
                                </div>
                              </Col>
                            </Row>
                          </Grid>
                        </BoxTitulo>
                      </TabPanel>

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
            <VeiculosModal
              isShowVeiculos={isShowVeiculos}
              hide={toggleVeiculos}
              pedidoID={pedidoID}
              veiculoID={veiculoID}
              tipoCad={tipoCadVei !== 'E' && tipoCadVei !== 'N' ? 'D' : tipoCadVei}
              disableEdit={(tipoCadVei !== 'E' && tipoCadVei !== 'N' ? true : false) || disableEdit}
              callback={e => callBackVeiculos(e)}
            />
            <RotasModal
              isShowRotas={isShowRotas}
              hide={toggleRotas}
              pedidoID={pedidoID}
              rotaID={rotaID}
              tipoCad={tipoCadVei === 'N' ? tipoCadVei : tipoCadVei !== 'E' && tipoCadVei !== 'N' ? 'D' : tipoCadVei}
              disableEdit={(tipoCadVei === 'N' ? false : tipoCadVei !== 'E' && tipoCadVei !== 'N' ? true : false) || disableEdit}
              callback={e => callBackRotas(e)}
            />
            <HistoricoModal
              isShowHistorico={isShowHistorico}
              hide={toggleHistorico}

              historicoID={historicoID}
              motoristaID={motoristaID}
              clienteID={clienteID}
              operadorID={operadorID}
              pedidoID={pedidoID}

              tipoCad={tipoCadVei !== 'E' && tipoCadVei !== 'N' ? 'D' : tipoCadVei}
              disableEdit={(tipoCadVei !== 'E' && tipoCadVei !== 'N' ? true : false) || disableEdit}
              callback={e => callBackHistorico(e)}
            />
            <ConfirmaModal
              isShowConfirma={isShowConfirma}
              hide={toggleConfirma}
              texto={confTexto}
              texto1={confTexto1}
              modulo={modulo}
              callback={callBack}
            />
          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default PedidoModal