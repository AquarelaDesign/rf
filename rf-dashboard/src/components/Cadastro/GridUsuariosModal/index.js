/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '../../../assets/scss/agGrid.scss'
import { AgGridReact, gridApi } from 'ag-grid-react'
import { AllCommunityModules } from '@ag-grid-community/all-modules'
import agPtBr from '../../agPtBr'

import { formatToPhone } from 'brazilian-values'
import StarRatings from 'react-star-ratings'

import { Tooltip,} from '@material-ui/core'
import { Container, BoxTitulo, Texto, Grid, Botao, RLeft, RRight } from './styles'
import { FaIcon } from '../../Icone'

// import { msgerror } from '../../../globais'
import api from '../../../services/rf'

import UsuarioModal from '../UsuarioModal'
import useModal from '../UsuarioModal/useModal'

import ConfirmaModal from '../../ConfirmaModal'
import useModalConfirma from '../../ConfirmaModal/useModal'

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

const GridUsuarioModal = ({ 
  isShowing, 
  hide, 
  modo='', 
  tipoConsulta='', 
  callFind=undefined 
}) => {
  // const classes = useStyles()
  // const [modalStyle] = React.useState(getModalStyle)

  const [usuarios, setUsuarios] = useState(rowData)
  const [vgridApi, setVgridApi] = useState(gridApi)
  const [mensagem, setMensagem] = useState('')
  const [tipo, setTipo] = useState('')
  const [usuarioId, setUsuarioId] = useState(null)
  const [excluiId, setExcluiId] = useState(null)
  const [nomeExclui, setNomeExclui] = useState(null)
  const [tipoCadastro, setTipoCadastro] = useState('USUÁRIOS')

  const { isShowUsuario, toggleUsuario } = useModal()
  const { isShowConfirma, toggleConfirma } = useModalConfirma()

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    switch (tipoConsulta) {
      case 'O': setTipoCadastro('OPERADORES'); break
      case 'M': setTipoCadastro('MOTORISTAS'); break
      case 'C': setTipoCadastro('CLIENTES'); break
      case 'F': setTipoCadastro('FORNECEDORES'); break
      default: setTipoCadastro('USUÁRIOS')
    }
    
    buscaUsuarios()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowing])

  const buscaUsuarios = async () => {
    await sleep(1000)
    
    await api.post(`/buscausuarios`, {
      email: "",
      tipo: tipoConsulta,
      status: "",
      estado: ""
    })
      .then(response => {
        if (response.status !== 200) {
          toast(`Ocorreu um erro na busca dos usuários!`, { type: 'error' })
          return
        }
        setUsuarios(response.data)
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            // eslint-disable-next-line array-callback-return
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** GridUsuariosModal.buscaUsuarios.error.data', data)
          }
        } else if (error.request) {
          console.log('**** GridUsuariosModal.buscaUsuarios.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

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
      headerName: "",
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
      headerName: "WhatsApp",
      field: "whats",
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
    
    if (params.data.tipo === 'M') {
      switch (params.value) {
        case ' ': {
          if (params.data.status === 'A') {
            return (
              <span style={{ color: 'green' }}>
                <FaIcon icon='FaRegThumbsUp' size={20} />
                DISPONÍVEL
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
      if (params.value === ' ' || !params.value) {
        return (<></>)
        // return (<span style={{ color: 'gray' }}><FaIcon icon='FaCircle' size={20} /></span>)
      } else {
        return (<span style={{ color: 'green' }}><FaIcon icon='FaCircle' size={20} /></span>)
      }
    }
    

  }

  const FormatWhats = async (props, e) => {
    e.preventDefault()
    if (props.data.whats) {
      window.open(`https://api.whatsapp.com/send?phone=55${props.data.whats}&text=`, "_blank")
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
      // case 'I': return (<span style={{ color: 'gray' }}><FaIcon icon='FaCircle' size={20} /></span>)
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

  // const onCellClicked = (params) => {
  //   if (params.column.colId === 'whats') {
  //     window.open(`https://api.whatsapp.com/send?phone=55${params.data.whats}&text=`, "_blank")
  //   }
  // }

  const onRowDoubleClicked = (params) => {
    // console.log('**** onRowDoubleClicked', params)
    setTipo('V')
    setUsuarioId(params.data.id)
    toggleUsuario()
  }

  function formatNumber(number) {
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  const excluiUsuario = async (userID) => {
    
    if (usuarios.veiculos) {
      if (usuarios.veiculos.length > 0) {
        usuarios.veiculos.map(veiculo => {
          excluiVeiculo(veiculo.id)
        })
      }
    }

    await api.delete(`/usuarios/${userID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    ).then(response => {
      if (response.status !== 200) {
        toast(`Ocorreu um erro na exclusão do usuário!`,
          { type: 'error' })
        return
      }
      setExcluiId(null)
      setNomeExclui(null)
      buscaUsuarios()
    }).catch((error) => {
      if (error.response) {
        const { data } = error.response
        try {
          // eslint-disable-next-line array-callback-return
          data.map(mensagem => {
            toast(mensagem.message, { type: 'error' })
          })
        }
        catch (e) {
          console.log('**** GridUsuariosModal.excluiUsuario.error.data', data)
        }
      } else if (error.request) {
        console.log('**** GridUsuariosModal.excluiUsuario.error', error)
        // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
  }

  const excluiVeiculo = async (veiculoID) => {
    api.delete(`/veiculosm/${veiculoID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    ).then(response => {
      if (response.status === 200) {
        // toast('Veículo removido com sucesso!', { type: 'success' })
      } else {
        toast(response.data[0].message, { type: 'error' })
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
          console.log('**** GridUsuariosModal.excluiVeiculo.error.data', data)
        }
      } else if (error.request) {
        console.log('**** GridUsuariosModal.excluiVeiculo.error', error)
        // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
  }


  const onButtonClick = async (tipo, e) => {
    e.preventDefault()

    if (!isShowConfirma) {
      setExcluiId(null)
      setNomeExclui(null)
    }

    setTipo(tipo)

    const selectedNodes = vgridApi.getSelectedNodes()
    // const selectedData = selectedNodes.map( node => node.data )
    // const selectedDataStringPresentation = selectedData.map( node => node.make + ' ' + node.model).join(', ')
    // alert(`Selected nodes: ${selectedDataStringPresentation}`)

    if (selectedNodes.length === 0 && (tipo === 'E' || tipo === 'X')) {
      if (tipo === 'E') {
        toast('Você deve selecionar um registro para editar!', { type: 'error' })
      } else {
        toast('Você deve selecionar um registro para excluir!', { type: 'error' })
      }
      return
    }

    switch (tipo) {
      case 'E': 
        setUsuarioId(selectedNodes[0].data.id)
        break
      case 'X': 
        setExcluiId(selectedNodes[0].data.id)
        setNomeExclui(selectedNodes[0].data.nome)
        toggleConfirma()
        break
      case 'A': 
        buscaUsuarios() 
        return
      default: setUsuarioId(null)
    }
    if (tipo !== 'X'){
      toggleUsuario()
    }
  }

  const onReturn = (e) => {
    e.preventDefault()
    const selectedNodes = vgridApi.getSelectedNodes()

    if (selectedNodes.length === 0 && tipoCadastro !== '') {
      toast('Você deve selecionar um registro para retonar!', { type: 'error' })
      return
    } else {
      hide()
      if (callFind){
        callFind(selectedNodes[0].data.id)
      }
    }
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
                      {`CADASTRO DE ${tipoCadastro}`}
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Tooltip title="Atualizar Lista">
                      <Botao onClick={(e) => onButtonClick('A', e)}>
                          <FaIcon icon='GrUpdate' size={18} />
                      </Botao>
                    </Tooltip>
                    {
                      tipoConsulta !== '' && 
                      <Tooltip title="Retornar Consulta">
                        <Botao onClick={(e) => onReturn(e)}>
                          <FaIcon icon='Return' size={22} />
                        </Botao>
                      </Tooltip>
                    }
                    <Tooltip title="Excluir">
                      <Botao onClick={(e) => onButtonClick('X', e)}>
                        <FaIcon icon='Deletar' size={22} />
                      </Botao>
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
                  <AgGridReact
                    modules={AllCommunityModules}
                    rowSelection="multiple"
                    onGridReady={(params) => { setVgridApi(params.api) }}
                    columnDefs={columnDefs}
                    rowData={usuarios}
                    frameworkComponents={frameworkComponents}
                    tooltipShowDelay={0}
                    pagination={true}
                    paginationPageSize={50}
                    localeText={agPtBr}
                    // onCellClicked={onCellClicked}
                    onRowDoubleClicked={onRowDoubleClicked}
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

            <ConfirmaModal
              isShowConfirma={isShowConfirma}
              hide={toggleConfirma}
              texto='Confirma a Exclusão do Usuário?'
              texto1={nomeExclui}
              callback={() => excluiUsuario(excluiId)}
            />

          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default GridUsuarioModal