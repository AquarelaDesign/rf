/* eslint-disable array-callback-return */
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

import 'react-toastify/dist/ReactToastify.css'
import {
  Container,
  BoxTitulo,
  Texto,
  RLeft,
  RRight,
  Blank,
  Botao,
} from '../Cadastro/CardUsuario/styles'

import { FaIcon } from '../Icone'

import { Grid, Row, Col } from 'react-flexbox-grid'

import "./modal.css"

const ConfirmaModal = ({ isShowConfirma, hide, texto, texto1, callback }) => {

  useEffect(() => {

  }, [])

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const fechar = async () => {
    await sleep(1000)

    if (callback) {
      callback()
      hide()
    }
  }

  if (isShowConfirma) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal-confirm">
            <Container>
              <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Grid mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      ATENÇÃO
                    </Texto>
                  </RLeft>
                  <RRight>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                    <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank>
                  </RRight>
                </Grid>
              </BoxTitulo>

              <BoxTitulo bgcolor='#FFFFFF' mb={10}>
                <Grid style={{ marginTop: '10px' }}>
                  <Row style={{ height: '40px' }}>
                    <Col xs={12} style={{justifyItems: 'center'}} >
                      <Texto
                        size={22} height={16} italic={true} bold={700} font='Arial'>
                          {texto}
                      </Texto>
                    </Col>
                  </Row>
                  <Row style={{ height: '40px' }}>
                    <Col xs={12} style={{justifyItems: 'center'}} >
                      <Texto
                        color='#E6474D'
                        size={16} height={16} italic={true} bold={700} font='Arial'>
                          {texto1}
                      </Texto>
                    </Col>
                  </Row>
                  <Row style={{ height: '24px' }}>
                    <Col xs={6} style={{ justifyItems: 'center' }}>
                      <Botao width='95%' color='#FFFFFF' bg='#225378' bgh='#0031FF' onClick={() => fechar()}>SIM</Botao>
                    </Col>
                    <Col xs={6} style={{ justifyItems:'center' }}>
                      <Botao width='95%' color='#FFFFFF' bg='#225378' bgh='#0031FF' onClick={() => hide()}>NÃO</Botao>
                    </Col>
                  </Row>
                </Grid>
              </BoxTitulo>

            </Container>
          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default ConfirmaModal