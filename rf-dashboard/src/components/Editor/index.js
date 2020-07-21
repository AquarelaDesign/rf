import React, { useEffect } from 'react'
import Toolbar from './components/Toolbar'
import './styles.css'

export default function Editor({ onSubmit, template }) {

  useEffect(() => {
    if (template) {
      const editor = document.getElementById('editor')
      editor.innerHTML(template)
    }
  }, [template])

  // tratando submit do editor
  function handleSubmit(){
    const editor = document.getElementById('editor')

    if(onSubmit){
      return onSubmit(editor.innerHTML)
    }

    return console.log(undefined)
  }

  return (
    <div style={{
      // flex: 1,
      // flexDirection: 'column',
      // display: 'flex',
      // marginTop: '15px',
      width: '100%',
    }}>

      <div className="controls-content">
        <button id="salve" className="editor-button" onClick={handleSubmit} >Enviar</button>
        <button className="editor-button">Cancelar</button>
      </div>

      <Toolbar />

      <div
        id="editor"
        className="editor-paper"
        style={{
          width: '97.3%',
        }}
        contentEditable="true"
        designmode="on"
        spellCheck="true" />

    </div>
  )
} 