import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { Container, Form, Image } from 'react-bootstrap'

import 'react-toastify/dist/ReactToastify.css'
import { AccountCircle, Lock } from '@material-ui/icons'

import api from '../../services/rf'
import logo from '../../assets/logo.png'
import { 
  Loginsc, 
  TituloLogin, 
  FormLabel, 
  Botao, 
  Topo, 
  Rodape, 
  RLeft, 
  RCenter, 
  RRight, 
  RTitulo, 
  RTexto, 
} from './styles'

const Login = ({ history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [rememberMe, setRememberMe] = useState(false)
  
  const clickEsqueceuSenha = () => {
    console.log('clickEsqueceuSenha')
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await api.post('/authenticate', {
        email, password
      })
      .then(res => {
        // console.log('res', res)
        const { token } = res.data

        localStorage.setItem('@rf/email', email)
        localStorage.setItem('@rf/token', token)
        // localStorage.setItem('@rf/rememberMe', rememberMe)

        history.push('/home')
      })

    } catch (error) {
      const { response } = error
      if (response !== undefined) {
        toast(response.status !== 401 ? response.data[0].message : 'Senha inválida!', {type: 'error'})
      } else {
        toast(error, {type: 'error'})
      }
    }
  }

  return (
    <Container style={{height: '100%'}}>
      <Topo/>
      <Loginsc>
        <Image id="logo" src={logo} alt="" style={{marginTop: 20, height: 150}} />
        <Form onSubmit={handleSubmit}>
          <TituloLogin>Login</TituloLogin>

          <FormLabel>
            <AccountCircle className="icone"/> Endereço de e-mail<br/>
            <input
              className="login"
              id="email"
              type="email"
              value={email}
              placeholder="E-mail"
              onChange={event => setEmail(event.target.value)}
            /> 
          </FormLabel>
          
          <FormLabel>
            <Lock className="icone"/> Senha<br/>
            <input
              className="login"
              id="password"
              type="password"
              placeholder="Senha"
              autoComplete="current-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
            /><br/>
            <button
              className="btnRLogin"
              type="button"
              onClick={clickEsqueceuSenha}
              >Esqueci minha senha</button>
          </FormLabel>
          
          {/* 
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check 
              type="checkbox" 
              label="Lembrar dados de acesso" 
              id="rememberMe"
              name="rememberMe"
              value={rememberMe}
              style={{color: '#225378'}}
              onChange={event => setRememberMe(event.target.value)}
            />
          </Form.Group> 
          */}

          <Botao>
            <button className="btn1" type="submit">ENTRAR</button>
          </Botao>

        </Form>
      </Loginsc>
      <Rodape>
        <RLeft>
          <RTitulo>CONTATO</RTitulo>
          <RTexto>
            contato@arenatransautos.com.br<br/>
            +55 (41)  3284-5252<br/>
            +55 (41) 99165-5253
          </RTexto>
        </RLeft>
        <RCenter>
          <RTitulo>SOBRE</RTitulo>
          <RTexto>
            Quem Somos<br/>
            Portal Transporte de Veículos<br/>
            Política de Privacidade<br/>
            Termos de Uso
          </RTexto>
        </RCenter>
        <RRight>
          <RTitulo>INFORMAÇÕES</RTitulo>
          <RTexto>
            Software para gestão de transporte de veículos,
            para transportistas e transportadoras
          </RTexto>
        </RRight>
      </Rodape>
    </Container>
  )
}

export default Login
