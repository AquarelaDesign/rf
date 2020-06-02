import React from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import 'react-perfect-scrollbar/dist/css/styles.css'

import GlobalStyle from '../../styles/global'

import Header from '../../components/Header'
import Board from '../../components/Board'

export default function Dashboard() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Header />
      <Board />

      <GlobalStyle />
    </DndProvider>
  )

}