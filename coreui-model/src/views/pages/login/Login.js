import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CImg,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import './login.scss'

import logo from '../../../assets/logo.png'

const Login = () => {
  return (
    <div className="c-app c-default-layout flex-row align-items-center bg">
      <CContainer>
        {/* <CImg src={bgImage} fluid className="mb-2" alt="" /> */}
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>

              <CCard className="text-white py-5 d-md-down-none" style={{ width: '44%', backgroundColor: '#1C3954' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Cadastre-se</h2>
                    <p>Com o objetivo de <strong>facilitar o transporte</strong> do seu veículo, o aplicativo <strong>RETORNO FÁCIL</strong> traz para você todas as rotas disponíveis e, rapidamente indica os melhor valor e prazo para o seu frete.</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>Registrar agora!</CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>

              <CCard className="p-4">
                <CCardBody>
                  <CImg src={logo} height={160} alt="" />
                  <CForm>
                    <h1>Conecte-se</h1>
                    <p className="text-muted">Faça login em sua conta</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" autoComplete="current-password" />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4">Conecte-se</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Esqueceu a senha?</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
