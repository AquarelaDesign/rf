import React, { useState } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import 'react-perfect-scrollbar/dist/css/styles.css'

import GlobalStyle from '../../../styles/global'

import Header from '../Header'
import Board from '../Board'
import Fiscal from '../Fiscal'

export default function Dashboard() {
  const [opcao, setOpcao] = useState('LOG')

  const backHeader = (e) => {
    setOpcao(e)
  }

  const SelBoard = () => {
    switch (opcao) {
      case 'LOG': return <Board />
      case 'FIS': return <Fiscal />
      default: return <></>
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Header backHeader={(e) => backHeader(e)} />
      <SelBoard />
      <GlobalStyle />
    </DndProvider>
  )

}