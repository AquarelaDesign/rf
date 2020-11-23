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

import CheckBoxRender from './CheckBoxRender'

import api from '../../../services/rf'

import "./modal.css"

import ConfirmaModal from '../../../components/ConfirmaModal'
import useModalConfirma from '../../../components/ConfirmaModal/useModal'

import TipoFilter from './TipoFilter'
import TiposRenderer from './TiposRender'
import TiposDespesaRender from './TiposDespesaRender'

const tipoDespesas = [
  { id: 'margem', nome: 'MARGEM' },
  { id: 'imposto', nome: 'IMPOSTO' },
  { id: 'valorkm', nome: 'VALOR DO KM' },
]

const TabelaDespesas = ({ isShowTabelaDespesas, hide }) => {

  const [, setTiposCol] = useState([])
  const [tipos, setTipos] = useState([])
  const [despesas, setDespesas] = useState([])

  const [gridApi, setGridApi] = useState(null)
  const [, setColumnApi] = useState(null)
  const [excluiId, setExcluiId] = useState(null)
  const [propsE, setPropsE] = useState(null)
  const [sData, setSData] = useState(null)

  let [disabled, setDisabled] = useState(false)

  const { isShowConfirma, toggleConfirma } = useModalConfirma()

  useEffect(() => {
    carregaTipos()
    carregaDespesas()

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

        // console.log('**** TabelaDespesas.carregaTipos.tips', tips)
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
            console.log('**** TabelaDespesas.carregaTipos.error.data', data)
          }
        } else if (error.request) {
          console.log('**** TabelaDespesas.carregaTipos.error', error)
        } else {
        }
      })

  }

  const carregaDespesas = async () => {
    await api
      .get('/valoresadicionais')
      .then(response => {
        const { data } = response
        setDespesas(data)
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** TabelaDespesas.carregaDespesas.error.data', data)
          }
        } else if (error.request) {
          console.log('**** TabelaDespesas.carregaDespesas.error', error)
        } else {
        }
      })

  }

  const frameworkComponents = {
    buscaTipo: BuscaTipo,
    buscaTipoDespesa: BuscaTipoDespesa,
    checkBoxRender: CheckBoxRender,
    tipoFilter: TipoFilter,
    tiposRenderer: TiposRenderer,
    tiposDespesaRender: TiposDespesaRender,
  }

  const columnDefs = [
    {
      headerName: "Tipo de Veículo",
      field: "tipo_de_veiculo_id",
      width: 200,
      cellRenderer: 'buscaTipo',
      cellEditor: "tiposRenderer",
      cellEditorParams: {
        cellRenderer: 'buscaTipo',
      }
    },
    {
      headerName: "Tipo",
      field: "tipo",
      width: 150,
      cellRenderer: 'buscaTipoDespesa',
      cellEditor: "tiposDespesaRender",
      cellEditorParams: {
        cellRenderer: 'buscaTipoDespesa',
      }
    },
    {
      headerName: "Nome",
      field: "nome",
      width: 150,
    },
    {
      headerName: "Valor",
      field: "valor",
      width: 200,
    },
    {
      headerName: "I",
      field: "imposto",
      width: 80,
      cellRenderer: 'checkBoxRender',
      cellEditor: "checkBoxRender",
      // cellEditorParams: {
      //   cellRenderer: 'checkBoxRender',
      // }
    },
    {
      headerName: "E",
      field: "exclusivo",
      width: 80,
      cellRenderer: 'checkBoxRender',
      cellEditor: "checkBoxRender",
      // cellEditorParams: {
      //   cellRenderer: 'checkBoxRender',
      // }
    },
    {
      headerName: "C",
      field: "cortesia",
      width: 80,
      cellRenderer: 'checkBoxRender',
      cellEditor: "checkBoxRender",
      // cellEditorParams: {
      //   cellRenderer: 'checkBoxRender',
      // }
    },
    {
      headerName: "M",
      field: "mostra",
      width: 80,
      cellRenderer: 'checkBoxRender',
      cellEditor: "checkBoxRender",
      // cellEditorParams: {
      //   cellRenderer: 'checkBoxRender',
      // }
    },
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
            <Tooltip title="Excluir despesa">
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

  function BuscaTipoDespesa(params) {
    return tipoDespesas.filter(tipo => tipo.id === params.value).map(
      ftipo => {
        return ftipo['nome']
      }
    )
  }

  const novaDespesa = async () => {
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

  const excluiDespesa = async () => {
    if (excluiId) {
      api.delete(`/valoresadicionais/${excluiId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      ).then(response => {
        if (response.status === 200) {
          toast('Despesa removida com sucesso!',
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
            console.log('**** TabelaDespesas.excluidespesa.error.data', data)
          }
        } else if (error.request) {
          console.log('**** TabelaDespesas.excluidespesa.error', error)
        } else {
        }
      })
    }
  }

  const salvaDespesa = async (dados) => {
    console.log('**** TabelaDespesas.salvaDespesa.dados', dados)
    return
    if (dados) {
      let apiParams = {}
      if (dados.id) {
        apiParams = {
          method: 'put',
          url: `/valoresadicionais/${dados.id}`,
          data: JSON.stringify(dados),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      } else {
        apiParams = {
          method: 'post',
          url: `/valoresadicionais`,
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
              console.log('**** TabelaDespesas.salvaDespesa.error.data', data)
            }
          } else if (error.request) {
            console.log('**** TabelaDespesas.salvaDespesa.error', error)
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
    // console.log('**** TabelaDespesas.stopEditing.props', props.data)
    salvaDespesa(props.data)
  }

  if (isShowTabelaDespesas) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal-tab-despesas" style={{ background: '#2699F8' }}>
            <Container>
              <BoxTitulo height={32} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Grid mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      CADASTRO DE DESPESAS
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                    <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                    <Tooltip title="Adicionar um Novo">
                      <Botao onClick={novaDespesa}><FaIcon icon='FcPlus' size={20} /> </Botao>
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
                    rowData={despesas}
                    getRowNodeId={data => data.id}
                    onGridReady={onGridReady}
                    frameworkComponents={frameworkComponents}
                    editType="fullRow"
                    stopEditingWhenGridLosesFocus={true}
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
              texto='Confirma a Exclusão da Despesa?'
              texto1={''}
              callback={() => excluiDespesa(excluiId)}
            />

          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default TabelaDespesas