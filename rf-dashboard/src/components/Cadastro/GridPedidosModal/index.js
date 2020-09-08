/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '../../../assets/scss/agGrid.scss'
import { AgGridReact, gridApi } from 'ag-grid-react'
import { AllCommunityModules } from '@ag-grid-community/all-modules'
import agPtBr from '../../agPtBr'

// import { formatToPhone } from 'brazilian-values'
// import StarRatings from 'react-star-ratings'

import { Tooltip } from '@material-ui/core'
import { Container, BoxTitulo, Texto, Grid, Botao, RLeft, RRight } from './styles'
import { FaIcon } from '../../Icone'

// import { msgerror } from '../../../globais'
import api from '../../../services/rf'

import PedidoModal from '../PedidoModal'
import useModal from '../PedidoModal/useModal'

// import DatePicker from '../../datepicker'
import PartialMatchFilter from './PartialMatchFilter'
import StatusFilter from './StatusFilter'
// import TipoFilter from './TipoFilter'
// import EstadoFilter from './EstadoFilter'

import "./modal.css"
import moment from "moment"

const rowData = []

const GridPedidosModal = ({ isShowing, hide }) => {
  // const classes = useStyles()
  // const [modalStyle] = React.useState(getModalStyle)
  const ref = React.createRef()
  const mensagem = ''

  const [pedidos, setPedidos] = useState(rowData)
  const [vgridApi, setVgridApi] = useState(gridApi)
  const [usuarios, setUsuarios] = useState([])
  const [tipo, setTipo] = useState(0)
  const [pedidoId, setPedidoId] = useState([])
  const { isShowPedido, togglePedido } = useModal()

  useEffect(() => {
    buscaUsuarios()
    buscaPedidos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowPedido])

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
            console.log('*** data', data)
          }
        } else if (error.request) {
          console.error('*** bu-1.2', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const buscaPedidos = async () => {
    await api.get(`/pedidos`, {})
      .then(response => {
        setPedidos(response.data)
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
          console.error('*** bu-1.2', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const frameworkComponents = {
    formatStatus: FormatStatus,
    formataData: FormataData,
    buscaNome: BuscaNome,
    partialMatchFilter: PartialMatchFilter,
    statusFilter: StatusFilter,
  }

  const columnDefs = [
    {
      headerName: "S",
      field: "status",
      width: 40,
      sortable: true,
      cellRenderer: 'formatStatus',
      filter: 'statusFilter',
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: "Pedido",
      field: "id",
      flex: 1,
      width: 120,
      sortable: true,
      filter: 'agNumberColumnFilter',
      // menuTabs: ['filterMenuTab'],
    },
    {
      headerName: "Prazo Coleta",
      field: "limitecoleta",
      width: 120,
      sortable: true,
      cellRenderer: 'formataData',
      // filter: 'tipoFilter',
      // menuTabs: ['filterMenuTab'],
    },
    {
      headerName: "Prazo Entrega",
      field: "limiteentrega",
      width: 120,
      sortable: true,
      cellRenderer: 'formataData',
    },
    {
      headerName: "Local",
      field: "local",
      flex: 1,
      sortable: true,
      filter: 'partialMatchFilter',
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: "Cliente",
      field: "cliente_id",
      flex: 1,
      sortable: true,
      cellRenderer: 'buscaNome',
      // filter: 'partialMatchFilter',
      // menuTabs: ['filterMenuTab'],
    },
    {
      headerName: "Motorista",
      field: "motorista_id",
      flex: 1,
      sortable: true,
      cellRenderer: 'buscaNome',
      // filter: 'partialMatchFilter',
      // menuTabs: ['filterMenuTab'],
    },
  ]

  const ToolRef = React.forwardRef((props, ref) => {
    const refIcon = React.createRef()

    return (
      <Tooltip ref={ref} title={props.title}>
        <IconRef ref={refIcon} icon={props.icon} size={props.size} />
      </Tooltip>
    )
  })

  const IconRef = React.forwardRef((props, ref) => (
    <FaIcon icon={props.icon} size={props.size} />
  ))

  function FormatStatus(params) {
    // [D]isponivel,
    // [A]guardando, 
    // Em [C]oleta, 
    // Em [T]ransporte, 
    // Em c[O]nferencia, 
    // [E]ntregue, 
    // [X]Cancelado
    // []Em Manutenção, 

    switch (params.value) {
      // case 'D': return (<Tooltip title="Disponível"><FaIcon ref={ref} icon='Disponivel' size={20}/></Tooltip>)
      case 'D': return (<ToolRef title="Disponível" icon='Disponivel' size={20} />)
      case 'A': return (<ToolRef title="Aguardando Coleta" icon='Aguardando' size={20} />)
      case 'C': return (<ToolRef title="Em Coleta" icon='FaTruckLoading' size={20} />)
      case 'T': return (<ToolRef title="Em Trnasporte" icon='Transporte' size={20} />)
      case 'O': return (<ToolRef title="Em Conferência" icon='Confere' size={20} />)
      case 'E': return (<ToolRef title="Entregue" icon='Entregue' size={20} />)
      case 'X': return (<ToolRef title="Cancelado" icon='Cancelado' size={20} />)
      default: return (<ToolRef title="Em Manutenção" icon='Manutencao' size={20} />)
    }
  }

  function FormataData(params) {
    const data = moment(params.value).format('DD/MM/YYYY')
    return (<span>{data}</span>)
  }

  function BuscaNome(params) {
    return usuarios.filter(user => user.id === params.value).map(
      fusu => {
        return fusu['nome']
      }
    )
  }

  const onButtonClick = async (tipo, e) => {
    e.preventDefault()

    const selectedNodes = vgridApi.getSelectedRows()
    // const selectedData = selectedNodes.map( node => node.data )
    // const selectedDataStringPresentation = selectedData.map( node => node.make + ' ' + node.model).join(', ')
    if (selectedNodes.length === 0 && tipo === 'E') {
      toast('Você deve selecionar um registro para editar!', { type: 'error' })
      return
    }

    setTipo(tipo)

    // alert(`Pedido: ${selectedNodes[0].id}`)
    // return

    switch (tipo) {
      case 'E': 
        setPedidoId(selectedNodes[0].id)
        break
      case 'A':
        buscaPedidos()
        return
      default: setPedidoId(null)
    }
    togglePedido()
  }

  if (isShowing) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal" style={{ background: '#2699F8' }}>
            <Container>
              <BoxTitulo height={32} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Grid mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      CADASTRO DE PEDIDOS
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Tooltip title="Atualizar Lista">
                      <Botao onClick={(e) => onButtonClick('A', e)}><FaIcon icon='GrUpdate' size={18} /> </Botao>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <Botao onClick={(e) => onButtonClick('E', e)}><FaIcon icon='FaRegEdit' size={20} /> </Botao>
                    </Tooltip>
                    <Tooltip title="Adicionar um Novo">
                      <Botao onClick={(e) => onButtonClick('N', e)}><FaIcon icon='FcPlus' size={20} /> </Botao>
                    </Tooltip>
                    <Tooltip title="Fechar Janela">
                      <Botao onClick={hide}><FaIcon icon='GiExitDoor' size={20} /> </Botao>
                    </Tooltip>
                  </RRight>
                </Grid>
              </BoxTitulo>

              <BoxTitulo mg={0} bgcolor='#FFFFFF'>
                <div className="ag-theme-custom-react"
                  style={{
                    margin: '10px',
                    height: '460px',
                    width: '100%',
                    borderRadius: '10px',
                    backgroundColor: '#FFFFFF'
                  }}>
                  {/**/}
                  <AgGridReact
                    modules={AllCommunityModules}
                    rowSelection="single"
                    onGridReady={(params) => { setVgridApi(params.api) }}
                    columnDefs={columnDefs}
                    rowData={pedidos}
                    frameworkComponents={frameworkComponents}
                    tooltipShowDelay={0}
                    pagination={true}
                    paginationPageSize={50}
                    localeText={agPtBr}
                  >
                  </AgGridReact>
                  {/**/}
                </div>
              </BoxTitulo>

              <BoxTitulo height={24} mt={10}>
                <Texto
                  size={22} height={24} italic={true} bold={700} font='Arial'>
                  {mensagem}
                </Texto>
              </BoxTitulo>
            </Container>
            <PedidoModal
              isShowPedido={isShowPedido}
              hide={togglePedido}
              tipo={tipo}
              pedidoId={pedidoId}
            />
          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default GridPedidosModal