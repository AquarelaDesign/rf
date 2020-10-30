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
} from './styles'

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
import DatePicker from '../../../components/datepicker'

import { AiOutlineSearch } from 'react-icons/ai'
import { RiMoneyDollarBoxLine } from 'react-icons/ri'

import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import { formatToPhone } from 'brazilian-values'


import { FaIcon } from '../../../components/Icone'
import "./modal.css"

import api from '../../../services/rf'
import Axios from 'axios'

import { AgGridReact, gridApi } from 'ag-grid-react'
import agPtBr from '../../../components/agPtBr'

import ConfirmaModal from '../../../components/ConfirmaModal'
import useModalConfirma from '../../../components/ConfirmaModal/useModal'

import GridUsuariosModal from '../../Cadastro/GridUsuariosModal'
import useModalUsuarios from '../../Cadastro/GridUsuariosModal/useModal'

import VeiculosModal from '../VeiculosModal'
import useModalVeiculos from '../VeiculosModal/useModal'

import RotasModal from '../RotasModal'
import useModalRotas from '../RotasModal/useModal'

import HistoricoModal from '../../../components/HistoricoModal'
import useModalHistorico from '../../../components/HistoricoModal/useModal'

import AvariasModal from '../../Financeiro/AvariasModal'
import useModalAvarias from '../../Financeiro/AvariasModal/useModal'

import moment from 'moment'
import Map from '../../../components/Map'

import cadStatus from '../../../services/json/statusPedido.json'

function TabPanel(props) {
  const { children, value, index, ...other } = props

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
})(Tabs)

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
}))((props) => <Tab disableRipple {...props} />)

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

const PedidoModal = ({ isShowPedido, hide, tipoCad, disableEdit, pedidoID, mostra = false }) => {
  const classes = useStyles()

  const [initialValuesPed, setInitialValuesPed] = useState({})
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
  const [cliente, setCliente] = useState([])

  const [avariaID, setAvariaID] = useState(null)
  const [placa, setPlaca] = useState([])
  const { isShowAvarias, toggleAvarias } = useModalAvarias()

  const [confTexto, setConfTexto] = useState('')
  const [confTexto1, setConfTexto1] = useState('')
  const [modulo, setModulo] = useState('')
  
  const [atualiza, setAtualiza] = useState(mostra)

  // const [responseMap, setResponseMap] = useState(null)
  // const [waypoints, setWaypoints] = useState([])
  // const [dadosInfo, setDadosInfo] = useState(null)
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
    try {
      // console.log('**** PedidosModal.useEffect.pedidoID', pedidoID)
      setValue(0)
      buscaPedido(pedidoID)
      carregaDados()
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

    return () => {
      // console.log('**** PedidosModal.useEffect.return')
    }
  }, [pedidoID, tipoCad, atualiza]) // , disableEdit, isShowPedido

  const carregaDados = () => {
    buscaValoresAgregados() // <-- Adicionar busca direta no banco
    buscaSeguros() // <-- Adicionar busca direta no banco
    buscaTabRotas() // <-- Adicionar busca direta no banco
    buscaUsuarios()
    setOperadorID(localStorage.getItem('@rf/userID'))
  }

  const buscaPedido = async (pedidoId) => {
    if (pedidoId) {
      await api
        .get(`/pedidos/${pedidoId}`)
        .then(response => {
          const { data } = response

          data[0].limitecoleta = data[0].limitecoleta ? data[0].limitecoleta.substring(0, 10) : undefined
          data[0].limiteentrega = data[0].limiteentrega ? data[0].limiteentrega.substring(0, 10) : undefined

          setInitialValuesPed(data[0])
          setVeiculos(data[0].veiculos)
          setRotas(data[0].rotas)
          updateMap(data[0].rotas, data[0].localcoleta, data[0].localentrega)
          buscaHistorico(data[0].id)
          setMotoristaID(data[0].motorista_id)

          // console.log('**** PedidosModal.buscaPedido.data', data[0].cliente_id)

          if (data[0].cliente_id !== null) {
            setClienteID(data[0].cliente_id)
            buscaCliente(data[0].cliente_id)
            buscaRotas(true)
            buscaVeiculos(true)
          } else {
            semCliente()
          }

          let temNull = false
          data[0].rotas.forEach(r => {
            if (r.rota_relacionada === null) {
              temNull = true
            }
          })

          if (temNull === true) {
            data[0].rotas.forEach(function(row, index) {
              atualizaOrdem(row.id, index)
            })
            buscaRotas(true)
          }

          window.setFormValue('valor', data[0].valor)
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
    // setInitialValuesPed({
    //   cliente_id: null,
    //   limitecoleta: undefined,
    //   limiteentrega: undefined,
    //   localcoleta: null,
    //   localentrega: null,
    //   motorista_id: null,
    //   status: "",
    //   tipo: "C",
    // })
    window.setFormValue('cliente_id', null)
    window.setFormValue('limitecoleta', undefined)
    window.setFormValue('limiteentrega', undefined)
    window.setFormValue('localcoleta', null)
    window.setFormValue('localentrega', null)
    window.setFormValue('motorista_id', null)
    window.setFormValue('status', "")
    window.setFormValue('tipo', "C")

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
      // window.setFormValue('cpfcnpj', '')
      // window.setFormValue('nome', '')
      // window.setFormValue('contato', '')
      // window.setFormValue('email', '')
      // window.setFormValue('celular', '')
      // window.setFormValue('whats', '')
      // window.setFormValue('logradouro', '')
      // window.setFormValue('numero', '')
      // window.setFormValue('complemento', '')
      // window.setFormValue('bairro', '')
      // window.setFormValue('cidade', '')
      // window.setFormValue('uf', '')
      // window.setFormValue('cep', '')
      setClienteID(null)
      setCliente([])
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
          setCliente(data)
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
    // setInitialValuesPed({ ...initialValuesPed, cliente_id: e })
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
        "tipo": "",
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
      headerName: "Operador",
      field: "operador_id",
      width: 120,
      sortable: true,
      cellRenderer: 'buscaNome',
    },
    {
      headerName: "Motorista",
      field: "motorista_id",
      width: 120,
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
          <button onClick={(e) => editaAvaria(props, e)}
            disabled={disableEdit}
            style={{ backgroundColor: 'transparent' }}
          >
            <Tooltip title="Informar Avaria">
              <span style={{
                alignItems: 'center',
                color: '#ff5330',
                marginLeft: '-18px',
                marginTop: '3px',
              }}>
                <FaIcon icon='btAvarias' size={20} />
              </span>
            </Tooltip>
          </button>
        )
      },
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

    if (typeof pedidoID !== 'number') { return }
    
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

  const FormatWhats = async (props, e) => {
    e.preventDefault()
    if (props.data.whats) {
      window.open(`https://api.whatsapp.com/send?phone=55${props.data.whats}&text=`, "_blank")
    }
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
      headerName: "Motorista",
      field: "motorista_id",
      flex: 1,
      sortable: false,
      cellRenderer: 'buscaNome',
    },
    {
      headerName: "Contato",
      field: "contato",
      flex: 1,
      sortable: false,
    },
    {
      headerName: "",
      field: "whats",
      width: 30,
      sortable: false,
      editable: false,
      cellRendererFramework: (props) => {
        return (
          <button onClick={(e) => FormatWhats(props, e)}
            style={{ backgroundColor: 'transparent' }}
          >
            <Tooltip title={formatToPhone(props.data.whats)}>
              <span style={{
                alignItems: 'center',
                marginLeft: '-18px',
                marginTop: '3px',
              }}>
                <FaIcon icon='Whats' size={20} />
              </span>
            </Tooltip>
          </button>
        )
      },
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

    // console.log('**** PedidoModal.deleteRowRota', selectedData)

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
    // console.log('**** PedidosModal.buscaRotas.pedidoID', pedidoID, stRetorno, typeof pedidoID)
    
    if (typeof pedidoID !== 'number') { return }

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
            // console.log('**** PedidosModal.buscaRotas.temNull', temNull)
            data.forEach(function(row, index) {
              // console.log('**** PedidosModal.buscaRotas.row.index', row, index)
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


  const editaAvaria = async (props, e) => {
    e.preventDefault()
    // const selectedData = props.api.getSelectedRows()

    // setPlaca(props.data.placachassi)
    // setRotaData(selectedData)
    // console.log('**** PedidoModal.editaAvaria', props.data.placachassi)

    const buscaAvaria = async (placa) => {
      if (typeof pedidoID !== 'number') { return }
      
      // console.log('**** PedidosModal.buscaAvaria', pedidoID, placa)
      
      await api
        .post(`/buscaavaria`, {
          "pedido_id": pedidoID,
          "financeiro_id": null,
          "motorista_id": null,
          "fornecedor_id": null,
          "placa": placa,
          "status": null
        })
        .then(response => {
          const { data } = response

          const setaAva = async (dataId) => {
            setTipoCadVei('E')
            setAvariaID(dataId)
            await sleep(300)
            toggleAvarias()
          }
          setaAva(data[0].id)
          
        }).catch((error) => {
          if (error.response) {
            const { data, status } = error.response
            // console.log('**** PedidosModal.buscaAvaria.error.status', status)
            if (status === 404) {
              buscaFinanceiro()
            } else {
              try {
                data.map(mensagem => {
                  toast(mensagem.message, { type: 'error' })
                })
              }
              catch (e) {
                console.log('**** PedidosModal.buscaAvaria.error.data', data)
              }
            }
          } else if (error.request) {
            console.log('**** PedidosModal.buscaAvaria.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }

    buscaAvaria(props.data.placachassi)
   
  }

  const callBackAvarias = (e) => {
    console.log('**** PedidoModal.callBackAvarias', e)
  }


  // ------------------------------------>
  async function calculaValorPedido(values) {
    if (veiculos !== undefined && 
      rotas !== undefined && 
      seguros !== undefined && 
      tabelaDeRotas !== undefined 
      // initialValuesPed.valor === 0
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

        // console.table('**** PedidosModal.calculaValorPedido', values.percentual_desconto, values.valor_desconto)

        let str_val = values.valor_desconto.toString()
             str_val.replace('.', '')
             str_val = str_val.replace(',', '.')
  
        let str_per = values.percentual_desconto.toString()
             str_per.replace('.', '')
             str_per = str_per.replace(',', '.')
        
        let percentual_imposto = 1.12
        let valor_total_pedido = 0
        let valor_total_veiculos_pedido = 0
        let valor_rotas_pedido = 0
        let valor_seguro_pedido = 0
        let valor_seguro_roubo_pedido = 0
        let valor_agregados_pedido = 0
        let valor_imposto_pedido = 0
        let valor_desconto_pedido = parseFloat(str_val)
        let percentual_desconto_pedido = parseFloat(str_per)

        let RotaDesc = ''
        let rotaOk = false
        let valores = []
    
        veiculos.forEach(vei => {
          let tipoVei = 1
          let val_km = 0

          if (vei.tipo === "motos") {
            tipoVei = 3
          } else {
            tipoVei = 1
          }

          let valor_veiculo = vei.valor // Valor do Veiculo

          // Busca valores agregados
          let valor_agregados_veiculo = 0
          valoresAgregados.forEach(valor => {
            if (valor.tipo_de_veiculo_id === tipoVei && valor.imposto === 0) {
              if (valor.exclusivo === 0) {
                valor_agregados_veiculo += valor.valor
              } else {
                val_km = valor.valor
              }
            }
          })

          // Busca os valores do seguro conforme a tabela
          let valor_seguro_veiculo = 0
          let valor_rotas_veiculo = 0

          let rtSeg = []
          let cont = 0
          let reg = {
            origem: '',
            destino: ''
          }
          
          let _tipo = 'O'
          rotas.forEach(r => {
            // console.table('**** PedidosModal.calculaValorPedido.r', r)
            reg['rota'] = r.rota_relacionada - 1 < 0 ? 0 : r.rota_relacionada - 1
            if (r.tipo === 'V') {
              reg['exclusivo'] = true
            } else {
              reg['exclusivo'] = false
            }

            if (_tipo === 'O') {
              reg['origem'] = {cidade: r.cidade, uf: r.uf}
              _tipo = 'D'
            } else {
              reg['destino'] = {cidade: r.cidade, uf: r.uf}
            }

            if (cont > 0) {
              rtSeg.push(reg)
              cont = 0
              reg = {
                origem: '',
                destino: ''
              }

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

          // console.table('**** PedidosModal.calculaValorPedido.rtSeg', rtSeg)
          let ValoresRotas = []
          
          rtSeg.forEach(r => {
            // console.table('**** PedidosModal.calculaValorPedido.forRotas',`${r.origem.cidade}/${r.origem.uf} X ${r.destino.cidade}/${r.destino.uf}`)
            RotaDesc = `${r.origem.cidade}/${r.origem.uf} X ${r.destino.cidade}/${r.destino.uf}`
            // Busca os valores dos seguros para rotas
            seguros.forEach(seg => {

              let uf1 = seg.uf
              let uf2 = r.origem.uf
                  
              if (uf1.toLowerCase() === uf2.toLowerCase()) {
                valor_seguro_veiculo += (valor_veiculo * seg[r.destino.uf.toLowerCase()]) / 100
              }
            })

            // Busca o valor adicional para Rota
            if (r.exclusivo === true) { // Rota exclusiva - valor por km
              // console.table('**** PedidosModal.calculaValorPedido.exclusivo', r.rota, distancia[r.rota].value * val_km, distancia)
              valor_rotas_veiculo += distancia[r.rota].value * val_km
            } else {
              
              for (var i = 0; i < tabelaDeRotas.length; ++i) {
                const rot = tabelaDeRotas[i]

                let cidade_origem = rot.cidade_origem.toLowerCase()
                let cidade_destino = rot.cidade_destino.toLowerCase()
                let cid_origem = r.origem.cidade.toLowerCase()
                let cid_destino = r.destino.cidade.toLowerCase()

                cidade_origem = cidade_origem.normalize("NFD").replace(/[^a-zA-Zs]/g, "")
                cidade_destino = cidade_destino.normalize("NFD").replace(/[^a-zA-Zs]/g, "")
                cid_origem = cid_origem.normalize("NFD").replace(/[^a-zA-Zs]/g, "")
                cid_destino = cid_destino.normalize("NFD").replace(/[^a-zA-Zs]/g, "")

                if (
                  cidade_origem === cid_origem &&
                  rot.uf_origem.toLowerCase() === r.origem.uf.toLowerCase() &&
                  cidade_destino === cid_destino &&
                  rot.uf_destino.toLowerCase() === r.destino.uf.toLowerCase() &&
                  rot.tipo_de_veiculo_id === tipoVei
                ) {
                  ValoresRotas.push({
                    rota: RotaDesc,
                    valor_rota: rot.valor,
                  })
      
                  valor_rotas_veiculo += rot.valor
                  rotaOk = true
                  break
                } 
              }
            }

          }) // rtSeg.forEach

          // console.table('**** PedidosModal.calculaValorPedido.ValoresRotas', ValoresRotas)

          let valor_seguro_roubo_veiculo = (valor_veiculo * 0.03) / 100
          
          let valor_bruto = valor_rotas_veiculo + valor_seguro_veiculo + valor_seguro_roubo_veiculo + valor_agregados_veiculo
          let valor_desconto_veiculo = 0
          
          if (percentual_desconto_pedido > 0) {
            valor_desconto_veiculo = (valor_bruto * percentual_desconto_pedido) / 100
          } 
          
          if (valor_desconto_pedido > 0) {
            valor_desconto_veiculo = valor_bruto - (valor_desconto_pedido / veiculos.length)
          }

          let valor_imposto_veiculo = (valor_bruto - valor_desconto_veiculo) * (percentual_imposto - 1)
          let valor_total_veiculo = (valor_bruto - valor_desconto_veiculo) + valor_imposto_veiculo
          
          // Salvar na tabela 'valores_do_pedido' (por veiculo)
          valores.push({
            placa: vei.placachassi,
            percentual_imposto,
            percentual_desconto: percentual_desconto_pedido,
            valor_veiculo,
            valor_rotas_veiculo,
            valor_seguro_veiculo,
            valor_seguro_roubo_veiculo,
            valor_agregados_veiculo,
            valor_desconto_veiculo,
            valor_imposto_veiculo,
            valor_total_veiculo,
          })

          // valor_total_pedido += valor_veiculo
          valor_total_veiculos_pedido += valor_veiculo
          valor_rotas_pedido += valor_rotas_veiculo
          valor_seguro_pedido += valor_seguro_veiculo
          valor_seguro_roubo_pedido += valor_seguro_roubo_veiculo
          valor_agregados_pedido += valor_agregados_veiculo
          // valor_imposto_pedido += valor_imposto_veiculo
        })

        
        // console.table('**** PedidosModal.calculaValorPedido.valores', valores)

        // valor_total_pedido = (valor_rotas_pedido + valor_seguro_pedido + valor_seguro_roubo_pedido + valor_agregados_pedido + valor_imposto_pedido)

        let valor_bruto_pedido = valor_rotas_pedido + valor_seguro_pedido + valor_seguro_roubo_pedido + valor_agregados_pedido
        
        // Calculo do valor sem desconto
        let valor_total_pedido_sem_desconto = valor_bruto_pedido * percentual_imposto
        
        // Calculo do valor com desconto aplicado
        let valor_total_desconto_pedido = 0
        if (percentual_desconto_pedido > 0) {
          valor_total_desconto_pedido = (valor_bruto_pedido * percentual_desconto_pedido) / 100
        } else if (valor_desconto_pedido > 0) {
          valor_total_desconto_pedido = parseFloat(valor_desconto_pedido)
        }
        valor_imposto_pedido = (valor_bruto_pedido - valor_total_desconto_pedido) * (percentual_imposto - 1)
        valor_total_pedido = (valor_bruto_pedido - valor_total_desconto_pedido) + valor_imposto_pedido

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

        let val = valor_total_pedido.toFixed(2)
        val = val.replace(',', '.')
        val = val.replace('.', ',')
        window.setFormValue('valor', val)

        // console.table('**** PedidosModal.calculaValorPedido.percentual_desconto_pedido', percentual_desconto_pedido > 0, valor_total_desconto_pedido.toFixed(2))
        if (percentual_desconto_pedido > 0) {
          window.setFormValue('valor_desconto', 0)
          // window.setFormValue('valor_desconto', valor_total_desconto_pedido.toFixed(2))
        }

        if (percentual_desconto_pedido === 0 && valor_desconto_pedido > 0) {
          let percentual_aplicado = ((valor_total_pedido_sem_desconto - valor_total_pedido) / valor_total_pedido_sem_desconto) * 100
          percentual_desconto_pedido = percentual_aplicado.toFixed(0)
          window.setFormValue('percentual_desconto', 0)
          // window.setFormValue('percentual_desconto', percentual_desconto_pedido)
        }

        console.log('**** PedidosModal.calculaValorPedido', {
          valor_veiculos: valor_total_veiculos_pedido.toFixed(2),
          valor_transporte_rotas: valor_rotas_pedido.toFixed(2),
          valor_do_seguro: valor_seguro_pedido.toFixed(2),
          valor_do_seguro_roubo: valor_seguro_roubo_pedido.toFixed(2),
          valor_custo_operacional: valor_agregados_pedido.toFixed(2),
          valor_impostos: valor_imposto_pedido.toFixed(2),
          percentual_desconto_pedido: percentual_desconto_pedido,
          valor_desconto_pedido: valor_total_desconto_pedido.toFixed(2),
          valor_total_pedido: valor_total_pedido.toFixed(2),
          valor_total_pedido_sem_desconto: valor_total_pedido_sem_desconto.toFixed(2),
        })
      }
      catch(e) {}

    }

  }

  const updateMap = async (rotas, localcoleta = undefined, localentrega = undefined) => {
    // console.log('**** PedidoModal.updateMap.initialValuesPed', initialValuesPed)
    if (rotas !== undefined) {
      // await sleep(500)

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
          status: r.status,
          id: r.id,
          lat: parseFloat(r.latitude),
          lng: parseFloat(r.longitude),
          nome: r.nome,
          logradouro: r.logradouro,
          numero: r.numero,
          complemento: r.complemento,
          bairro: r.bairro,
          cidade: r.cidade,
          uf: r.uf,
          exclusivo: r.tipo === "V" ? true : false,
        })
      })

      setCenter({
        lat: parseFloat(rt[0].lat),
        lng: parseFloat(rt[0].lng),
      })

      setPlaces(rt)
      setParadas([])

      // console.log('**** PedidoModal.updateMap.rt-01', rt, rt.length)

      if (rt.length > 0) {
        setOrigem(rt[0])
        setDestino(rt[rt.length - 1])

        // console.log('**** PedidoModal.updateMap.rt-02', localcoleta, localentrega)

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

        // console.log('**** PedidoModal.buscaPedido.map', rt[0], rt[rt.length - 1], paradas)
      }

      let rm = []
      // let orig = []
      // let dest = []

      let cont = 0
      let reg = {
        origem: '',
        destino: ''
      }

      let _tipo = 'O'
      rotas.forEach(r => {

        if (_tipo === 'O') {
          reg['origem'] = `${r.latitude},${r.longitude}`
          _tipo = 'D'
        } else {
          reg['destino'] = `${r.latitude},${r.longitude}`
        }

        if (cont > 0) {
          rm.push(reg)
          cont = 0
          reg = {
            origem: '',
            destino: ''
          }

          if (r.rota_relacionada +1 <= rotas.length) {
            reg['origem'] = `${r.latitude},${r.longitude}`
            cont++
          } 
          
        } else {
          cont++
        }
      })

      let o = ''
      let d = ''
      rm.forEach(r => {
        o = o + r.origem + '|'
        d = d + r.destino + '|'
      })

      // console.log('**** PedidoModal.buscaPedido.rm', rm, 'orig', o, 'dest', d)
      buscaDistancia(o, d)
    }
  }

  async function buscaDistancia(orig, dest) {
    const consulta = `https://retornofacil.com.br/scripts/directions.php?origins=${orig}&destinations=${dest}&key=${apiKey}`
    // console.log('**** PedidosModal.buscaDistancia.consulta', consulta)

    Axios.get(consulta, {
    }).then(response => {
      const { data } = response

      // console.log('**** PedidosModal.buscaDistancia.directions', data)

      let dists = []
      // console.log('**** data', response)
      
      for (let x=0; x < data.origin_addresses.length; x++) {
        let dist = {
          origem: data.origin_addresses[x],
          destino: data.destination_addresses[x],
          value: parseFloat(data.rows[x].elements[x].distance.value / 1000) ,
          distancia: `${Math.round(data.rows[x].elements[x].distance.value / 1000)} km`,
          tempo: `${Math.round((data.rows[x].elements[x].distance.value / 1000) / 500)} dias`,
        }
        // console.log('**** distancia', dist)
        dists.push(dist)
      }
      // console.log('**** distancia', dists)

      setDistancia(dists)
      
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
  // <------------------------------------


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
    // console.log('**** PedidoModal.onRowDragEnd.setVgridRotas.data', vgridRotas)

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


  const gerarPagamento  = () => {
    buscaFinanceiro('Gerar')
  }

  const buscaFinanceiro = async (modo = null) => {
    
    if (typeof pedidoID !== 'number') { return }
    
    await api
      .post(`/buscafin`, {
        "tipo": "P",
        "pedido_id": pedidoID,
        "cliente_id": null,
        "motorista_id": motoristaID,
        "operador_id": null,
        "fornecedor_id": null,
        "status": null
      })
      .then(response => {
        const { data, status } = response

        if (modo === null) {
          const setaAva = async () => {
            setTipoCadVei('N')
            await sleep(300)
            toggleAvarias()
          }
          setaAva()
        } else {
          toast(`Já existe um lançamento no financeiro para esse Pedido/Motorista!`, { type: 'alert' })
        }

      }).catch((error) => {
        if (error.response) {
          const { data, status } = error.response

          if (status === 404) {
            geraFinanceiro()
          } else {
            try {
              data.map(mensagem => {
                toast(mensagem.message, { type: 'error' })
              })
            }
            catch (e) {
              console.log('**** PedidosModal.buscaFinanceiro.error.data', data)
            }
          }
        } else if (error.request) {
          console.log('**** PedidosModal.buscaFinanceiro.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }
 
  const geraFinanceiro = async (modo = null) => {
    // console.log('**** PedidosModal.buscaFinanceiro.pedidoID', pedidoID, stRetorno, typeof pedidoID)
    
    if (typeof pedidoID !== 'number') { return }
    
    await api
      .post(`/financeiros`, {
        "tipo": "P",
        "pedido_id": pedidoID,
        "cliente_id": clienteID,
        "motorista_id": motoristaID,
        "operador_id": operadorID,
        "fornecedor_id": null,
        "status": " "
      })
      .then(response => {
        const { data, status } = response
        
        if (modo === null) {
          const setaAva = async () => {
            setTipoCadVei('N')
            await sleep(300)
            toggleAvarias()
          }
          setaAva()
        } else {
          toast(`Lançamento [${data.id}] gerado no financeiro!`, { type: 'alert' })
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
            console.log('**** PedidosModal.buscaFinanceiro.error.data', data)
          }
        } else if (error.request) {
          console.log('**** PedidosModal.buscaFinanceiro.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const bloquearPagamento  = () => {

  }


  async function onSubmit(values) {

    console.log('**** PedidoModal.onSubmit-values', values)
    let newValues = {}
    newValues['limitecoleta'] = moment(values['limitecoleta']).format('YYYY-MM-DD')
    newValues['limiteentrega'] = moment(values['limiteentrega']).format('YYYY-MM-DD')
    newValues['tipo'] = values['tipo']
    newValues['cliente_id'] = values['cliente_id']
    newValues['motorista_id'] = values['motorista_id']
    newValues['localcoleta'] = values['localcoleta']
    newValues['localentrega'] = values['localentrega']
    newValues['status'] = values['status']
    newValues['valor'] = parseFloat(values['valor']).toFixed(2)
    newValues['percentual_desconto'] = parseInt(values['percentual_desconto'])
    newValues['valor_desconto'] = parseFloat(values['valor_desconto']).toFixed(2)
    // console.log('****', newValues)

    
    if (values['valor']) {
      let val = values['valor'].toString()
          val = val.replace('.', '')
          val = val.replace(',', '.')
      newValues['valor'] = parseFloat(val).toFixed(2)
      // newValues['valor'] = Math.round(val).toFixed(2)
    } else {
      newValues['valor'] = parseFloat(values['valor']).toFixed(2)
      // newValues['valor'] = Math.round(values['valor']).toFixed(2)
    }
    
    if (values['valor_desconto']) {
      let val = values['valor_desconto'].toString()
          val = val.replace('.', '')
          val = val.replace(',', '.')

      newValues['valor_desconto'] = parseFloat(val).toFixed(2)
      // newValues['valor_desconto'] = Math.round(val).toFixed(2)
      console.log('**** PedidoModal.onSubmit-values.valor_desconto-0', values['valor_desconto'], val, newValues['valor_desconto'])
    } else {
      newValues['valor_desconto'] = parseFloat(values['valor_desconto']).toFixed(2)
      // newValues['valor_desconto'] = Math.round(values['valor_desconto']).toFixed(2)
      console.log('**** PedidoModal.onSubmit-values.valor_desconto-1', values['valor_desconto'])
    }

    // if (newValues['valor_desconto'] === "NaN") {
    //   newValues['valor_desconto'] = 0
    // }
    
    // if (values['percentual_desconto']) {
    //   let val = values['percentual_desconto'].replace('.', '')
    //   val = val.replace(',', '.')
    //   newValues['percentual_desconto'] = Math.round(val).toFixed(0)
    // } else {
    //   newValues['percentual_desconto'] = Math.round(values['valor']).toFixed(0)
    // }
    
    console.log('**** PedidoModal.onSubmit-newValues', newValues)
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

        setInitialValuesPed(data)
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

  /*
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
  */

  const Condition = ({ when, is, children }) => (
    <Field name={when} subscription={{ value: true }}>
      {({ input: { value } }) => (value === is ? children : null)}
    </Field>
  )

  const required = value => (value ? undefined : '* Obrigatório!')

  const fechaJanela = () => {
    setAtualiza(!atualiza)
    hide()
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
                    {disableEdit ?
                      <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                      :
                      <Tooltip title="Bloquear Pagamento Motorista">
                        <Botao onClick={bloquearPagamento}><FaIcon icon='Bloqueado' size={20} /></Botao>
                      </Tooltip>
                    }
                    {disableEdit ?
                      <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                      :
                      <Tooltip title="Gerar Pagamento Motorista">
                        <Botao onClick={gerarPagamento}><FaIcon icon='btContasPagar' size={20} /></Botao>
                      </Tooltip>
                    }
                    {disableEdit ?
                      <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                      :
                      <Tooltip title="Salvar">
                        <Botao onClick={event => { submit(event) }}><FaIcon icon='Save' size={20} /></Botao>
                      </Tooltip>
                    }
                    <Tooltip title="Fechar Janela">
                      <Botao onClick={fechaJanela}><FaIcon icon='GiExitDoor' size={20} /></Botao>
                    </Tooltip>
                  </RRight>
                </GridModal>
              </BoxTitulo>

              <Form
                onSubmit={onSubmit}
                initialValues={initialValuesPed}
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
                                    <Col xs={1}>
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
                                        style={{ textAlign:"right" }}
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
                                    <Col xs={1}>
                                      <Field
                                        disabled={disableEdit}
                                        // disabled={disableEdit || parseFloat(values.valor_desconto) > 0}
                                        name="percentual_desconto"
                                        component={CssTextField}
                                        type="text"
                                        label="% Desc."
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                        style={{ textAlign:"right" }}
                                        // onChange={e => window.setFormValue('valor', e.target.value)}
                                        // InputProps={{
                                        //   inputComponent: formatCurrency,
                                        // }}
                                      />
                                    </Col>
                                    <Col xs={2}>
                                      <Field
                                        disabled={disableEdit}
                                        // disabled={disableEdit || parseFloat(values.percentual_desconto) > 0}
                                        name="valor_desconto"
                                        component={CssTextField}
                                        type="text"
                                        label="Valor do Desconto"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                        // onChange={e => window.setFormValue('valor', e.target.value)}
                                        // InputProps={{
                                        //   inputComponent: formatCurrency,
                                        // }}
                                        // renderInput={(params) => 
                                        //   <CurrencyTextField
                                        //     {...params}
                                        //     // label="Amount"
                                        //     // variant="standard"
                                        //     // value={value}
                                        //     currencySymbol="R$"
                                        //     //minimumValue="0"
                                        //     outputFormat="string"
                                        //     decimalCharacter=","
                                        //     digitGroupSeparator="."
                                        //     // onChange={(event, value)=> setValue(value)}
                                        //   />
                                        // }
                                      />
                                    </Col>
                                    <Col xs={2}>
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
                                        // renderInput={(params) => 
                                        //   <CurrencyTextField
                                        //     {...params}
                                        //     // label="Amount"
                                        //     // variant="standard"
                                        //     // value={value}
                                        //     currencySymbol="R$"
                                        //     //minimumValue="0"
                                        //     outputFormat="string"
                                        //     decimalCharacter=","
                                        //     digitGroupSeparator="."
                                        //     // onChange={(event, value)=> setValue(value)}
                                        //   />
                                        // }
                                        InputProps={{
                                          // inputComponent: formatCurrency,
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              <button type="button" onClick={() => calculaValorPedido(values)}
                                                style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
                                                disabled={disableEdit}
                                              >
                                                <RiMoneyDollarBoxLine />
                                              </button>
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </Col>
                                    <Col xs={2}>
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
                                    <Col xs={3}>
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
                                        initialValue={cliente.cpfcnpj}
                                        value={cliente.cpfcnpj}
                                        InputProps={{
                                          inputComponent: formatCpfCnpj,
                                        }}
                                      />
                                    </Col>
                                    <Col xs={7}>
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
                                        initialValue={cliente.nome}
                                        value={cliente.nome}
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
                                        initialValue={cliente.contato}
                                        value={cliente.contato}
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
                                        initialValue={cliente.email}
                                        value={cliente.email}
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
                                        initialValue={cliente.celular}
                                        value={cliente.celular}
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
                                        initialValue={cliente.whats}
                                        value={cliente.whats}
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
                                        initialValue={cliente.logradouro}
                                        value={cliente.logradouro}
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
                                        initialValue={cliente.numero}
                                        value={cliente.numero}
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
                                        initialValue={cliente.complemento}
                                        value={cliente.complemento}
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
                                        initialValue={cliente.bairro}
                                        value={cliente.bairro}
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
                                        initialValue={cliente.cidade}
                                        value={cliente.cidade}
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
                                        initialValue={cliente.uf}
                                        value={cliente.uf}
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
                                        initialValue={cliente.cep}
                                        value={cliente.cep}
                                        InputProps={{
                                          inputComponent: formatCep,
                                        }}
                                      />
                                    </Col>

                                    <Col xs={1}>
                                      <div style={{ visibility: 'hidden' }}>
                                        <Field
                                          disabled={true}
                                          name="localcoleta"
                                          component={CssTextField}
                                          type="text"
                                          label="Coleta"
                                          variant="outlined"
                                          fullWidth
                                          size="small"
                                          margin="dense"
                                          style={{ textAlign:"right" }}
                                        />
                                      </div>
                                    </Col>
                                    <Col xs={1}>
                                      <div style={{ visibility: 'hidden' }}>
                                        <Field
                                          disabled={true}
                                          name="localentrega"
                                          component={CssTextField}
                                          type="text"
                                          label="Entrega"
                                          variant="outlined"
                                          fullWidth
                                          size="small"
                                          margin="dense"
                                          style={{ textAlign:"right" }}
                                        />
                                      </div>
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
                                    frameworkComponents={frameworkComponents}
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
              rotas={rotas}
            />
            <AvariasModal
              isShowAvarias={isShowAvarias}
              hide={toggleAvarias}
              
              pedidoID={pedidoID}
              placa={placa}
              avariaID={avariaID}
              
              tipoCad={tipoCadVei === 'N' ? tipoCadVei : tipoCadVei !== 'E' && tipoCadVei !== 'N' ? 'D' : tipoCadVei}
              disableEdit={(tipoCadVei === 'N' ? false : tipoCadVei !== 'E' && tipoCadVei !== 'N' ? true : false) || disableEdit}
              callback={e => callBackAvarias(e)}
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