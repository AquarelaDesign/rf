import React, { Component } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Container, 
  Row, 
  Col,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap'

import AccountCircle from "@material-ui/icons/AccountCircle"
import Lock from "@material-ui/icons/Lock"

import api from '../../services/rf'
import logo from '../../assets/logo.png'
import './styles.css'

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
        email: '',
        password: '',
        texto: '',
        show: false,
        rememberMe: false
    }
  }

  componentDidMount() {
    const email = localStorage.getItem('@rf/email')
    const remember = localStorage.getItem('@rf/rememberMe')

    if (remember === 'true') {
      this.setState({ email: email, rememberMe: true })
    } else {
      this.setState({ rememberMe: false })
    }
  }

  clickEsqueceuSenha() {
    console.log('clickEsqueceuSenha')
  }

  criaUsuario() {
    console.log('criaUsuario')
  }

  setShow() {
    try {
      this.setState({ texto: "" })
      this.setState({ show: false })
    } catch (error) {
      console.log(error)
    }
  }

  async onChange(event) {
    const input = event.target
    const value = input.type === 'checkbox' ? input.checked : input.value

    // console.log('onChange', input.type, input.checked, value, input)

    this.setState({ [input.id]: value })
  }

  async handleSubmit(event) {
    event.preventDefault();

    try {
      await api.post('/authenticate', {
        email: this.state.email,
        password: this.state.password
      })
      .then(res => {
        console.log('res', res)
        const { token } = res.data

        localStorage.setItem('@rf/email', this.state.email)
        localStorage.setItem('@rf/token', token)
        localStorage.setItem('@rf/rememberMe', this.state.rememberMe)

        this.props.history.push('/home')
      })

    } catch (error) {
        const { response } = error
      if (response !== undefined) {
        toast(response.status !== 401 ? response.data[0].message : 'Senha inválida!', {type: 'error'})
      } else {
        this.setState({
          texto: error,
          show: true
        })
        toast(error, {type: 'error'})
      }
    }
  }

  render() {
    const { email, rememberMe } = this.state

    // console.log(rememberMe)

    return (
      <div className="App flex-row">
        <Container>
          <Row></Row>
          <Row>
            <Col xs="8"></Col>
            <Col xs="3">
              <div className="login">
                <img id="logo" src={logo} alt="" style={{marginTop: 20, height: 150}} />
                <Form onSubmit={e => {this.handleSubmit(e)}}>
                  
                  <label className="form-title">Login</label>

                  <div className="row">
                    <div className="col-md-2">
                      <AccountCircle style={{ color: '#225378', fontSize: 30, marginTop: 25 }}/>
                    </div>
                    <div className="col-md-10">
                      <label className="form-label">Endereço de e-mail</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-10">
                      <Input
                        className="login"
                        id="email"
                        type="email"
                        value={email}
                        placeholder="E-mail"
                        onChange={e => {this.onChange(e)}}
                      /> 
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-2">
                      <Lock style={{ color: '#225378', fontSize: 30, marginTop: 25 }}/>
                    </div>
                    <div className="col-md-10">
                      <label className="form-label">Senha</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-10">
                      <Input
                        className="login"
                        id="password"
                        type="password"
                        placeholder="Senha"
                        autoComplete="current-password"
                        onChange={e => {this.onChange(e)}}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-10" style={{margin: 0}}>
                      <button
                        className="btnRLogin"
                        type="button"
                        onClick={this.clickEsqueceuSenha}
                        >Esqueci minha senha</button>
                    </div>
                  </div>

                  <FormGroup check className="checkbox">
                    <Input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      value={rememberMe}
                      onChange={e => {this.onChange(e)}}
                    />
                    <Label
                      check
                      className="form-check-label"
                      htmlFor="rememberMe">
                      Lembrar dados de acesso
                    </Label>
                  </FormGroup>

                  <div className="botao">
                    <button className="btn1" type="submit">ENTRAR</button>
                  </div>
                  {/*
                  <div className="loginRodape">
                    <button
                      className="btnRLogin"
                      type="button"
                      onClick={this.clickEsqueceuSenha}
                    ><i className="fa fa-envelope-o"> Esqueceu a Senha?</i></button>
                    <button
                      className="btnRLogin"
                      type="button"
                      icon="fa-key"
                      onClick={this.criaUsuario}
                    ><i className="fa fa-key"> Criar Conta</i></button>
                  </div>
                  */}
                </Form>
              </div>
            </Col>
            <Col xs="1"></Col>
          </Row>
          <Row></Row>
        </Container>
      </div>
    )
  }
}

export default Login
