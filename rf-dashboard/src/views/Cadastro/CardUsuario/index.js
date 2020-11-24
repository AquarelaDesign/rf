/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { makeStyles } from '@material-ui/core/styles'
import { isCNPJ, isCPF } from 'brazilian-values'
import MaskedInput from 'react-text-mask'
import Axios from 'axios'

import { Grid, Row, Col } from 'react-flexbox-grid'
import { Form, Field } from 'react-final-form'

import '../../../assets/scss/agGrid.scss'
import { AgGridReact, gridApi } from 'ag-grid-react'
import agPtBr from '../../../components/agPtBr'

import moment from 'moment'

import { AiOutlineSearch } from 'react-icons/ai'
import {
  Box,
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

import { Texto, BoxTitulo } from './styles'

import DocsModal from '../../Cadastro/DocsModal'
import useModalDocs from '../../Cadastro/DocsModal/useModal'

import UserModal from '../../Cadastro/UserModal'
import useModalUser from '../../Cadastro/UserModal/useModal'

import ConfirmaModal from '../../../components/ConfirmaModal'
import useModalConfirma from '../../../components/ConfirmaModal/useModal'

import HistoricoModal from '../../../components/HistoricoModal'
import useModalHistorico from '../../../components/HistoricoModal/useModal'

// import { msgerror } from '../../../globais'
import api from '../../../services/rf'
import { FaIcon } from '../../../components/Icone'

import cadBancos from '../../../services/json/bancos.json'
// import cadEstados from '../../../services/json/estados.json'
// import cadTipoVeiculo from '../../../services/json/tipoveiculo.json'

import Upload from './uploadNew'
import DatePicker from '../../../components/datepicker'
import { values } from 'lodash'
// import useModal from '../../Email/useModal'

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
    top: 60,
    right: 32,
  },
  botoesvei: {
    position: 'absolute',
    top: 110,
    right: 32,
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

export default function CardUsuario({ tipo, usuarioId }) {
  const classes = useStyles()

  const [initialValues, setInitialValues] = useState({})
  const [value, setValue] = useState(0)
  const [disableEdit, setDisableEdit] = useState(false)
  const [ultimoCep, setUltimoCep] = useState('')
  const [dadosBancarios, setDadosBancarios] = useState('visible')
  const [tipoCad, setTipoCad] = useState(tipo)
  const [tipoCadVei, setTipoCadVei] = useState('')
  const [tipoCadastro, setTipoCadastro] = useState('')
  // const [isMounted, setIsMounted] = useState(false)
  const [userID, setUserID] = useState(usuarioId)
  const [vgridApi, setVgridApi] = useState(gridApi)
  const [veiculos, setVeiculos] = useState([])
  const [atualizaCEP, setAtualizaCEP] = useState(false)
  // const [mostraVeiculos, setMostraVeiculos] = useState(false)
  const [status, setStatus] = useState('')
  const [veiculoId, setVeiculoId] = useState(0)

  const [excluiId, setExcluiId] = useState(null)
  const [placaExclui, setPlacaExclui] = useState(null)
  const [propsE, setPropsE] = useState(null)
  const [sData, setSData] = useState(null)
  
  const [vgridHistorico, setVgridHistorico] = useState(gridApi)
  const [historico, setHistorico] = useState([])
  const [motoristaID, setMotoristaID] = useState(null)
  const [clienteID, setClienteID] = useState(null)
  const [operadorID, setOperadorID] = useState(null)
  const [operador_ID, setOperador_ID] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [historicoID, setHistoricoID] = useState(null)
  const { isShowHistorico, toggleHistorico } = useModalHistorico()

  const { isShowDocs, toggleDocs } = useModalDocs()
  const { isShowUser, toggleUser } = useModalUser()
  const { isShowConfirma, toggleConfirma } = useModalConfirma()

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    try {

      if (tipoCad !== 'N' && tipoCad !== 'E') {
        setDisableEdit(true)
      }

      if (userID !== null && tipoCad !== 'N') {
        buscaUsuario()
      }

      if (tipoCad === 'N' && tipoCadastro === '') {
        setTipoCadastro('M')
        valTipoCadastro('M')
        window.setFormValue('tipo', 'M')
        window.setFormValue('status', 'I')
        window.setFormValue('estado', ' ')
      }

      setOperador_ID(localStorage.getItem('@rf/userID'))
      buscaUsuarios()

    } catch (error) {
      if (error.response) {
        const { data } = error.response
        data.map(mensagem => {
          toast(mensagem.message, { type: 'error' })
        })
      } else if (error.request) {
        console.error('*** bu-1.2', error)
        // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    }
  }, [userID, tipoCad, disableEdit])

  useEffect(() => {
    if (vgridApi !== undefined) {
      vgridApi.addEventListener("rowEditingStarted", onRowEditingStarted)
      vgridApi.addEventListener("rowEditingStopped", onRowEditingStopped)
    }

    return () => {
      if (vgridApi !== undefined) {
        vgridApi.removeEventListener("rowEditingStarted", onRowEditingStarted)
        vgridApi.removeEventListener("rowEditingStopped", onRowEditingStopped)
      }
    }
  }, [vgridApi])

  function onRowEditingStarted() {
  }

  const onRowEditingStopped = async () => {
  }

  const buscaUsuario = async () => {
    if (userID) {
      await api
        .get(`/usuarios/${userID}`)
        .then(response => {
          const { data } = response

          data.user_id = data.user_id === 1 ? true : false

          if (data.tipo === 'M') {
            setOperadorID(null)
            setMotoristaID(data.id)
            setClienteID(null)
            buscaHistorico(null, data.id, null)
          } else if (data.tipo === 'C') {
            setOperadorID(null)
            setMotoristaID(null)
            setClienteID(data.id)
            buscaHistorico(null, null, data.id)
          } else if (data.tipo === 'O') {
            setOperadorID(data.id)
            setMotoristaID(null)
            setClienteID(null)
            buscaHistorico(data.id, null, null)
          } else {
            setMotoristaID(null)
            setClienteID(null)
          }
          
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
              console.log('**** CardUsuario.buscaUsuario.error.data', data)
            }
          } else if (error.request) {
            toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  const buscaVeiculosUsuario = async () => {
    if (userID) {
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
              console.log('**** CardUsuario.buscaVeiculosUsuario.error.data', data)
            }
          } else if (error.request) {
            toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })
    }
  }

  const frameworkComponents = {
    buscaNome: BuscaNome,
  }

  function BuscaNome(params) {
    return usuarios.filter(user => user.id === params.value).map(
      fusu => {
        return fusu['nome']
      }
    )
  }

  const buscaUsuarios = async () => {
    await api
      .get(`/usuarios`)
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
            console.log('**** CardUsuario.buscaUsuarios.error.data', data)
          }
        } else if (error.request) {
          console.log('**** CardUsuario.buscaUsuarios.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const buscaHistorico = async (operadorID, motoristaID, clienteID) => {
    // console.log('**** CardUsuario.buscaHistorico.pedidoId', pedidoId)
    await api
      .post(`/buscahistoricos`, {
        "motorista_id": motoristaID,
        "cliente_id": clienteID,
        "operador_id": operadorID,
        "pedido_id": null,
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
            console.log('**** CardUsuario.buscaHistorico.error.data', data)
          }
        } else if (error.request) {
          console.log('**** CardUsuario.buscaHistorico.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const salvaHistorico = async (observacao) => {
    // console.log('**** CardUsuario.salvaHistorico.pedidoId', pedidoId)
    await api
      .post(`/historicos`, {
        "motorista_id": motoristaID,
        "cliente_id": clienteID,
        "operador_id": operador_ID,
        "pedido_id": null,
        "titulo_pagar_id": null,
        "titulo_receber_id": null,
        "observacao": observacao, 
        "valor": 0
      })
      .then(response => {
        const { data } = response
        buscaHistorico(operadorID, motoristaID, clienteID)
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** CardUsuario.salvaHistorico.error.data', data)
          }
        } else if (error.request) {
          console.log('**** CardUsuario.salvaHistorico.error', error)
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

  const onRowDoubleClickedVeiculos = (params) => {
    setVeiculoId(params.data.id)
    setTipoCadVei(disableEdit ? 'D' : tipo)
    toggleDocs()
  }

  const callBackHistorico = (e) => {
    buscaHistorico(operadorID, motoristaID, clienteID)
  }

  const colDefsHistorico = [
    {
      headerName: "Data",
      field: "updated_at",
      width: 200,
      sortable: true,
      cellRenderer: 'formataData',
    },
    {
      headerName: "Operador",
      field: "operador_id",
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

  function Estado(estado) {
    // [] Disponível, Aguardando A[P]rovacao, [A]guardando Coleta, Em [T]ransporte, 
    // [B]loqueado, [R]ecusado, [7]Suspensão de 7 dias

    // console.log('**** values', values.user_id, initialValues.user_id)

    if (tipoCadastro === 'M' || initialValues.user_id === true) {
      switch (estado) {
        case ' ': {
          if (status === 'A') {
            return (
              <span style={{ color: 'green' }}>
                <FaIcon icon='FaRegThumbsUp' size={20} />
                {tipoCadastro === 'M' || initialValues.user_id === true ? ' DISPONÍVEL' : ' ATIVO'}
              </span>
            )
          } else {
            return (<></>)
            // return (<span style={{ color: 'gray' }}><FaIcon icon='FaCircle' size={20} /></span>)
          }
        }
        case 'P': return (<span style={{ color: 'blue' }}><FaIcon icon='FaTruckLoading' size={20} /> AGUARDANDO APROVAÇÃO</span>)
        case 'A': return (<span style={{ color: 'orange' }}><FaIcon icon='FaHandPaper' size={20} /> AGUARDANDO COLETA</span>)
        case 'T': return (<span style={{ color: 'red' }}><FaIcon icon='GrDeliver' size={20} /> EM TRANSPORTE</span>)
        case 'B': return (<span style={{ color: 'red' }}><FaIcon icon='FcCancel' size={20} /> BLOQUEADO</span>)
        case 'R': return (<span style={{ color: 'red' }}><FaIcon icon='FiAlertOctagon' size={20} /> RECUSADO</span>)
        case '7': return (<span style={{ color: 'orange' }}><FaIcon icon='FiAlertTriangle' size={20} /> SUSPENÇÃO 7 DIAS</span>)
        default: return (<></>)
      }
    } else {
      if (estado === ' ' || !estado) {
        return (<></>)
        // return (<span style={{ color: 'gray' }}><FaIcon icon='FaCircle' size={20} /></span>)
      } else {
        return (<span style={{ color: 'green' }}><FaIcon icon='FaCircle' size={20} /></span>)
      }
    }
  }

  // function TipoVeiculo() {
  //   let arrTipo = []
  //   cadTipoVeiculo.map((item) => {
  //     arrTipo.push(item.tipo)
  //   })
  //   return arrTipo
  // }

  function Tipo(tipo) {
    switch (tipo) {
      case 'O': return (<span><FaIcon icon='FaHeadphonesAlt' size={20} /> OPERADOR</span>)
      case 'M': return (<span><FaIcon icon='FaTruck1' size={20} /> MOTORISTA</span>)
      case 'C': return (<span><FaIcon icon='FaUserTie' size={20} /> CLIENTE</span>)
      case 'F': return (<span><FaIcon icon='supplier' size={20} /> FORNECEDOR</span>)
      default: return (<></>)
    }
  }

  function Status(status) {
    setStatus(status)
    switch (status) {
      case 'A': return (
        <span style={{ color: 'green' }}><FaIcon icon='FaCircle' size={20} /></span>
        )
      // case 'I': return (<span style={{ color: 'gray' }}><FaIcon icon='FaCircle' size={20} /></span>)
      default: return (<></>)
    }
  }

  // function createNewRowData() {
  //   var newData = {
  //     placachassi: "",
  //     modelo: "",
  //     ano: null,
  //     tipo: "CARRETA",
  //     vagas: 11,
  //     id: null,
  //     usuario_id: userID,
  //   };
  //   return newData
  // }

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

  // const onBtStartEditing = (key, char, pinned, row = 0) => {
  //   vgridApi.setFocusedCell(0, 'placachassi', pinned)
  //   vgridApi.startEditingCell({
  //     rowIndex: row,
  //     colKey: 'placachassi',
  //     rowPinned: pinned,
  //     keyPress: key,
  //     charPress: char,
  //   })
  // }

  // const handleAddRow = (e) => {
  //   e.preventDefault()
  //   const rowDataItem = createNewRowData()
  //   vgridApi.applyTransaction({ add: [rowDataItem] })
  //   onBtStartEditing(null, null, null, vgridApi.getLastDisplayedRow())
  // }

  const onDocs = async (e, tipo) => {
    e.preventDefault()

    if (tipo === 'E') {
      const selectedData = vgridApi.getSelectedRows()

      if (!selectedData) {
        toast('Você deve selecionar um veículo para editar!', { type: 'warning' })
        return
      }

      if (selectedData.length === 0) {
        toast('Você deve selecionar um veículo para editar!', { type: 'warning' })
        return
      }
      setVeiculoId(selectedData[0].id)
    }
    setTipoCadVei(disableEdit ? 'D' : tipo)

    toggleDocs()
  }

  const onAcesso = async (e) => {
    e.preventDefault()
    
    if (!usuarioId) {
      toast(`O registro do usuário ainda não foi criado, por favor salve o registro e tente novamente!`, { type: 'error' })
      return
    }
    toggleUser()
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

  const excluiVeiculo = async () => {
    if (excluiId) {
      api.delete(`/veiculosm/${excluiId}`,
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
          propsE.api.applyTransaction({ remove: sData })
            
        } else {
          toast(response.data[0].message,
            { type: 'error' })
        }

        setExcluiId(null)
        setPlacaExclui(null)
        setPropsE(null)
        setSData(null)
      
      }).catch((error) => {
        setExcluiId(null)
        setPlacaExclui(null)
        setPropsE(null)
        setSData(null)

        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** CardUsuario.excluiVeiculo.error.data', data)
          }
        } else if (error.request) {
          console.log('**** CardUsuario.excluiVeiculo.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
    }
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
      headerName: "Tipo",
      field: "tipo",
      flex: 1,
      sortable: true,
      // editable: true,
      // cellEditor: 'agSelectCellEditor',
      // cellEditorParams: {
      //   values: TipoVeiculo(), // ['CARRETA', 'CAVALO', 'PLATAFORMA'],
      // },
    },
    {
      headerName: "Vagas",
      field: "vagas",
      width: 100,
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

  const onSubmit = async (values) => {
    if (atualizaCEP) {
      return
    }
    await sleep(300)

    let newValues = {}
    for (let key in values) {
      if (values[key] && typeof values[key] === 'string') {
        if (key === 'habilitacaovct' || key === 'ANTTvct') {
          if (values[key]) {
            newValues[key] = moment(values[key]).format('YYYY-MM-DD')
          } else {
            newValues[key] = values[key]
          }
        } else if (key === 'email' || key === 'foto' || key === 'habilitacaoimg' || key === 'ANTTimg') {
          newValues[key] = values[key]
        } else if (key === 'cep' || key === 'cpfcnpj' || key === 'whats' || key === 'telefone' || key === 'celular') {
          newValues[key] = values[key].replace(/\D/g, '')
        } else if (key === 'status') {
          
        } else {
          newValues[key] = values[key].toUpperCase()
        }
      } else {
        newValues[key] = values[key]
        if (key === 'user_id') {
          newValues[key] = values[key] === true ? 1 : null
        }
      }
    }

    // console.log('**** CardUsuario.onSubmit.newValues', newValues)

    let apiParams = {}

    if (userID !== null && tipoCad === 'E') {
      apiParams = {
        method: 'put',
        url: `/usuarios/${userID}`,
        data: JSON.stringify(newValues),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    } else {
      newValues['status'] = 'I'
      apiParams = {
        method: 'post',
        url: `/usuarios`,
        data: JSON.stringify(newValues),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    }

    await api(apiParams)
      .then(response => {
        const { data } = response

        data.user_id = data.user_id === 1 ? true : false

        setTipoCad('E')
        setUserID(data.id)
        setInitialValues(data)
        setTipoCadastro(data.tipo)
        valTipoCadastro(data.tipo)
        setVeiculos(data.veiculos)

        if (response.status === 200) {
          toast('Registro atualizado com sucesso!', { type: 'success' })
          salvaHistorico(
            `Cadastro ${userID !== null && tipoCad === 'E' ? 'Atualizado' : 'Criado'} com sucesso, `
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
            console.log('**** CardUsuario.onSubmit.error.data', data)
          }
        } else if (error.request) {
          console.log('**** CardUsuario.onSubmit.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })

  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const required = value => (value ? undefined : '* Obrigatório!')

  const valTipoCadastro = (value) => {
    if (value === 'O' || (value === 'C' && !initialValues.user_id)) {
      setDadosBancarios('hidden')
    } else {
      setDadosBancarios('visible')
    }

    setTipoCadastro(value)

    return undefined
  }

  const CpfCnpjValido = (value) => {
    if (!value) {
      return value
    }

    const valor = value
      .replace('.', '')
      .replace('-', '')
      .replace('/', '')
      .replace(' ', '')
      .replace('.', '')

    if (valor.trim().length === 11) {
      // console.log('**** valor CPF', valor, isCPF(valor))

      if (!isCPF(valor.trim())) {
        return 'CPF Inválido!'
      } else {
        return undefined
      }
    } else if (valor.trim().length === 14) {
      // console.log('**** valor CNPJ', valor, isCNPJ(valor))

      if (!isCNPJ(valor.trim())) {
        return 'CNPJ Inválido!'
      } else {
        return undefined
      }
    } else {
      return undefined
    }
  }

  const validaCEP = async (value) => {
    setAtualizaCEP(true)

    if (!value) {
      setAtualizaCEP(false)
      return value
    }

    const cep = value.replace('-', '')
    if (cep.trim().length < 8) {
      setAtualizaCEP(false)
      return value
    }

    if (ultimoCep === cep) {
      setAtualizaCEP(false)
      return
    }
    setUltimoCep(cep)

    const prot = window.location.protocol // === 'http' ? 'http' : 'https'
    const port = window.location.protocol === 'http:' ? 3003 : 3004
    const service = `${prot}//www.retornofacil.com.br:${port}/api/cep/${cep}`

    Axios.get(service, {})
      .then(response => {
        const { data } = response.data
        if (response.data.error) {
          // toast(response.data.message, { type: 'error' })
          toast('O CEP informado não foi encontrado', { type: 'error' })
          setAtualizaCEP(false)
          return
        }

        const Logradouro = `${data[0].data[0].Tipo_Logradouro} ${data[0].data[0].Logradouro}`
        const Bairro = data[0].data[0].Bairro
        const Cidade = data[0].data[0].Cidade
        const UF = data[0].data[0].UF

        if (values.logradouro === '' ||
          values.logradouro === null ||
          values.logradouro === undefined) {
          window.setFormValue('logradouro', Logradouro.toUpperCase())
          window.setFormValue('bairro', Bairro.toUpperCase())
          window.setFormValue('cidade', Cidade.toUpperCase())
          window.setFormValue('uf', UF.toUpperCase())
        }
        setAtualizaCEP(false)
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** CardUsuario.validaCEP.error.data', data)
          }
        } else if (error.request) {
          console.log('**** CardUsuario.validaCEP.error.data', error)
        } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
        setAtualizaCEP(false)
      })
  }

  const composeValidators = (...validators) => value =>
    validators.reduce((error, validator) => error || validator(value), undefined)

  return (
    <div
      className={classes.root}
      style={{ height: '490px', width: '100%', borderRadius: '10px', backgroundColor: '#FFFFFF' }}>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={required}
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

          // console.log('**** CardUsuario.return.values.user_id', values.user_id, tipoCadastro, userID)

          return (
            <form onSubmit={handleSubmit} noValidate>
              <Tabs value={value} onChange={handleChange} aria-label="Dados do Usuário">
                <Tab label="Usuário" {...a11yProps(0)} />
                {(tipoCadastro === 'M' || values.user_id === true) && userID ?
                  <Tab label="Veículos" {...a11yProps(1)} />
                  : null}
                <Tab label="Histórico" {...a11yProps(2)} />
              </Tabs>

              {!disableEdit &&
                <div className={classes.botoes}>
                  {usuarioId &&
                    <>
                      <button onClick={(e) => onAcesso(e)}
                        style={{ backgroundColor: 'transparent' }}
                      >
                        <Tooltip title="Acesso">
                          <span style={{
                            alignItems: 'center',
                            color: 'orange',
                            cursor: 'pointer',
                            marginTop: '3px',
                          }}>
                            <FaIcon icon='Seguranca' size={26} />
                          </span>
                        </Tooltip>
                      </button>

                      <button onClick={() => {
                        window.setFormValue('estado', values.estado === 'B' ? ' ' : 'B')
                      }}
                        style={{ backgroundColor: 'transparent' }}
                      >
                        <Tooltip title={values.estado !== 'B' ? "Bloquear acesso" : "Desbloquear acesso"}>
                          <span style={{
                            alignItems: 'center',
                            color: `${values.estado !== 'B' ? 'red' : 'green'}`,
                            cursor: 'pointer',
                            marginTop: '3px',
                          }}>
                            <FaIcon icon='Bloqueado' size={26} />
                          </span>
                        </Tooltip>
                      </button>

                      {(tipoCadastro === 'M' || values.user_id === true) && 
                        <>
                          <button onClick={() => {
                            window.setFormValue('estado', values.estado === 'R' ? ' ' : 'R')
                          }}
                            style={{ backgroundColor: 'transparent' }}
                          >
                            <Tooltip title={values.estado !== 'R' ? "Recusar" : "Liberar"}>
                              <span style={{
                                alignItems: 'center',
                                color: `${values.estado !== 'R' ? 'red' : 'green'}`,
                                cursor: 'pointer',
                                marginTop: '3px',
                              }}>
                                <FaIcon icon='Recusado' size={24} />
                              </span>
                            </Tooltip>
                          </button>

                          <button onClick={() => {
                            window.setFormValue('estado', values.estado === '7' ? ' ' : '7')
                          }}
                            style={{ backgroundColor: 'transparent' }}
                          >
                            <Tooltip title={values.estado !== '7' ? "Suspender por 7 dias" : "Liberar"}>
                              <span style={{
                                alignItems: 'center',
                                color: `${values.estado !== '7' ? 'orange' : 'green'}`,
                                cursor: 'pointer',
                                marginTop: '3px',
                              }}>
                                <FaIcon icon='Suspenso' size={24} />
                              </span>
                            </Tooltip>
                          </button>
                        </>
                      }
                    </>
                  }

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

              <TabPanel value={value} index={0} id='cadUsu'>
                <Grid fluid>
                  <Row>
                    <Col xs={2}>
                      <Field
                        name="foto"
                        userID={userID}
                        disabled={disableEdit}
                      >
                        {props => (
                          <div>
                            <Upload {...props} />
                          </div>
                        )}
                      </Field>
                      {/* Tratar o erro de componente */}
                      <div className={classes.status}>
                        {Status(values.status)}
                      </div>
                      <div className={classes.estado}>
                        {Estado(values.estado)}
                      </div>

                    </Col>
                    <Col xs={10}>
                      <Grid xs={12}>
                        <Row middle="xs">
                          <Col xs={2}>
                            <label>
                              <Field
                                disabled={disableEdit}
                                name="tipo"
                                component="input"
                                type="radio"
                                value="O"
                                validate={valTipoCadastro}
                              />{' '}
                              {Tipo('O')}
                            </label>
                          </Col>
                          <Col xs={2}>
                            <label>
                              <Field
                                disabled={disableEdit}
                                name="tipo"
                                component="input"
                                type="radio"
                                value="M"
                                validate={valTipoCadastro}
                              />{' '}
                              {Tipo('M')}
                            </label>
                          </Col>
                          <Col xs={2}>
                            <label>
                              <Field
                                disabled={disableEdit}
                                name="tipo"
                                component="input"
                                type="radio"
                                value="C"
                                validate={valTipoCadastro}
                              />{' '}
                              {Tipo('C')}
                            </label>
                          </Col>
                          <Col xs={2}>
                            <label>
                              <Field
                                disabled={disableEdit}
                                name="tipo"
                                component="input"
                                type="radio"
                                value="F"
                                validate={valTipoCadastro}
                              />{' '}
                              {Tipo('F')}
                            </label>
                          </Col>
                          <Col xs={2}></Col>
                          <Col xs={2}>
                            {(values.tipo === 'M' || values.tipo === 'C') &&
                            <label>
                              <Field
                                disabled={disableEdit}
                                name="user_id"
                                component="input"
                                type="checkbox"
                                // value="F"
                                // validate={valTipoCadastro}
                              />{' '}
                              {values.tipo === 'M' ? Tipo('C') : Tipo('M')}
                            </label>
                            }
                          </Col>
                        </Row>
                        <Row style={{ minHeight: '65px' }}>
                          <Col xs={12}>
                            <Field
                              disabled={disableEdit}
                              name="nome"
                              component={CssTextField}
                              type="text"
                              validate={required}
                              label="Nome/Razão Social"
                              variant="outlined"
                              size="small"
                              fullWidth
                              margin="dense"
                            // className={clsx(classes.textField, classes.withoutLabel)}
                            />
                          </Col>
                        </Row>
                        <Row style={{ minHeight: '65px' }}>
                          <Col xs={3}>
                            <Field
                              disabled={disableEdit}
                              name="cpfcnpj"
                              component={CssTextField}
                              type="text"
                              validate={composeValidators(required, CpfCnpjValido)}
                              label="CPF/CNPJ"
                              variant="outlined"
                              size="small"
                              fullWidth
                              margin="dense"
                              // pattern="[\d|.|-|/]{11,14}"
                              InputProps={{
                                inputComponent: formatCpfCnpj,
                              }}
                            // className={clsx(classes.textField)}
                            />
                          </Col>
                          <Col xs={3}>
                            <Field
                              disabled={disableEdit}
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
                            // className={clsx(classes.textField)}
                            />
                          </Col>
                          <Col xs={3}>
                            <Field
                              disabled={disableEdit}
                              name="whats"
                              component={CssTextField}
                              type="text"
                              validate={required}
                              label="WhatsApp"
                              variant="outlined"
                              fullWidth
                              size="small"
                              margin="dense"
                              InputProps={{
                                inputComponent: formatCelular,
                              }}
                            // className={clsx(classes.textField)}
                            />
                          </Col>
                          <Col xs={3}>
                            <Field
                              disabled={disableEdit}
                              name="telefone"
                              component={CssTextField}
                              type="text"
                              label="Telefone"
                              variant="outlined"
                              fullWidth
                              size="small"
                              margin="dense"
                              InputProps={{
                                inputComponent: formatCelular,
                              }}
                            // className={clsx(classes.textField)}
                            />
                          </Col>
                        </Row>
                      </Grid>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2}>
                      <Field
                        disabled={disableEdit}
                        name="ierg"
                        component={CssTextField}
                        type="text"
                        label="RG/IE"
                        variant="outlined"
                        fullWidth
                        size="small"
                        margin="dense"
                      />
                    </Col>
                    <Col xs={10}>
                      <Grid xs={12}>
                        <Row style={{ minHeight: '65px' }}>
                          <Col xs={3}>
                            <Field
                              disabled={disableEdit}
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
                          <Col xs={9}>
                            <Field
                              disabled={disableEdit}
                              name="email"
                              component={CssTextField}
                              type="text"
                              // validate={tipoCadastro !== 'C' && tipoCadastro !== 'F' ? false : required}
                              label="Email"
                              variant="outlined"
                              fullWidth
                              size="small"
                              margin="dense"
                            />
                          </Col>
                        </Row>
                      </Grid>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2}>
                      <Field
                        disabled={disableEdit}
                        name="cep"
                        component={CssTextField}
                        type="text"
                        validate={tipoCadastro !== 'C' && tipoCadastro !== 'F' ? false : required}
                        label="CEP"
                        variant="outlined"
                        fullWidth
                        size="small"
                        margin="dense"
                        // pattern="[\d|-]{8}"
                        InputProps={{
                          inputComponent: formatCep,
                          endAdornment: (
                            <InputAdornment position="end">
                              <button type="button" onClick={() => validaCEP(values.cep)}
                                style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
                              >
                                <AiOutlineSearch />
                              </button>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Col>
                    <Col xs={10}>
                      <Grid xs={12}>
                        <Row style={{ minHeight: '65px' }}>
                          <Col xs={9}>
                            <Field
                              disabled={disableEdit}
                              name="logradouro"
                              component={CssTextField}
                              type="text"
                              validate={tipoCadastro !== 'C' && tipoCadastro !== 'F' ? false : required}
                              label="Endereço"
                              variant="outlined"
                              fullWidth
                              size="small"
                              margin="dense"
                            // InputProps={{
                            //   readOnly: true,
                            // }}
                            />
                          </Col>
                          <Col xs={3}>
                            <Field
                              disabled={disableEdit}
                              name="numero"
                              component={CssTextField}
                              type="text"
                              validate={tipoCadastro !== 'C' && tipoCadastro !== 'F' ? false : required}
                              label="Número"
                              variant="outlined"
                              fullWidth
                              size="small"
                              margin="dense"
                            />
                          </Col>
                        </Row>
                      </Grid>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2}>
                      <Field
                        disabled={disableEdit}
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
                    <Col xs={10}>
                      <Grid xs={12}>
                        <Row style={{ minHeight: '65px' }}>
                          <Col xs={5}>
                            <Field
                              disabled={disableEdit}
                              name="bairro"
                              component={CssTextField}
                              type="text"
                              validate={tipoCadastro !== 'C' ? false : required}
                              label="Bairro"
                              variant="outlined"
                              fullWidth
                              size="small"
                              margin="dense"
                            // InputProps={{
                            //   readOnly: true,
                            // }}
                            />
                          </Col>
                          <Col xs={5}>
                            <Field
                              disabled={disableEdit}
                              name="cidade"
                              component={CssTextField}
                              type="text"
                              validate={tipoCadastro === 'O' ? false : required}
                              label="Cidade"
                              variant="outlined"
                              fullWidth
                              size="small"
                              margin="dense"
                            />
                          </Col>
                          <Col xs={2}>
                            <Field
                              disabled={disableEdit}
                              name="uf"
                              component={CssTextField}
                              type="text"
                              validate={tipoCadastro === 'O' ? false : required}
                              label="UF"
                              variant="outlined"
                              fullWidth
                              size="small"
                              margin="dense"
                            // InputProps={{
                            //   readOnly: true,
                            // }}
                            />
                          </Col>
                        </Row>
                      </Grid>
                    </Col>
                  </Row>
                  <Row style={{ visibility: dadosBancarios }}>
                    <Col xs={2}>
                      <Field
                        disabled={disableEdit}
                        name="tipoconta"
                        component={CssTextField}
                        type="select"
                        validate={tipoCadastro === 'O' || tipoCadastro === 'C' ? false : required}
                        label="Tp Conta"
                        variant="outlined"
                        fullWidth
                        select
                        size="small"
                        margin="dense"
                      >
                        <MenuItem value="CCPJ">Conta Corrente PJ</MenuItem>
                        <MenuItem value="CCPF">Conta Corrente PF</MenuItem>
                        <MenuItem value="P">Poupança</MenuItem>
                      </Field>
                    </Col>
                    <Col xs={10}>
                      <Grid xs={12}>
                        <Row style={{ minHeight: '65px' }}>
                          <Col xs={8}>
                            <Field
                              disabled={disableEdit}
                              name="banco"
                              component={CssTextField}
                              type="select"
                              validate={tipoCadastro === 'O' || tipoCadastro === 'C' ? false : required}
                              label="Banco"
                              variant="outlined"
                              fullWidth
                              select
                              size="small"
                              margin="dense"
                            >
                              {cadBancos.map((option) => (
                                <MenuItem key={option.Code} value={`${option.Code} - ${option.Name}`}>
                                  {`${option.Code} - ${option.Name}`}
                                </MenuItem>
                              ))}
                            </Field>
                          </Col>
                          <Col xs={2}>
                            <Field
                              disabled={disableEdit}
                              name="agencia"
                              component={CssTextField}
                              type="text"
                              validate={tipoCadastro === 'O' || tipoCadastro === 'C' ? false : required}
                              label="Agência"
                              variant="outlined"
                              fullWidth
                              size="small"
                              margin="dense"
                            />
                          </Col>
                          <Col xs={2}>
                            <Field
                              disabled={disableEdit}
                              name="conta"
                              component={CssTextField}
                              type="text"
                              validate={tipoCadastro === 'O' || tipoCadastro === 'C' ? false : required}
                              label="Conta"
                              variant="outlined"
                              fullWidth
                              size="small"
                              margin="dense"
                            />
                          </Col>
                        </Row>
                      </Grid>
                    </Col>
                  </Row>
                </Grid>
              </TabPanel>

              {(tipoCadastro === 'M' || values.user_id === true) && userID ?
                <TabPanel value={value} index={1}>
                  <Grid fluid style={{ marginTop: '40px' }}>
                    <Row>
                      <Col xs={11}></Col>
                      <Col xs={1}>
                        <div
                          className={classes.botoesvei}
                        >
                          <button onClick={(e) => onDocs(e, 'E')}
                            style={{ backgroundColor: 'transparent' }}
                          >
                            <Tooltip title="Documentos">
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
                    </Row>
                    <Row>
                      <Col xs={6}>
                        <Grid fluid style={{ margin: '0px' }}>
                          <Row style={{ height: '65px' }}>
                            <Texto
                              size={22} height={24} italic={true} bold={700} font='Arial'
                              mt={3}
                              color='#2699FB' shadow={true}>
                              DOCUMENTOS
                            </Texto>
                          </Row>
                          <Row style={{ height: '370px' }}>
                            <Col xs={6}>
                              <div style={{ border: '1px dashed #ddd', padding: '5px' }}>

                                <Field
                                  name="habilitacaoimg"
                                  userID={userID}
                                  disabled={disableEdit}
                                  >
                                  {props => (
                                    <div>
                                      <Upload {...props} />
                                    </div>
                                  )}
                                </Field>
                                <Field
                                  name="habilitacao"
                                  disabled={disableEdit}
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
                                <Field
                                  label="Vencimento"
                                  name="habilitacaovct"
                                  // validate={required}
                                  disabled={disableEdit}
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
                              </div>
                            </Col>
                            <Col xs={6}>
                              <div style={{ border: '1px dashed #ddd', padding: '5px' }}>
                                <Field
                                  name="ANTTimg"
                                  userID={userID}
                                  disabled={disableEdit}
                                >
                                  {props => (
                                    <div>
                                      <Upload {...props} />
                                    </div>
                                  )}
                                </Field>
                                <Field
                                  name="ANTT"
                                  // validate={required}
                                  disabled={disableEdit}
                                  message="Informe o Número da ANTT"
                                  component={CssTextField}
                                  type="text"
                                  label="ANTT"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="dense"
                                ></Field>
                                <Field
                                  label="Vencimento"
                                  name="ANTTvct"
                                  // validate={required}
                                  disabled={disableEdit}
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
                              </div>
                            </Col>
                          </Row>
                        </Grid>
                      </Col>
                      <Col xs={6}>
                        <div className="ag-theme-custom-react" style={{
                          height: '370px',
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
                            paginationPageSize={50}
                            localeText={agPtBr}
                            onRowDoubleClicked={onRowDoubleClickedVeiculos}
                          >
                          </AgGridReact>
                        </div>
                      </Col>
                    </Row>
                  </Grid>

                  <ConfirmaModal
                    isShowConfirma={isShowConfirma}
                    hide={toggleConfirma}
                    texto='Confirma a Exclusão do Veículo?'
                    texto1={placaExclui}
                    callback={() => excluiVeiculo(excluiId)}
                  />

                </TabPanel>
                : null}

              <TabPanel value={value} index={2} style={{ width: '100%', height: '455px' }}>
                <BoxTitulo
                  size={425}
                  width='99%'
                  bgcolor='#FFFFFF'
                  border='1px solid #2699F8'
                  mb={10}
                >
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        <div className="ag-theme-custom-react" style={{
                          height: '415px',
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

              <HistoricoModal
                isShowHistorico={isShowHistorico}
                hide={toggleHistorico}

                historicoID={historicoID}
                motoristaID={motoristaID}
                clienteID={clienteID}
                operadorID={operadorID}
                pedidoID={null}

                tipoCad={tipoCadVei !== 'E' && tipoCadVei !== 'N' ? 'D' : tipoCadVei}
                disableEdit={(tipoCadVei !== 'E' && tipoCadVei !== 'N' ? true : false) || disableEdit}
                callback={e => callBackHistorico(e)}
              />
              <DocsModal
                isShowDocs={isShowDocs}
                hide={toggleDocs}
                userID={usuarioId}
                veiculoID={veiculoId}
                tipo={tipoCadVei}
                disabled={disableEdit}
                callback={buscaVeiculosUsuario}
              />

              {usuarioId &&
              <UserModal
                isShowUser={isShowUser}
                hide={toggleUser}
                userID={usuarioId}
              />
              }

            </form>
          )
        }}
      />
    </div>
  )
}
