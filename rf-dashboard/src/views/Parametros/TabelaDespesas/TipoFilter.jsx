import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import api from '../../../services/rf'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default class TipoFilter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: '',
      tipos: [],
    }

    this.valueGetter = this.props.valueGetter

    this.onChange = this.onChange.bind(this)

  }

  componentDidMount() {
    this.carregaTipos()
  }

  carregaTipos = async () => {
    await api
    .get('/tiposdeveiculos')
    .then(response => {
      const { data } = response
      
      this.setState({
        tipos: data,
      })      
    }).catch((error) => {
      if (error.response) {
        const { data } = error.response
        try {
          data.map(mensagem => {
            toast(mensagem.message, { type: 'error' })
          })
        }
        catch (e) {
          console.log('**** TipoFilter.carregaTipos.error.data', data)
        }
      } else if (error.request) {
        console.log('**** TipoFilter.carregaTipos.error', error)
      } else {
      }
    })

  }

  isFilterActive() {
    return this.state.text != null && this.state.text !== ''
  }

  doesFilterPass(params) {
    try {
      let ret = this.state.text
        .toLowerCase()
        // .split(' ')
        .every(
          filterWord =>
            this.valueGetter(params.node)
              .toString()
              .toLowerCase()
              .indexOf(filterWord) >= 0
        )

        // console.log('**** TipoFilter.doesFilterPass.ret', ret)
        
        return ret
    }
    catch (e) {
    }
  }

  getModel() {
    return { value: this.state.text }
  }

  setModel(model) {
    // this.state.text = model ? model.value : '';
    this.setState({
      text: model ? model.value : '',
    })
  }

  afterGuiAttached(params) {
    this.focus()
  }

  focus() {
    window.setTimeout(() => {
      const container = ReactDOM.findDOMNode(this.refs.input);

      if (container) {
        container.focus()
      }
    })
  }

  componentMethod(message) {
    alert(`Alerta de StatusFilterComponent: ${message}`)
  }

  onChange(event) {
    const newValue = event.target.value

    console.log('**** TipoFilter.onChange.newValue', newValue, this.state.text)

    if (this.state.text !== newValue) {
      this.setState(
        {
          text: newValue
        },
        () => {
          this.props.filterChangedCallback()
        }
      )
    }
  }

  render() {
    const style = {
      // border: '1px solid #0031FF',
      borderRadius: '5px',
      backgroundColor: '#FFFFFF',
      width: '160px',
      height: '50px',
      fontWeight: 'bold',
      textShadow: '#B5B5B5 2px 3px 3px',
    };

    return (
      <div style={style}>
        <FormControl style={{ margin: '1px', height: '30px', width: '150px' }}>
          <Select
            labelId="status-label"
            id="status"
            value={this.state.text}
            onChange={this.onChange}
          >
            {
              this.state.tipos.map(tp => {
                return (
                  <MenuItem key={tp.id} value={tp.id}>
                    {tp.nome}
                  </MenuItem>
                )
              })
            }
            <MenuItem key={99} value=''>
              TODOS
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    )
  }
}