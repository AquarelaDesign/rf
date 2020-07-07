import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '../CardUsuario/agGrid.scss'
import { AgGridReact, gridApi } from 'ag-grid-react'
import { AllCommunityModules } from '@ag-grid-community/all-modules'

import { formatToPhone } from 'brazilian-values'
import StarRatings from 'react-star-ratings'

import { Tooltip,} from '@material-ui/core'
import { Container, BoxTitulo, Texto, Grid, Botao, RLeft, RRight } from './styles'
import { FaIcon } from '../../Icone'

import { msgerror } from '../../../globais'
import api from '../../../services/rf'

import UsuarioModal from '../UsuarioModal'
import useModal from '../UsuarioModal/useModal'

import PartialMatchFilter from './PartialMatchFilter'
import StatusFilter from './StatusFilter'
import TipoFilter from './TipoFilter'
import EstadoFilter from './EstadoFilter'

import "./modal.css"

const rowData = [
]

/*
const getModalStyle = () => {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    // background: 'none',
    borderRadius: '5px',
    padding: '20px',
    backgroundColor: '#2699F8',
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))
*/

const GridUsuarioModal = ({ isShowing, hide }) => {
  // const classes = useStyles()
  // const [modalStyle] = React.useState(getModalStyle)

  const [usuarios, setUsuarios] = useState(rowData)
  const [vgridApi, setVgridApi] = useState(gridApi)
  const [mensagem, setMensagem] = useState('')
  const [tipo, setTipo] = useState('')
  const [usuarioId, setUsuarioId] = useState(null)
  const { isShowUsuario, toggleUsuario } = useModal()

  useEffect(() => {
    try {
      api.get(`/usuarios`, {})
        .then(response => {
          // console.log('*** GridUsuarios', response.data)
          setUsuarios(response.data)
        }).catch((error) => {
          if (error.response) {
            console.error('*** gu-1.1', error)
          } else if (error.request) {
            console.error('*** gu-1.2', error)
          } else {
            console.error('*** gu-1.3')
          }
        })
    } catch (error) {
      console.log('*** error', error)
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
  }, [])

  const frameworkComponents = {
    stRatings: StRatings,
    formatStatus: FormatStatus,
    formatTipo: FormatTipo,
    formatEstado: FormatEstado,
    toolStatus: ToolStatus,
    partialMatchFilter: PartialMatchFilter,
    statusFilter: StatusFilter,
    tipoFilter: TipoFilter,
    estadoFilter: EstadoFilter,
  }

  const columnDefs = [
    {
      headerName: "S",
      field: "status",
      width: 40,
      sortable: true,
      // tooltipField: 'status', 
      // tooltipComponent: 'toolStatus',
      cellRenderer: 'formatStatus',
      filter: 'statusFilter',
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: "T",
      field: "tipo",
      width: 40,
      sortable: true,
      cellRenderer: 'formatTipo',
      filter: 'tipoFilter',
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: "Nome",
      field: "nome",
      flex: 1,
      sortable: true,
      filter: 'partialMatchFilter',
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: "Celular",
      field: "celular",
      width: 170,
      valueFormatter: celFormatter,
    },
    {
      headerName: "Localização",
      field: "localizacao",
      flex: 1,
      sortable: true,
      filter: 'partialMatchFilter',
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: "E",
      field: "estado",
      width: 40,
      sortable: true,
      cellRenderer: 'formatEstado',
      filter: 'estadoFilter',
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: "Rate",
      field: "rate",
      width: 100,
      sortable: true,
      cellRenderer: 'stRatings',
    },
  ]

  function FormatEstado(params) {
    // [] Disponível, Aguardando A[P]rovacao, [A]guardando Coleta, Em [T]ransporte, 
    // [B]loqueado, [R]ecusado, [7]Suspensão de 7 dias
    switch (params.value) {
      case '': return (<span style={{ color: 'green' }}><FaIcon icon='FaRegThumbsUp' size={20} /></span>)
      case 'P': return (<span style={{ color: 'blue' }}><FaIcon icon='FaTruckLoading' size={20} /></span>)
      case 'A': return (<span style={{ color: 'orange' }}><FaIcon icon='FaHandPaper' size={20} /></span>)
      case 'T': return (<span style={{ color: 'red' }}><FaIcon icon='GrDeliver' size={20} /></span>)
      case 'B': return (<span style={{ color: 'red' }}><FaIcon icon='FcCancel' size={20} /></span>)
      case 'R': return (<span style={{ color: 'red' }}><FaIcon icon='FiAlertOctagon' size={20} /></span>)
      case '7': return (<span style={{ color: 'orange' }}><FaIcon icon='FiAlertTriangle' size={20} /></span>)
   default: return (<></>)
    }
  }

  function FormatTipo(params) {
    switch (params.value) {
      case 'O': return (<FaIcon icon='FaHeadphonesAlt' size={20} />)
      case 'M': return (<FaIcon icon='FaTruck1' size={20} />)
      case 'C': return (<FaIcon icon='FaUserTie' size={20} />)
      case 'F': return (<FaIcon icon='supplier' size={20} />)
      default: return (<></>)
    }
  }

  function FormatStatus(params) {
    switch (params.value) {
      case 'A': return (<span style={{ color: 'green' }}><FaIcon icon='FaCircle' size={20} /></span>)
      case 'I': return (<span style={{ color: 'gray' }}><FaIcon icon='FaCircle' size={20} /></span>)
      default: return (<></>)
    }
  }

  function ToolStatus(params) {
    switch (params.value) {
      case 'A':
        setMensagem(<span style={{ color: 'green' }}>Online</span>)
        return (<></>)
      case 'I':
        setMensagem(<span style={{ color: 'green' }}>Offline</span>)
        return (<></>)
      default: return (<></>)
    }
  }

  function StRatings(params) {
    if (params.value <= 0) {
      return (<></>)
    }

    return (
      <StarRatings
        rating={params.value}
        starRatedColor="#F9D36B"
        starDimension="10px"
        starSpacing="1px"
        // changeRating={this.changeRating}
        numberOfStars={5}
        name='rating'
      />
    )
  }

  function celFormatter(params) {
    return formatToPhone(formatNumber(params.value))
  }

  function formatNumber(number) {
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  const onButtonClick = async (tipo, e) => {
    e.preventDefault()

    setTipo(tipo)

    const selectedNodes = vgridApi.getSelectedNodes()
    // const selectedData = selectedNodes.map( node => node.data )
    // const selectedDataStringPresentation = selectedData.map( node => node.make + ' ' + node.model).join(', ')
    // alert(`Selected nodes: ${selectedDataStringPresentation}`)

    if (selectedNodes.length === 0 && tipo === 'E') {
      toast('Você deve selecionar um registro para editar!', { type: 'error' })
      return
    }

    if (tipo === 'E') {
      setUsuarioId(selectedNodes[0].data.id)
    } else {
      setUsuarioId(null)
    }

    toggleUsuario()

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
                      CADASTRO DE USUÁRIOS
                    </Texto>
                  </RLeft>
                  <RRight>
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
                  <AgGridReact
                    modules={AllCommunityModules}
                    rowSelection="multiple"
                    onGridReady={(params) => { setVgridApi(params.api) }}
                    columnDefs={columnDefs}
                    rowData={usuarios}
                    frameworkComponents={frameworkComponents}
                    tooltipShowDelay={0}
                  >
                  </AgGridReact>
                </div>
              </BoxTitulo>

              <BoxTitulo height={24} mt={10}>
                <Texto
                  size={22} height={24} italic={true} bold={700} font='Arial'>
                  {mensagem}
                </Texto>
              </BoxTitulo>
            </Container>
            <UsuarioModal
              isShowUsuario={isShowUsuario}
              hide={toggleUsuario}
              tipo={tipo}
              usuarioId={usuarioId}
            />

          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default GridUsuarioModal