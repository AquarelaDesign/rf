/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '../../../assets/scss/agGrid.scss'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModules } from '@ag-grid-community/all-modules'
import agPtBr from '../../../components/agPtBr'
import GridComponents from '../../../components/Grid'

import { Tooltip } from '@material-ui/core'
import { Container, BoxTitulo, Texto, Grid, Botao, RLeft, RRight, Blank } from './styles'
import { FaIcon } from '../../../components/Icone'

import api from '../../../services/rf'

import "./modal.css"

import ConfirmaModal from '../../../components/ConfirmaModal'
import useModalConfirma from '../../../components/ConfirmaModal/useModal'

const TabelaDeSeguros = ({ isShowTabelaDeSeguros, hide }) => {

  const [, setTiposCol] = useState([])
  const [tipos, setTipos] = useState([])
  const [seguros, setSeguros] = useState([])

  const [gridApi, setGridApi] = useState(null)
  const [, setColumnApi] = useState(null)
  const [excluiId, setExcluiId] = useState(null)
  const [propsE, setPropsE] = useState(null)
  const [sData, setSData] = useState(null)

  let [disabled, setDisabled] = useState(false)

  const { isShowConfirma, toggleConfirma } = useModalConfirma()

  useEffect(() => {
    carregaSeguros()

    return () => {
      try {
        gridApi.removeEventListener('rowEditingStopped', stopEditing)
      }
      catch (e) { }
    }
  }, [])

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const carregaSeguros = async () => {
    await api
      .get('/seguros')
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
            console.log('**** TabelaDeSeguros.carregaSeguros.error.data', data)
          }
        } else if (error.request) {
          console.log('**** TabelaDeSeguros.carregaSeguros.error', error)
        } else {
        }
      })

  }

  // const frameworkComponents = {
  //   simpleEditor: GridComponents.SimpleEditor,
  //   asyncValidationEditor: GridComponents.AsyncValidationEditor,
  //   autoCompleteEditor: GridComponents.AutoCompleteEditor,
  //   agDateInput: GridComponents.MyDatePicker,
  //   dateEditor: GridComponents.DateEditor,
  //   actionsRenderer: GridComponents.ActionsRenderer,
  //   addRowStatusBar: GridComponents.AddRowStatusBar,
  // }

  const columnDefs = [
    { headerName: "UF", field: "uf", width: 80, editable: false, cellStyle: {color: '#FFFFFF', 'background-color': '#2699F8'}, pinned: 'left',},
    { headerName: "AL", field: "al", width: 80, },
    { headerName: "AP", field: "ap", width: 80, },
    { headerName: "AM", field: "am", width: 80, },
    { headerName: "BA", field: "ba", width: 80, },
    { headerName: "CE", field: "ce", width: 80, },
    { headerName: "DF", field: "df", width: 80, },
    { headerName: "ES", field: "es", width: 80, },
    { headerName: "GO", field: "go", width: 80, },
    { headerName: "MA", field: "ma", width: 80, },
    { headerName: "MT", field: "mt", width: 80, },
    { headerName: "MS", field: "ms", width: 80, },
    { headerName: "MG", field: "mg", width: 80, },
    { headerName: "PA", field: "pa", width: 80, },
    { headerName: "PB", field: "pb", width: 80, },
    { headerName: "PR", field: "pr", width: 80, },
    { headerName: "PE", field: "pe", width: 80, },
    { headerName: "PI", field: "pi", width: 80, },
    { headerName: "RJ", field: "rj", width: 80, },
    { headerName: "RN", field: "rn", width: 80, },
    { headerName: "RS", field: "rs", width: 80, },
    { headerName: "RO", field: "ro", width: 80, },
    { headerName: "RR", field: "rr", width: 80, },
    { headerName: "SC", field: "sc", width: 80, },
    { headerName: "SP", field: "sp", width: 80, },
    { headerName: "SE", field: "se", width: 80, },
    { headerName: "TO", field: "to", width: 80, },
    /*
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
            <Tooltip title="Excluir seguro">
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
    */
  ]
  /*
  const handleDeleteRow = async (props, e) => {
    e.preventDefault()
    setExcluiId(props.data.id)
    setPropsE(props)
    setSData(props.data)
    await sleep(300)
    toggleConfirma()
  }
  */
  const defaultColDef = {
    editable: true,
    resizable: false,
    filter: false,
    // floatingFilter: true,
    suppressKeyboardEvent: params => params.editing
  }

  const novaSeguro = async () => {
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

  const excluiSeguro = async () => {
    if (excluiId) {
      api.delete(`/segurostabela/${excluiId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      ).then(response => {
        if (response.status === 200) {
          toast('Seguro removida com sucesso!',
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
            console.log('**** TabelaDeSeguros.excluiseguro.error.data', data)
          }
        } else if (error.request) {
          console.log('**** TabelaDeSeguros.excluiseguro.error', error)
        } else {
        }
      })
    }
  }

  const salvaSeguro = async (dados) => {
    if (dados) {
      let apiParams = {}
      if (dados.id) {
        apiParams = {
          method: 'put',
          url: `/seguros/${dados.id}`,
          data: JSON.stringify(dados),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      } else {
        apiParams = {
          method: 'post',
          url: `/seguros`,
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
              console.log('**** TabelaDeSeguros.salvaSeguro.error.data', data)
            }
          } else if (error.request) {
            console.log('**** TabelaDeSeguros.salvaSeguro.error', error)
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
    // console.log('**** TabelaDeSeguros.stopEditing.props', props.data)
    salvaSeguro(props.data)
  }

  if (isShowTabelaDeSeguros) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal-tab-seguros" style={{ background: '#2699F8' }}>
            <Container>
              <BoxTitulo height={32} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Grid mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      CADASTRO DE INDICES DA SEGURADORA ALLIANZ
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                    <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                    <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                    {/* <Tooltip title="Adicionar um Novo">
                      <Botao onClick={novaSeguro}><FaIcon icon='FcPlus' size={20} /> </Botao>
                    </Tooltip> */}
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
                    rowData={seguros}
                    getRowNodeId={data => data.id}
                    onGridReady={onGridReady}
                    // frameworkComponents={frameworkComponents}
                    stopEditingWhenGridLosesFocus={true}
                    // pagination={true}
                    // paginationPageSize={20}
                    localeText={agPtBr}
                  >
                  </AgGridReact>

                </div>
              </BoxTitulo>
            </Container>

            <ConfirmaModal
              isShowConfirma={isShowConfirma}
              hide={toggleConfirma}
              texto='Confirma a Exclusão da Seguro?'
              texto1={''}
              callback={() => excluiSeguro(excluiId)}
            />

          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default TabelaDeSeguros