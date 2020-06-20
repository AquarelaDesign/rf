import React, { useState, useEffect } from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AgGridReact, gridApi } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

import { formatToPhone } from 'brazilian-values'
import StarRatings from 'react-star-ratings'


import { Container, BoxTitulo, Texto, Grid, Botao, RLeft, RRight, BoxStatus } from './styles'
import { FaIcon } from '../../Icone'

import { msgerror } from '../../../globais'
import api from '../../../services/rf'

const rowData = [
  {make: "Toyota", model: "Celica", price: 35000}, 
  {make: "Ford", model: "Mondeo", price: 32000}, 
  {make: "Porsche", model: "Boxter", price: 72000}
]

const GridUsuarios = () => {
  const [usuarios, setUsuarios] = useState(rowData)
  const [vgridApi, setVgridApi] = useState(gridApi)
  const [mensagem, setMensagem] = useState('')

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
  }

  const columnDefs = [
    {headerName: "", field: "status", width: 40, filter: true, sortable: true, cellRenderer: 'formatStatus', tooltipField: 'status', tooltipComponent: 'toolStatus'},
    {headerName: "", field: "tipo", width: 40, filter: true, sortable: true, cellRenderer: 'formatTipo'},
    {headerName: "Nome", field: "nome", width: 385, sortable: true, filter: true}, 
    {headerName: "Celular", field: "celular", width: 170, valueFormatter: celFormatter},
    {headerName: "Localização", field: "localizacao", width: 320, filter: true, sortable: true},
    {headerName: "", field: "estado", width: 40, filter: true, sortable: true, cellRenderer: 'formatEstado'},
    {headerName: "Rate", field: "rate", width: 100, sortable: true, cellRenderer: 'stRatings'},
  ]
  
  function FormatEstado(params) {
    // '[] Disponível, Aguardando A[P]rovacao, [A]guardando Coleta, Em [T]ransporte'
    console.log('*** formatEstado', params.value)
    switch (params.value) {
      case '': return (<span style={{ color:'green' }}><FaIcon icon='FaRegThumbsUp' size={20} /></span>)
      case 'P': return (<span style={{ color:'blue' }}><FaIcon icon='FaTruckLoading' size={20} /></span>)
      case 'A': return (<span style={{ color:'orange' }}><FaIcon icon='FaHandPaper' size={20} /></span>)
      case 'T': return (<span style={{ color:'red' }}><FaIcon icon='GrDeliver' size={20} /></span>)
      default:  return (<></>)
    }
  } 
  
  function FormatTipo(params) {
    switch (params.value) {
      case 'O': return (<FaIcon icon='FaHeadphonesAlt' size={20} />)
      case 'M': return (<FaIcon icon='FaTruck1' size={20} />)
      case 'C': return (<FaIcon icon='FaUserTie' size={20} />)
      default:  return (<></>)
    }
  } 
  
  function FormatStatus(params) {
    switch (params.value) {
      case 'A': return (<BoxStatus color='green'/>)
      case 'I': return (<BoxStatus color='gray'/>)
      default:  return (<></>)
    }
  } 
  
  function ToolStatus(params) {
    switch (params.value) {
      case 'A': 
        setMensagem(<span style={{ color:'green' }}>Online</span>)
        return (<></>) 
      case 'I': 
        setMensagem(<span style={{ color:'green' }}>Offline</span>)
        return (<></>) 
    default:  return (<></>)
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
  
  const onButtonClick = (e) => {
    const selectedNodes = vgridApi.getSelectedNodes()
    const selectedData = selectedNodes.map( node => node.data )
    const selectedDataStringPresentation = selectedData.map( node => node.make + ' ' + node.model).join(', ')
    alert(`Selected nodes: ${selectedDataStringPresentation}`)
  }

  return (
    <Container>
      <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
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
            <Botao onClick={onButtonClick}><FaIcon icon='RiSearchLine' size={20} /> </Botao>
            <Botao onClick={onButtonClick}><FaIcon icon='FaRegEdit' size={20} /> </Botao>
            <Botao onClick={onButtonClick}><FaIcon icon='FcPlus' size={20} /> </Botao>
          </RRight>
        </Grid>
      </BoxTitulo>

      <div className="ag-theme-alpine" style={ {height: '92%', width: '100%', borderRadius: '10px'} }>
        <AgGridReact
            rowSelection="multiple"
            onGridReady={ (params) => {setVgridApi(params.api)} }
            columnDefs={columnDefs}
            rowData={usuarios}
            frameworkComponents={frameworkComponents}
            tooltipShowDelay={0}
        >
        </AgGridReact>
      </div>

      <BoxTitulo height={24} mt={10}>
        <Texto 
          size={22} height={24} italic={true} bold={700} font='Arial'>
            {mensagem}
        </Texto>
      </BoxTitulo>

    </Container>
  );
}

export default GridUsuarios