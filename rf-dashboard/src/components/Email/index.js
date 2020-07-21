import React from 'react'
import ReactDOM from 'react-dom'
import { makeStyles } from '@material-ui/core/styles'

import {
  Container,
  BoxTitulo,
  Texto,
  RLeft,
  RRight,
  Botao,
  Grid,
  Blank,
} from './styles'

import { Tooltip, } from '@material-ui/core'
import { FaIcon } from '../Icone'

import Editor from '../Editor'
import "./modal.css"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}))

const Email = ({ isShowEmail, hide, template }) => {
  const classes = useStyles()

  function submitTest(outPut){
    console.log(outPut);
  }

  if (isShowEmail) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal">
            <Container>
              <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Grid mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      Email
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                    <Tooltip title="Fechar Janela">
                      <Botao onClick={hide}><FaIcon icon='GiExitDoor' size={20} /> </Botao>
                    </Tooltip>
                  </RRight>
                </Grid>
              </BoxTitulo>

              <div
                className={classes.root}
                style={{ 
                  height: '490px', 
                  width: '100%', 
                  borderRadius: '10px', 
                  backgroundColor: '#FFFFFF' 
                }}
              >
                <Editor onSubmit={submitTest}/>
              </div>

              <BoxTitulo height={24} mt={10}>
                <Texto
                  size={22} height={24} italic={true} bold={700} font='Arial'>
                </Texto>
              </BoxTitulo>
            </Container>
          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default Email