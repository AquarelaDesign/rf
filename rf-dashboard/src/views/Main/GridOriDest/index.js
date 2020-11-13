import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  Container,
  BoxTitulo,
  Texto,
  Botao,
  RLeft,
  RRight,
  Blank,
} from '../../Cadastro/CardUsuario/styles'

import { 
  Tooltip, 
} from '@material-ui/core'

import '../../../assets/scss/agGrid.scss'
import { AgGridReact, gridApi } from 'ag-grid-react'
import { AllCommunityModules } from '@ag-grid-community/all-modules'
import agPtBr from '../../../components/agPtBr'

import { FaIcon } from '../../../components/Icone'

import { Grid, Row, Col } from 'react-flexbox-grid'

import "./modal.css"

import PedidoModal from '../../Pedidos/PedidoModal'
import useModal from '../../Pedidos/PedidoModal/useModal'

const GridOriDest = ({ isShowRota, hide, rotas, tipo=''}) => {
  const [pedidoId, setPedidoId] = useState(null)
  const [vgridApi, setVgridApi] = useState(gridApi)

  const { isShowPedido, togglePedido } = useModal()

  const columnDefs = [
    {
      headerName: "Pedido",
      field: "pedido_id",
      width: 80,
      sortable: true,
    },
    {
      headerName: "Cidade",
      field: "cidade",
      flex: 1,
      width: 80,
    },
    {
      headerName: "UF",
      field: "uf",
      flex: 1,
      width: 50,
    },
    {
      headerName: "Motorista",
      field: "motorista_id",
      width: 80,
    },
  ]

  const onRowDoubleClicked = (params) => {
    setPedidoId(params.data.pedido_id)
    togglePedido()
  }

  const fechar = async (e) => {
    hide()
  }

  if (isShowRota) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal-placa">
            <Container>
              <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Grid mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      Pedidos para a rota {tipo}
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                    <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                    <Tooltip title="Fechar Janela">
                      <Botao onClick={fechar}><FaIcon icon='GiExitDoor' size={20} /></Botao>
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
                    rowData={rotas}
                    // frameworkComponents={frameworkComponents}
                    tooltipShowDelay={0}
                    // pagination={true}
                    // paginationPageSize={50}
                    localeText={agPtBr}
                    onRowDoubleClicked={onRowDoubleClicked}
                    >
                  </AgGridReact>
                </div>
              </BoxTitulo>

              <PedidoModal
                isShowPedido={isShowPedido}
                hide={togglePedido}
                tipoCad='D'
                pedidoID={pedidoId}
                disableEdit={true}
              />

            </Container>
          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default GridOriDest