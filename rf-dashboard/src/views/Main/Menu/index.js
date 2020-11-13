/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import clsx from 'clsx'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import api from '../../../services/rf'

import { Container, BotaoExit, RLeft, RRight, Input, Label, Titulo } from './styles'
import { FaIcon } from '../../../components/Icone'

import GridPlaca from '../GridPlaca'
import useModal from '../GridPlaca/useModal'

import GridOriDest from '../GridOriDest'
import useModalOD from '../GridOriDest/useModal'

import TabelaDeRotas from '../../Parametros/TabelaDeRotas'
import useModalTabelaDeRotas from '../../Parametros/TabelaDeRotas/useModal'

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: theme.spacing(0.5),
    height: '24px',
    // border: 'none',
    border: 0,
    borderRadius: '3px',
    width: '120px',
    fontSize: '14px',
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:hover': {
      background: '#225378',
      color: '#FFFFFF',
    }
  
  },
}))(ToggleButtonGroup)

const useStyles = makeStyles({
  list: {
    width: 380,
    height: '100%',
    padding: 20,
    background: '#75b9f0',
  },
})

export default function Menu({backMenu, backFilter}) {
  const history = useHistory()
  const classes = useStyles()

  const [menu, setMenu] = useState('LOG')
  const [state, setState] = useState({
    right: false,
  })

  const [pedido, setPedido] = useState('')
  const [placa, setPlaca] = useState('')
  const [origemCidade, setOrigemCidade] = useState('')
  const [origemUF, setOrigemUF] = useState('')
  const [destinoCidade, setDestinoCidade] = useState('')
  const [destinoUF, setDestinoUF] = useState('')
  const [motoristaCPF, setMotoristaCPF] = useState('')
  const [motoristaNome, setMotoristaNome] = useState('')
  const [filtro, setFiltro] = useState(false)
  
  const [veiculos, setVeiculos] = useState([])
  const [rotas, setRotas] = useState([])
  const [tipo, setTipo] = useState([])

  const { isShowPlaca, togglePlaca } = useModal()
  const { isShowOriDest, toggleOriDest } = useModalOD()
  const { isShowTabelaDeRotas, toggleTabelaDeRotas } = useModalTabelaDeRotas()

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    window.onbeforeunload = (e) => confirmExit(e)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const atualizaStatus = async (userID) => {
    await api
      .put(`/usuarios/${userID}`, { 
        status: "I",
      },{
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      .then(response => {
        const { data } = response

        if (response.status === 200) {
          toast(`Usuário ${data.nome} Offline!`, { 
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
            console.log('**** Menu.atualizaStatus.error.data', data)
          }
        } else if (error.request) {
          console.log('**** Menu.atualizaStatus.error', error)
          // toast(`Ocorreu um erro no processamento! ${error}`, { type: 'error' })
        } else {
        // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
        }
      })
  }

  const handleExit = async (e) => {
    await confirmExit(e)
  }

  const confirmExit = async (e) => {
    const userID = await localStorage.getItem('@rf/userID')
    atualizaStatus(userID)

    await sleep(1000) 
    if (e) {  
      delete e['returnValue']
    }

    localStorage.removeItem('@rf/token')
    localStorage.removeItem('@rf/userID')
    history.push('/rf')
  }

  const mudaPainel = async (e, opcao) => {
    switch (opcao) {
      case 'PAR': {
        toggleTabelaDeRotas()
        return
      }
    }

    setMenu(opcao)
    backMenu(opcao)
  }

  const mudaFiltro = async (e, stFiltro) => {
    if (
      pedido !== "" && placa !== "" &&
      origemCidade !== "" && origemUF !== "" &&
      destinoCidade !== "" && destinoUF !== "" &&
      motoristaCPF !== "" && motoristaNome !== ""
    ) {
      setFiltro(false)
    } else {
      setFiltro(true)
    }

    // console.log('**** Filter.mudaFiltro.stFiltro', stFiltro)
    if (stFiltro === false) {
      setPedido('')
      setPlaca('')
      setOrigemCidade('')
      setOrigemUF('')
      setDestinoCidade('')
      setDestinoUF('')
      setMotoristaCPF('')
      setMotoristaNome('')

      backFilter({
        pedido: '',
        placa: '',
        origemCidade: '',
        origemUF: '',
        destinoCidade: '',
        destinoUF: '',
        motoristaCPF: '',
        motoristaNome: '',
      })
  
    } else {
      if (placa !== "") {
        setState({ ...state, right: false })
        filtroPlaca(placa)
        return
      }

      if (origemCidade !== "" || origemUF !== "") {
        setState({ ...state, right: false })
        filtroRotas('O', origemCidade, origemUF)
        return
      }

      if (destinoCidade !== "" || destinoUF !== "") {
        setState({ ...state, right: false })
        filtroRotas('D', destinoCidade, destinoUF)
        return
      }

      backFilter({
        pedido,
        placa,
        origemCidade,
        origemUF,
        destinoCidade,
        destinoUF,
        motoristaCPF,
        motoristaNome,
      })
    }
  }

  const filtroPlaca = async (placa) => {
    if (placa !== undefined && placa !== "") {
      await api
      .post('/buscaveiculos', {
        placachassi: placa,
      })
      .then(response => {
        const { data } = response
        console.log('**** Menu.filtroPlaca.data', data)
        setVeiculos(data)
        togglePlaca()
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
            console.log('**** Menu.filtroPlaca.error.data', data)
          }
        } else if (error.request) {
          console.log('**** Menu.filtroPlaca.error', error)
        } else {
        }
      })
    }
  }

  const filtroRotas = async (tipo, cidade, uf) => {
    await api
    .post('/buscarotas', {
      cidade: cidade,
      uf: uf,
    })
    .then(response => {
      const { data } = response
      
      let rotasO = []
      let rotasD = []
      data.forEach(r => {
        if (r.rota_relacionada % 2 === 0) {
          rotasO.push(r)
        } else {
          rotasD.push(r)
        }
      })

      if (tipo === 'O') {
        setTipo('Origem')
        setRotas(rotasO)
      } else {
        setTipo('Destino')
        setRotas(rotasD)
      }
      
      toggleOriDest()
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
          console.log('**** Menu.filtroPlaca.error.data', data)
        }
      } else if (error.request) {
        console.log('**** Menu.filtroPlaca.error', error)
      } else {
      }
    })
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setState({ ...state, [anchor]: open })
  }

  const list = (anchor) => (
    <div
      className={classes.list}
      role="presentation"
      // onClick={toggleDrawer('right', false)}
      // onKeyDown={toggleDrawer('right', false)}
    >
      <Titulo>Filtros</Titulo>

      <Divider variant="middle" />

      <Label>Pedido</Label>
      <Input
        id="pedido"
        type="input"
        value={pedido}
        placeholder="Nº do Pedido"
        onChange={event => setPedido(event.target.value)}
        width={100}
      /> 
      
      <Label>Placa</Label> 
      <Input
        id="placa"
        type="input"
        value={placa}
        placeholder="Placa"
        onChange={event => setPlaca(event.target.value)}
        width={100}
      /> 
      
      <Label>Origem</Label>
      <Input
        id="origemCidade"
        type="input"
        value={origemCidade}
        placeholder="Cidade"
        onChange={event => setOrigemCidade(event.target.value)}
        width={250}
      /> 
      <Input
        id="origemUF"
        type="input"
        value={origemUF}
        placeholder="UF"
        onChange={event => setOrigemUF(event.target.value)}
        width={50}
      /> 
      
      <Label>Destino</Label> 
      <Input
        id="destinoCidade"
        type="input"
        value={destinoCidade}
        placeholder="Cidade"
        onChange={event => setDestinoCidade(event.target.value)}
        width={250}
      /> 
      <Input
        id="destinoUF"
        type="input"
        value={destinoUF}
        placeholder="UF"
        onChange={event => setDestinoUF(event.target.value)}
        width={50}
      /> 
      
      <Label>Motorista</Label> 
      <Input
        id="motoristaCPF"
        type="input"
        value={motoristaCPF}
        placeholder="CPF/CNPJ"
        onChange={event => setMotoristaCPF(event.target.value)}
        width={100}
      /> 
      <Input
        id="motoristaNome"
        type="input"
        value={motoristaNome}
        placeholder="Nome"
        onChange={event => setMotoristaNome(event.target.value)}
        width={200}
      /> 

      <StyledToggleButtonGroup
        value={filtro}
        exclusive
        onChange={mudaFiltro}
        aria-label="menu"
      >
        <ToggleButton value={true}>
          <FaIcon icon='btFiltro' size={22} />
        </ToggleButton>

        <ToggleButton value={false}>
          <FaIcon icon='btLimpaFiltro' size={22} />
        </ToggleButton>
      </StyledToggleButtonGroup>

    </div>
  )

  return (
    <Container>
      <RLeft>
        <StyledToggleButtonGroup
          value={menu}
          exclusive
          onChange={mudaPainel}
          aria-label="menu"
        >
          <ToggleButton value="LOG">LOGÍSTICA</ToggleButton>
          <ToggleButton value="FIS">FISCAL</ToggleButton>
          <ToggleButton value="FIN">FINANCEIRO</ToggleButton>
          <ToggleButton value="HIS">HISTÓRICO</ToggleButton>
          <ToggleButton value="PAR">PARÂMETROS</ToggleButton>
        </StyledToggleButtonGroup>
      </RLeft>
      <RRight>
        <BotaoExit onClick={handleExit}>
          <FaIcon icon='GiExitDoor' size={16} />
          SAIR
        </BotaoExit>
        <BotaoExit onClick={toggleDrawer('right', true)}>
          <FaIcon icon='btFiltro' size={16} />
          Filtrar
        </BotaoExit>
      </RRight>
      <div>
        <React.Fragment key={'right'}>
          <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
            {list('right')}
          </Drawer>
        </React.Fragment>
      </div>
      <GridPlaca
        isShowPlaca={isShowPlaca}
        hide={togglePlaca}
        placa={placa}
        veiculos={veiculos}
      />
      <GridOriDest
        isShowRota={isShowOriDest}
        hide={toggleOriDest}
        rotas={rotas}
        tipo={tipo}
      />
      <TabelaDeRotas
        isShowTabelaDeRotas={isShowTabelaDeRotas}
        hide={toggleTabelaDeRotas}
      />
    </Container>
  )
}
