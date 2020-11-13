/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '../../../assets/scss/agGrid.scss'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModules } from '@ag-grid-community/all-modules'
import agPtBr from '../../../components/agPtBr'
// import { columnDefs, defaultColDef } from "./columns"
import GridComponents from '../../../components/Grid'

// import { formatToPhone } from 'brazilian-values'
// import StarRatings from 'react-star-ratings'

import { Tooltip } from '@material-ui/core'
import { Container, BoxTitulo, Texto, Grid, Botao, RLeft, RRight, Blank } from './styles'
import { FaIcon } from '../../../components/Icone'

import api from '../../../services/rf'

import "./modal.css"

import ConfirmaModal from '../../../components/ConfirmaModal'
import useModalConfirma from '../../../components/ConfirmaModal/useModal'

import TipoFilter from './TipoFilter'
import TiposRenderer from './TiposRender'

const TabelaDeRotas = ({ isShowTabelaDeRotas, hide }) => {

  const [tiposCol, setTiposCol] = useState([])
  const [tipos, setTipos] = useState([])
  const [rotas, setRotas] = useState([])

  const [gridApi, setGridApi] = useState(null)
  const [columnApi, setColumnApi] = useState(null)
  const [excluiId, setExcluiId] = useState(null)
  const [propsE, setPropsE] = useState(null)
  const [sData, setSData] = useState(null)

  let [editing, setEditing] = useState(false)
  let [disabled, setDisabled] = useState(false)

  const { isShowConfirma, toggleConfirma } = useModalConfirma()

  useEffect(() => {
    carregaTipos()
    carregaRotas()

    return () => {
      try {
        gridApi.removeEventListener('rowEditingStopped', stopEditing)
      }
      catch (e) { }
    }
  }, [])

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const carregaTipos = async () => {
    await api
      .get('/tiposdeveiculos')
      .then(response => {
        const { data } = response
        setTipos(data)

        let tips = []
        data.forEach(tp => {
          tips.push(tp.nome)
        })

        // console.log('**** TabelaDeRotas.carregaTipos.tips', tips)
        setTiposCol(tips)
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** TabelaDeRotas.carregaTipos.error.data', data)
          }
        } else if (error.request) {
          console.log('**** TabelaDeRotas.carregaTipos.error', error)
        } else {
        }
      })

  }

  const carregaRotas = async () => {
    await api
      .get('/rotastabela')
      .then(response => {
        const { data } = response
        setRotas(data)
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** TabelaDeRotas.carregaRotas.error.data', data)
          }
        } else if (error.request) {
          console.log('**** TabelaDeRotas.carregaRotas.error', error)
        } else {
        }
      })

  }

  const frameworkComponents = {
    buscaTipo: BuscaTipo,
    simpleEditor: GridComponents.SimpleEditor,
    asyncValidationEditor: GridComponents.AsyncValidationEditor,
    autoCompleteEditor: GridComponents.AutoCompleteEditor,
    agDateInput: GridComponents.MyDatePicker,
    dateEditor: GridComponents.DateEditor,
    actionsRenderer: GridComponents.ActionsRenderer,
    addRowStatusBar: GridComponents.AddRowStatusBar,
    tipoFilter: TipoFilter,
    tiposRenderer: TiposRenderer,
  }

  const columnDefs = [
    {
      headerName: "Tipo",
      field: "tipo_de_veiculo_id",
      width: 200,
      cellRenderer: 'buscaTipo',
      cellEditor: "tiposRenderer",
      // filter: 'tipoFilter',
      // menuTabs: ['filterMenuTab'],
      cellEditorParams: {
        cellRenderer: 'buscaTipo',
        // options: tiposCol
      }
    },
    {
      headerName: "Cidade Origem",
      field: "cidade_origem",
      flex: 1,
      width: 200,
      cellEditor: "autoCompleteEditor",
    },
    {
      headerName: "UF",
      field: "uf_origem",
      width: 80,
      cellEditor: "autoCompleteEditor",
    },
    {
      headerName: "Cidade Destino",
      field: "cidade_destino",
      flex: 1,
      width: 200,
      cellEditor: "autoCompleteEditor",
    },
    {
      headerName: "UF",
      field: "uf_destino",
      width: 80,
      cellEditor: "autoCompleteEditor",
    },
    {
      headerName: "Valor",
      field: "valor",
      width: 100,
      filter: false,
    },
    // {
    //   headerName: "",
    //   width: 30,
    //   sortable: false,
    //   editable: false,
    //   cellRendererFramework: (props) => {
    //     return (
    //       <button onClick={(e) => startEditing(props, e)}
    //       color="primary"
    //       disabled={disabled}
    //       style={{ backgroundColor: 'transparent' }}
    //       >
    //         <Tooltip title="Editar rota">
    //           <span style={{
    //             alignItems: 'center',
    //             marginLeft: '-18px',
    //             marginTop: '3px',
    //           }}>
    //             <FaIcon icon='FaRegEdit' size={20} />
    //           </span>
    //         </Tooltip>
    //       </button>
    //     )
    //   },
    // },
    {
      headerName: "",
      width: 30,
      sortable: false,
      editable: false,
      cellRendererFramework: (props) => {
        return (
          <button onClick={(e) => handleDeleteRow(props, e)}
            disabled={disabled}
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
    // {
    //   headerName: "",
    //   colId: "actions",
    //   cellRenderer: "actionsRenderer",
    //   editable: false,
    //   filter: false,
    //   width: 80
    // }
  ]

  const handleDeleteRow = async (props, e) => {
    e.preventDefault()
    setExcluiId(props.data.id)
    setPropsE(props)
    setSData(props.data)
    await sleep(300)
    toggleConfirma()
  }


  const defaultColDef = {
    editable: true,
    resizable: false,
    filter: true,
    // floatingFilter: true,
    suppressKeyboardEvent: params => params.editing
  }

  function BuscaTipo(params) {
    return tipos.filter(tipo => tipo.id === params.value).map(
      ftipo => {
        return ftipo['id'] + ' - ' + ftipo['nome']
      }
    )
  }

  const novaRota = async () => {
    const newRow = {
      tipo_de_veiculo_id: 1,
      cidade_origem: "",
      uf_origem: "",
      cidade_destino: "",
      uf_destino: "",
      nome: "",
      valor: 0,
    }

    gridApi.applyTransaction({ add: [newRow], addIndex: 0 })
    gridApi.setFocusedCell(0, 'tipo')
    gridApi.startEditingCell({
      rowIndex: 0,
      colKey: 'tipo',
    })
  }

  const excluiRota = async () => {
    if (excluiId) {
      api.delete(`/rotastabela/${excluiId}`,
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
          propsE.api.applyTransaction({ remove: sData })

        } else {
          toast(response.data[0].message,
            { type: 'error' })
        }

        setExcluiId(null)
        setPropsE(null)
        setSData(null)

      }).catch((error) => {
        setExcluiId(null)
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
            console.log('**** TabelaDeRotas.excluirota.error.data', data)
          }
        } else if (error.request) {
          console.log('**** TabelaDeRotas.excluirota.error', error)
        } else {
        }
      })
    }
  }

  const salvaRota = async (dados) => {
    if (dados) {
      dados.nome = `${dados.cidade_origem}/${dados.uf_origem} X ${dados.cidade_destino}/${dados.uf_destino}`
      let apiParams = {}
      if (dados.id) {
        apiParams = {
          method: 'put',
          url: `/rotastabela/${dados.id}`,
          data: JSON.stringify(dados),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      } else {
        apiParams = {
          method: 'post',
          url: `/rotastabela`,
          data: JSON.stringify(dados),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      }

      await api(apiParams)
        .then(response => {
          // const { data } = response
          gridApi.refreshCells({ force: true })
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
              console.log('**** TabelaDeRotas.salvaRota.error.data', data)
            }
          } else if (error.request) {
            console.log('**** TabelaDeRotas.salvaRota.error', error)
            // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
          } else {
            // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
          }
        })

    }
  }

  function onGridReady(params) {
    params.api.addEventListener('rowEditingStopped', stopEditing)
    setGridApi(params.api)
    setColumnApi(params.columnApi)
  }

  function stopEditing(props) {
    console.log('**** TabelaDeRotas.stopEditing.props', props.data)
    salvaRota(props.data)
  }

  if (isShowTabelaDeRotas) {
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
                      CADASTRO DE ROTAS
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                    <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                    <Tooltip title="Adicionar um Novo">
                      <Botao onClick={novaRota}><FaIcon icon='FcPlus' size={20} /> </Botao>
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
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowData={rotas}
                    getRowNodeId={data => data.id}
                    onGridReady={onGridReady}
                    frameworkComponents={frameworkComponents}
                    editType="fullRow"
                    stopEditingWhenGridLosesFocus={true}
                    // suppressClickEdit
                    // statusBar={{
                    //   statusPanels: [{ statusPanel: "addRowStatusBar" }]
                    // }}
                    // rowSelection="single"
                    // tooltipShowDelay={0}
                    pagination={true}
                    paginationPageSize={20}
                    localeText={agPtBr}
                  >
                  </AgGridReact>

                </div>
              </BoxTitulo>
            </Container>

            <ConfirmaModal
              isShowConfirma={isShowConfirma}
              hide={toggleConfirma}
              texto='Confirma a Exclusão da Rota?'
              texto1={''}
              callback={() => excluiRota(excluiId)}
            />

          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default TabelaDeRotas