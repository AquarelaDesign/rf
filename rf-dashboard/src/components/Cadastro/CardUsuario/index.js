/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { isCNPJ, isCPF } from 'brazilian-values'
import MaskedInput from 'react-text-mask'
import Axios from 'axios'
// import { uniqueId } from 'lodash'
// import filesize from 'filesize'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { Form, Field } from 'react-final-form'
import './agGrid.scss'
import { AgGridReact, gridApi } from 'ag-grid-react'

import { AiOutlineSearch } from 'react-icons/ai'
import {
  Box,
  InputAdornment,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core'

import {
  TextField,
} from 'final-form-material-ui'

import DocsModal from '../DocsModal'
import useModalDocs from '../DocsModal/useModal'

import { msgerror } from '../../../globais'
import api from '../../../services/rf'
import { FaIcon } from '../../Icone'

import cadBancos from '../../../services/json/bancos.json'
// import cadEstados from '../../../services/json/estados.json'
import cadTipoVeiculo from '../../../services/json/tipoveiculo.json'

import Upload from './upload'
import DatePicker from './datepicker'
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

export default function CardUsuario({ tipo, usuarioId }) {
  const classes = useStyles()

  const [initialValues, setInitialValues] = useState({
    // cpfcnpj: '',
  })
  const [value, setValue] = useState(0)
  const [disableEdit, setDisableEdit] = useState(false)
  const [ultimoCep, setUltimoCep] = useState('')
  const [dadosBancarios, setDadosBancarios] = useState('visible')
  const [tipoCadastro, setTipoCadastro] = useState('')
  const [flag, setFlag] = useState(false)
  const [userID, setUserID] = useState(usuarioId)
  const [vgridApi, setVgridApi] = useState(gridApi)
  const [veiculos, setVeiculos] = useState([])
  const [atualizaCEP, setAtualizaCEP] = useState(false)

  const [isOpen, setIsOpen] = useState(false)
  const { isShowDocs, toggleDocs } = useModalDocs()

  const [veiculoId, setVeiculoId] = useState(0)

  useEffect(() => {
    // toggleCep()
    try {

      if (tipo !== 'N' && tipo !== 'E') {
        setDisableEdit(true)
      }

      if (userID !== null && tipo !== 'N') {
        buscaUsuario()
      }
      // console.log('*** tipo', tipo, tipoCadastro)
      if (tipo === 'N' && tipoCadastro === '') {
        setTipoCadastro('M')
        valTipoCadastro('M')
        window.setFormValue('tipo', 'M')
        window.setFormValue('status', 'I')
        window.setFormValue('estado', ' ')
      }
    } catch (error) {
      const { response } = error
      if (response !== undefined) {
        toast(response.status !== 401
          ? response.data[0].message
          : msgerror,
          { type: 'error' })
      } else {
        toast(error, { type: 'error' })
      }
    }
  }, [userID, tipo, disableEdit])

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

  function onRowEditingStopped() {
    if (flag === false) {
      vgridApi.forEachNode((node, index) => {
        salvaVeiculo(node.data)
      })
    }
  }

  const buscaUsuario = async () => {
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
          console.error('*** bu-1.1', error)
        } else if (error.request) {
          console.error('*** bu-1.2', error)
        } else {
          console.error('*** bu-1.3')
        }
      })
  }

  function Estado(estado) {
    // [] Disponível, Aguardando A[P]rovacao, [A]guardando Coleta, Em [T]ransporte, 
    // [B]loqueado, [R]ecusado, [7]Suspensão de 7 dias
    /*
    if (estado !== undefined) {
      cadEstados.map((item) => {
        console.log('*** cadEstados', item.id, estado)
        if (item.id === estado) {
          return (<span style={{ color: `${item.id}` }}><FaIcon icon={item.icon} size={item.size} />{item.description}</span>)
        }
        return (<></>)
      })
    }
    return (<></>)
    // cadEstados.filter(est => est.id === estado)
    */
    
    switch (estado) {
      case ' ': return (
        <span style={{ color: 'green' }}>
          <FaIcon icon='FaRegThumbsUp' size={20} />
          {tipoCadastro === 'M' ? ' DISPONÍVEL' : ' ATIVO'}
        </span>
      )
      case 'P': return (<span style={{ color: 'blue' }}><FaIcon icon='FaTruckLoading' size={20} /> AGUARDANDO APROVAÇÃO</span>)
      case 'A': return (<span style={{ color: 'orange' }}><FaIcon icon='FaHandPaper' size={20} /> AGUARDANDO COLETA</span>)
      case 'T': return (<span style={{ color: 'red' }}><FaIcon icon='GrDeliver' size={20} /> EM TRANSPORTE</span>)
      case 'B': return (<span style={{ color: 'red' }}><FaIcon icon='FcCancel' size={20} /> BLOQUEADO</span>)
      case 'R': return (<span style={{ color: 'red' }}><FaIcon icon='FiAlertOctagon' size={20} /> RECUSADO</span>)
      case '7': return (<span style={{ color: 'orange' }}><FaIcon icon='FiAlertTriangle' size={20} /> SUSPENÇÃO 7 DIAS</span>)
      default: return (<></>)
    }
  }

  function TipoVeiculo() {
    let arrTipo = []
    // eslint-disable-next-line array-callback-return
    cadTipoVeiculo.map((item) => {
      // console.log('*** cadTipoVeiculo', item.id, item.tipo)
      arrTipo.push(item.tipo)
    })
    return arrTipo
  }

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
    switch (status) {
      case 'A': return (<span style={{ color: 'green' }}><FaIcon icon='FaCircle' size={20} /></span>)
      case 'I': return (<span style={{ color: 'gray' }}><FaIcon icon='FaCircle' size={20} /></span>)
      default: return (<></>)
    }
  }

  function createNewRowData() {
    var newData = {
      placachassi: "",
      modelo: "",
      ano: null,
      tipo: "CEGONHA",
      vagas: 11,
      id: null,
      usuario_id: userID,
    };
    return newData
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
      console.log('NumericCellEditor.focusIn()')
    }

    NumericCellEditor.prototype.focusOut = function () {
      console.log('NumericCellEditor.focusOut()')
    }

    return NumericCellEditor
  }

  const onBtStartEditing = (key, char, pinned, row = 0) => {
    vgridApi.setFocusedCell(0, 'placachassi', pinned)
    vgridApi.startEditingCell({
      rowIndex: row,
      colKey: 'placachassi',
      rowPinned: pinned,
      keyPress: key,
      charPress: char,
    })
  }

  const handleAddRow = (e) => {
    e.preventDefault()
    const rowDataItem = createNewRowData()
    vgridApi.applyTransaction({ add: [rowDataItem] })
    onBtStartEditing(null, null, null, vgridApi.getLastDisplayedRow())
  }

  const onDocs = (props, e) => {
    e.preventDefault()
    const selectedData = props.api.getSelectedRows()
    setVeiculoId(selectedData[0].id)
    toggleDocs()
    setFlag(true)
  }

  const handleDeleteRow = async (props, e) => {
    e.preventDefault()
    const selectedData = props.api.getSelectedRows()

    await sleep(300)
    api.delete(`/veiculosm/${selectedData[0].id}`,
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
        props.api.applyTransaction({ remove: selectedData })
      } else {
        toast(response.data[0].message,
          { type: 'error' })
      }
    }).catch((error) => {
      toast('Ocorreu um erro no processamento!',
        { type: 'error' })

      if (error.response) {
        console.error('*** bu-1.1', error)
      } else if (error.request) {
        console.error('*** bu-1.2', error)
      } else {
        console.error('*** bu-1.3')
      }
    })

  }

  const columnDefs = [
    {
      headerName: "Placa/Chassi",
      field: "placachassi",
      width: 120,
      sortable: true,
      editable: true,
    },
    {
      headerName: "Modelo",
      field: "modelo",
      flex: 1,
      sortable: true,
      editable: true,
    },
    {
      headerName: "Ano",
      field: "ano",
      width: 100,
      sortable: true,
      editable: true,
    },
    {
      headerName: "Tipo",
      field: "tipo",
      width: 200,
      sortable: true,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: TipoVeiculo(), // ['CARRETA', 'CAVALO', 'PLATAFORMA'],
      },
    },
    {
      headerName: "Vagas",
      field: "vagas",
      width: 100,
      sortable: true,
      editable: true,
      cellEditor: 'numericCellEditor',
    },
    {
      headerName: "",
      width: 30,
      sortable: false,
      editable: false,
      cellRendererFramework: (props) => {
        return (
          <button onClick={(e) => onDocs(props, e)}
            style={{ backgroundColor: 'transparent' }}
          >
            <Tooltip title="Documentos">
              <span style={{
                alignItems: 'center',
                color: '#000000',
                marginLeft: '-18px',
                marginTop: '3px',
              }}>
                <FaIcon icon='Documentos' size={20} />
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
      cellRendererFramework: (props) => {
        return (
          <button onClick={(e) => handleDeleteRow(props, e)}
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

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const onSubmit = async (values) => {
    if (atualizaCEP) {
      return
    }

    await sleep(300)

    if (userID !== null && tipo === 'E') {
      values.cep.replace('-', '')

      let newValues = {}
      for (let key in values) {
        if (values[key] && typeof values[key] === 'string') {
          if (key !== 'email' && key !== 'foto') {
            newValues[key] = values[key].toUpperCase()
          } else {
            newValues[key] = values[key]
          }
        } else {
          newValues[key] = values[key]
        }
      }

      // console.log('*** newValues', newValues)
      await api.put(`/usuarios/${userID}`,
        JSON.stringify(newValues),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      )
      .then(response => {
        const { data } = response
        setInitialValues(data)
        setTipoCadastro(data.tipo)
        valTipoCadastro(data.tipo)
        setVeiculos(data.veiculos)

        toast(response.status === 200
          ? 'Registro atualizado com sucesso!'
          : response.data[0].message,
          { type: response.status === 200 ? 'success' : 'error' })
      }).catch((error) => {
        toast('Ocorreu um erro no processamento!',
          { type: 'error' })

        if (error.response) {
          console.error('*** bu-1.1', error)
        } else if (error.request) {
          console.error('*** bu-1.2', error)
        } else {
          console.error('*** bu-1.3')
        }
      })
    }
  }

  const salvaVeiculo = (veiculo) => {
    if (userID !== null && tipo === 'E') {
      sleep(300)
      const placa = veiculo.placachassi
      let url = { url: `/veiculosm/${veiculo.id}`, method: 'put', data: veiculo }
      if (veiculo.id === null) {
        delete veiculo['id']
        url = { url: `/veiculosm`, method: 'post', data: veiculo }
      }

      api(url,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      ).then(response => {
        if (response.status !== 200) {
          toast(`Ocorreu um erro no processamento da placa [${placa}]!`,
            { type: 'error' })
          return
        }
      }).catch((error) => {
        // toast(`Ocorreu um erro no processamento da placa [${placa}]!`,{ type: 'error' })

        if (error.response) {
          console.error('*** bu-1.1', error)
        } else if (error.request) {
          console.error('*** bu-1.2', error)
        } else {
          console.error('*** bu-1.3')
        }
      })
    }

  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const required = value => (value ? undefined : '*Campo obrigatório!')

  const valTipoCadastro = (value) => {
    if (value === 'O' || value === 'C') {
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
    
    if (valor.trim().length === 11) {
      if (!isCPF(value)) {
        return 'CPF Inválido!'
      }
    } else if (valor.trim().length === 14) {
      if (!isCNPJ(value)) {
        return 'CNPJ Inválido!'
      }
    } else {
      return undefined
    }
  }

  const validaCEP = async (value) => {
    setAtualizaCEP(true)
    console.log('*** value', value)
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

    const service = `http://31.220.50.222:3003/api/cep/${cep}`

    Axios.get(service, {})
      .then(response => {
        const { data } = response.data
        if (response.data.error) {
          // toast(response.data.message, { type: 'error' })
          setAtualizaCEP(false)
          return
        }

        const Logradouro = `${data[0].data[0].Tipo_Logradouro} ${data[0].data[0].Logradouro}`
        const Bairro = data[0].data[0].Bairro
        const Cidade = data[0].data[0].Cidade
        const UF = data[0].data[0].UF

        // console.log('*** buscaCep', values.logradouro)
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
          console.error('*** u-1.1', error)
        } else if (error.request) {
          console.error('*** u-1.2', error)
        } else {
          console.error('*** u-1.3')
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
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value)
          }
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

          return (
            <form onSubmit={handleSubmit} noValidate>
              <Tabs value={value} onChange={handleChange} aria-label="Dados do Usuário">
                <Tab label="Usuário" {...a11yProps(0)} />

                {tipoCadastro === 'M' ?
                  <Tab label="Veículos" {...a11yProps(2)} />
                  : null}
                {/* <Tab label="Observações" {...a11yProps(1)} /> */}

                {/* {tipoCadastro === 'M' ?
                  <Tab label="Documentos" {...a11yProps(2)} />
                : null} */}

              </Tabs>

              <div className={classes.botoes}>
                <button onClick={() => {
                  window.setFormValue('estado', values.estado === 'B' ? ' ' : 'B')
                }}
                  style={{ backgroundColor: 'transparent' }}
                >
                  <Tooltip title={values.estado !== 'B' ? "Bloquear" : "Desbloquear"}>
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

              <TabPanel
                value={value}
                index={0}
                id='cadUsu'
              >
                <Grid fluid>
                  <Row>
                    <Col xs={2}>
                      <Field
                        name="foto"
                        userID={userID}
                      >
                        {props => (
                          <div>
                            <Upload {...props} />
                          </div>
                        )}
                      </Field>
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
                          <Col xs={3}>
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
                          <Col xs={3}>
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
                          <Col xs={3}>
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
                          <Col xs={3}>
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
                              validate={required}
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
                        pattern="[\d|-]{8}"
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

              {tipoCadastro === 'M' ?
                <TabPanel value={value} index={1}>
                  <Grid fluid style={{ marginTop: '40px' }}>
                    <Row>
                      <Col xs={11}></Col>
                      <Col xs={1}>
                        <div 
                          className={classes.botoesvei}
                        >
                          {/* <button onClick={onDocs}
                            style={{ backgroundColor: 'transparent' }}
                          >
                            <Tooltip title="Teste">
                              <span style={{
                                alignItems: 'center',
                                color: '#FFC417',
                                cursor: 'pointer',
                                marginTop: '3px',
                              }}>
                                <FaIcon icon='Add' size={30} />
                              </span>
                            </Tooltip>
                          </button> */}

                          <button onClick={handleAddRow}
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
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
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
                            editType='fullRow'
                            components={{ numericCellEditor: getNumericCellEditor() }}
                            tooltipShowDelay={0}
                          >
                          </AgGridReact>
                        </div>
                      </Col>
                    </Row>
                  </Grid>
                </TabPanel>
              : null}

              {/* {tipoCadastro === 'M' ?
                <TabPanel value={value} index={2}>
                  <Grid fluid style={{ marginTop: '15px' }}>
                    <Row>
                      <Col xs={3}>
                        <div style={{ border: '1px dashed #ddd', padding: '5px' }}>
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
                          <Field
                            disabled={disableEdit}
                            name="habilitacao"
                            component={CssTextField}
                            type="text"
                            label="Habilitação"
                            variant="outlined"
                            fullWidth
                            size="small"
                            margin="dense"
                          />
                          <Field
                            label="Vencimento"
                            name="habilitacaovct"
                            variant="outlined"
                            // component={CssTextField}
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
                      <Col xs={3}>
                        <div style={{ border: '1px dashed #ddd', padding: '5px' }}>
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
                          <Field
                            disabled={disableEdit}
                            name="ANTT"
                            component={CssTextField}
                            type="text"
                            label="ANTT"
                            variant="outlined"
                            fullWidth
                            size="small"
                            margin="dense"
                          />
                          <Field
                            label="Vencimento"
                            name="ANTT"
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
                      <Col xs={3}>
                        <div style={{ border: '1px dashed #ddd', padding: '5px' }}>
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
                          <Field
                            disabled={disableEdit}
                            name="cavalo"
                            component={CssTextField}
                            type="text"
                            label="Cavalo"
                            variant="outlined"
                            fullWidth
                            size="small"
                            margin="dense"
                          />
                          <Field
                            label="Vencimento"
                            name="cavalo"
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
                      <Col xs={3}>
                        <div style={{ border: '1px dashed #ddd', padding: '5px' }}>
                          <Field
                            name="cavalo1img"
                            userID={userID}
                          >
                            {props => (
                              <div>
                                <Upload {...props} />
                              </div>
                            )}
                          </Field>
                          <Field
                            disabled={disableEdit}
                            name="cavalo1"
                            component={CssTextField}
                            type="text"
                            label="Cavalo"
                            variant="outlined"
                            fullWidth
                            size="small"
                            margin="dense"
                          />
                          <Field
                            label="Vencimento"
                            name="cavalo1"
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
                    <Row>
                      <Col xs={12}>
                      </Col>
                    </Row>
                  </Grid>
                </TabPanel>
              : null} */}

              <DocsModal 
                isShowDocs={isShowDocs}
                hide={toggleDocs}
                userID={usuarioId}
                veiculoID={veiculoId}
              />

            </form>
          )
        }}
      />
    </div>
  )
}
