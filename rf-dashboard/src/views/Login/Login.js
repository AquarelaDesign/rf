/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
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
  const [Empresa, setEmpresa] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    if (Empresa === null) {
      buscaEmpresa()
    }
  },[Empresa])
  
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
        localStorage.setItem('@rf/rememberMe', rememberMe)
        buscaUsuario(email)
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
        cpfcnpj: "",
        nome: "",
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

        if (data[0].tipo !== 'O') {
          toast('Sem permissão de acesso ao painel administrativo!', {type: 'error'})
          localStorage.removeItem('@rf/email')
          localStorage.removeItem('@rf/token')
          return
        }

        localStorage.setItem('@rf/email', email)
        localStorage.setItem('@rf/userID', data[0].id)
        atualizaStatus(data[0].id)
        history.push('/rf/home')

      }).catch((error) => {
        if (error.response) {
        } else if (error.request) {
        } else {
        }
      })
  }

  const buscaEmpresa = async () => {
    let rem = await localStorage.getItem('@rf/rememberMe')
    if (typeof rem === 'string') {
      rem = rem === 'true' ? true : false
    }
    // console.log('Login.buscaEmpresa.rem', rem, typeof rem)

    if (rem) {
      setEmail(localStorage.getItem('@rf/email'))
    }

    setRememberMe(rem)

    await api
      .get('/empresas/1',{
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      .then(response => {
        const { data } = response
        // console.log('Login.buscaEmpresa.data', data)
        setEmpresa(data)
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
          toast(`Usuário ${data.nome} Online!`, { 
            type: 'warning', 
            autoClose: 2000, 
            closeOnClick: true,
            pauseOnHover: true,
          })
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
            console.log('**** Login.atualizaStatus.error.data', data)
          }
        } else if (error.request) {
          console.log('**** Login.atualizaStatus.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }
  
  return (
    <Container style={{
      height: '100%', 
      margin: '0px', 
      width: '100%', 
      padding: '0px', 
      alignItems: 'center' 
    }}>
      <Topo/>
      <Loginsc>
        <Image 
          id="logo" 
          src={logo} 
          alt="" 
          style={{marginTop: 20, minHeight: 150, height: '20vh'}} 
        />
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
            />
            <br/>
            <button
              className="btnRLogin"
              type="button"
              onClick={clickEsqueceuSenha}
              >Esqueci minha senha
            </button>
            <br/>
            <div style={{ marginLeft: '30px' }}>
              <label style={{
                color: '#225378', 
                fontSize: '14px'
              }}>
                <input  
                  type="checkbox" 
                  // label="Lembrar dados de acesso" 
                  // id="rememberMe"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={event => {setRememberMe(event.target.checked)}}
                />
                <span style={{marginLeft: '10px'}}>Lembrar dados de acesso</span>
                
              </label>
            </div>

          </FormLabel>

          <Botao>
            <button className="btn1" type="submit">ENTRAR</button>
          </Botao>

        </Form>
      </Loginsc>
      <Rodape>
        <RLeft>
          <RTitulo>CONTATO</RTitulo>
          {Empresa && <RTexto>
            {Empresa.email}<br/>
            {Empresa.telefone}<br/>
            {Empresa.whats}
          </RTexto>}
        </RLeft>
        <RCenter>
          <RTitulo>SOBRE</RTitulo>
          <RTexto>
            Quem Somos<br/>
            Portal {window.location.hostname === "localhost1" ? '' : 'Transporte de Veículos'}<br/>
            Política de Privacidade<br/>
            Termos de Uso
          </RTexto>
        </RCenter>
        <RRight>
          <RTitulo>INFORMAÇÕES</RTitulo>
          {Empresa && <RTexto>
            Software para gestão de transporte de veículos, para transportistas e transportadoras
          </RTexto>}
        </RRight>
      </Rodape>
    </Container>
  )
}

export default Login
