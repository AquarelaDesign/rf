import React, { useState } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import 'react-perfect-scrollbar/dist/css/styles.css'

import GlobalStyle from '../../../styles/global'

import Header from '../Header'
import Board from '../Board'
import Fiscal from '../Fiscal'
import Financeiro from '../Financeiro'

export default function Dashboard() {
  const [opcao, setOpcao] = useState('LOG')
  const [filtros, setFiltros] = useState({})

  const backHeader = (e) => {
    setOpcao(e)
  }

  const backFilter = (e) => {
    // console.log('**** DashBoard.backFilter', e)
    setFiltros(e)
  }

  const SelBoard = () => {
    switch (opcao) {
      case 'LOG': return <Board filtro={filtros} />
      case 'FIS': return <Fiscal />
      case 'FIN': return <Financeiro />
      default: return <></>
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Header backHeader={(e) => backHeader(e)} backFilter={backFilter} />
      <SelBoard />
      <GlobalStyle />
    </DndProvider>
  )

}