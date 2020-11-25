/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '../../../assets/scss/agGrid.scss'
import { AgGridReact, gridApi } from 'ag-grid-react'
import { AllCommunityModules } from '@ag-grid-community/all-modules'
import agPtBr from '../../../components/agPtBr'

import { formatToPhone } from 'brazilian-values'

import { Tooltip } from '@material-ui/core'
import { Container, BoxTitulo, Texto, Grid, Botao, RLeft, RRight } from './styles'
import { FaIcon } from '../../../components/Icone'

import api from '../../../services/rf'

import PatioModal from '../TabelaPatios'
import useModal from '../TabelaPatios/useModal'

import PartialMatchFilter from './PartialMatchFilter'

import "./modal.css"

const rowData = []

const GridPatiosModal = ({ isShowingPatios, hide }) => {
  const [patios, setPatios] = useState(rowData)
  const [vgridApi, setVgridApi] = useState(gridApi)
  const [tipoCad, setTipoCad] = useState('')
  const [patioId, setPatioId] = useState(null)
  
  const [, setOperadorID] = useState(null)

  const { isShowPatio, togglePatio } = useModal()

  useEffect(() => {
    buscaPatios()
    setOperadorID(localStorage.getItem('@rf/userID'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowPatio])

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const buscaPatios = async () => {
    await api.get(`/patios`, {})
      .then(response => {
        setPatios(response.data)
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** GridPatiosModal.buscaPatios.error.data', data)
          }
        } else if (error.request) {
          console.log('**** GridPatiosModal.buscaPatios.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  function celFormatter(params) {
    return formatToPhone(formatNumber(params.value))
  }

  function formatNumber(number) {
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  const frameworkComponents = {
    partialMatchFilter: PartialMatchFilter,
  }

  const columnDefs = [
    {
      headerName: "UF",
      field: "uf",
      width: 80,
      sortable: true,
      filter: 'partialMatchFilter',
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: "Cidade",
      field: "cidade",
      flex: 1,
      sortable: true,
      filter: 'partialMatchFilter',
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
      headerName: "Contato",
      field: "contato",
      flex: 1,
      sortable: true,
    },
    {
      headerName: "Celular",
      field: "celular",
      width: 170,
      valueFormatter: celFormatter,
    },
    {
      headerName: "Celular",
      field: "celular1",
      width: 170,
      valueFormatter: celFormatter,
    },
  ]

  const onRowDoubleClicked = (params) => {
    // console.log('**** onRowDoubleClicked', params)
    setTipoCad('V')
    setPatioId(params.data.id)
    togglePatio()
  }

  const onButtonClick = async (tipo, e) => {
    e.preventDefault()

    const selectedNodes = vgridApi.getSelectedRows()
    if (selectedNodes.length === 0 && (tipo === 'E' || tipo === 'V')) {
      toast('Você deve selecionar um registro!', { type: 'error' })
      return
    }

    setTipoCad(tipo)

    // alert(`Patio: ${selectedNodes[0].id}`)
    // return

    switch (tipo) {
      case 'E': 
        setPatioId(selectedNodes[0].id)
        break
      case 'A':
        buscaPatios()
        return
      case 'N':
        novoPatio()
        return
      case 'V': 
        setPatioId(selectedNodes[0].id)
        break
      default: setPatioId(null)
    }
    
    await sleep(300)
    togglePatio()
  }

  const novoPatio = async () => {
    console.log('**** GridPatioModal.novoPatio')
    setTipoCad('N')
    setPatioId(0)
    console.log('**** GridPatioModal.novoPatio')
    togglePatio()
  }

  const callBackPatio = (e) => {
    setPatioId(null)
  }

  if (isShowingPatios) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal-patios" style={{ background: '#2699F8' }}>
            <Container>
              <BoxTitulo height={32} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Grid mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      CADASTRO DE PATIOS
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
                  <AgGridReact
                    modules={AllCommunityModules}
                    rowSelection="single"
                    onGridReady={(params) => { setVgridApi(params.api) }}
                    columnDefs={columnDefs}
                    rowData={patios}
                    frameworkComponents={frameworkComponents}
                    tooltipShowDelay={0}
                    pagination={true}
                    paginationPageSize={50}
                    localeText={agPtBr}
                    onRowDoubleClicked={onRowDoubleClicked}
                    >
                  </AgGridReact>
                </div>
              </BoxTitulo>
            </Container>
          </div>
        </div>
        {patioId !== null && 
          <PatioModal
            isShowPatio={isShowPatio}
            hide={togglePatio}
            patioID={patioId}
            tipoCad={tipoCad !== 'E' && tipoCad !== 'N' ? 'D' : tipoCad}
            disableEdit={tipoCad !== 'E' && tipoCad !== 'N' ? true : false}
            callBack={callBackPatio}
          />
        }
      </React.Fragment>
      , document.body)
  }
  return null
}

export default GridPatiosModal