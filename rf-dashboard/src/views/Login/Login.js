/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Container, Form, Image } from 'react-bootstrap'

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
        const { token } = res.data

        localStorage.setItem('@rf/email', email)
        localStorage.setItem('@rf/token', token)
        // localStorage.setItem('@rf/rememberMe', rememberMe)
        buscaUsuario(email)

        history.push('/rf/home')
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

  const buscaUsuario = async (email) => {
    await api
      .post('/buscausuarios', { 
        email: email,
        tipo: "", 
    	  status: "",
	      estado: "",
      },{
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      .then(response => {
        const { data } = response
        localStorage.setItem('@rf/userID', data[0].id)
        atualizaStatus(data[0].id)
      }).catch((error) => {
        if (error.response) {
        } else if (error.request) {
        } else {
        }
      })
  }

  const atualizaStatus = async (userID) => {
    await api
      .put(`/usuarios/${userID}`, { 
        status: "A",
      },{
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      .then(response => {
        const { data } = response

        if (response.status === 200) {
          toast(`Usuário ${data.nome} Online!`, { type: 'success' })
        } else if (response.status === 400) {
          response.data.map(mensagem => {
            toast(mensagem.message, { type: 'error' })
          })
        } else {
          response.data.map(mensagem => {
            toast(mensagem.message, { type: 'error' })
          })
        }
      })
      .catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('*** data', data)
          }
        } else if (error.request) {
          console.error('*** l-1.2', error)
          toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
          toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }
  
  return (
    <Container style={{height: '100%', margin: '0px', width: '100%', padding: '0px'}}>
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
