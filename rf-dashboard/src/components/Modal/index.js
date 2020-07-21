import React from 'react'
import ReactDOM from 'react-dom'

import "./modal.css"

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const Modal = ({ 
  isShowing, 
  hide, 
  title, 
  botaoConfirm, 
  botaoCancel, 
  isBody,
  isUpdate,
  update,
  confirm=()=>{}, 
  cancel=()=>{} 
}) => isShowing ? ReactDOM.createPortal(
  <React.Fragment>
    <div className="modal-fundo" />
    <div className="modal-container" aria-modal aria-hidden tabIndex={-1} role="dialog">
      <div className="root">
        <div className="modal-cabecalho">
          <button type="button" className="modal-botao-fechar" data-dismiss="modal" aria-label="Close" onClick={hide}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        {isBody}
        <div className="modal-rodape">
          <button 
            type="button" 
            className="modal-botao" 
            onClick={async () => {
              await sleep(300)
              console.log('*** Modal-1', isUpdate)
              update()
              console.log('*** Modal-2', isUpdate)
              hide()
              return confirm()
            }}
          >
            <span aria-hidden="true">{botaoConfirm}</span>
          </button>
          <button 
            type="button" 
            className="modal-botao" 
            onClick={() => {
              hide()
              return cancel()
            }}
          >
            <span aria-hidden="true">{botaoCancel}</span>
          </button>

        </div>
      </div>
    </div>
  </React.Fragment>, document.body
) : null

export default Modal