import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  Container,
  BoxTitulo,
  Texto,
  Botao,
  RLeft,
  RRight,
  Blank,
} from '../../Cadastro/CardUsuario/styles'

import { TextField } from 'final-form-material-ui'

import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
// import { makeStyles } from '@material-ui/core/styles'

import { 
  Tooltip, 
  withStyles, 
  MenuItem,
  InputAdornment,
} from '@material-ui/core'

import { FaIcon } from '../../../components/Icone'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { Form, Field } from 'react-final-form'

import "./modal.css"
import api from '../../../services/rf'
// import Axios from 'axios'
// import { values } from 'lodash'

import { Autocomplete, TextField as MuiTextField } from 'mui-rff'


import dadosUF from '../../../services/json/uf.json'
import dadosCidadesJSON from '../../../services/json/cidade.json'

const numberMask = createNumberMask({
  prefix: '',
  suffix: '',
  thousandsSeparatorSymbol: '.',
  decimalSymbol: ',',
  decimalScale: 2,
  fixedDecimalScale: true,
  requireDecimal: true, 
})

const CssTextField = withStyles({
  root: {
    '& > *': {
      fontFamily: ['Montserrat', 'sans Serif'],
      fontSize: 14,
    },
    '& label.Mui-focused': {
      color: '#0031FF',
    }, 
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#2699F8',
      },
      '&:hover fieldset': {
        borderColor: '#0031FF',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#225378',
      },
      '&.Mui-disabled': {
        color: '#666666',
        fontWeight: 500,
      },
    },
    '& .MuiFormHelperText-root': {
      margin: '1px',
      justifyContent: 'left',
      height: '7px',
    },
    '& .MuiFormHelperText-contained': {
      justifyContent: 'left',
    },
  },

})(TextField)

const CssMuiTextField = withStyles({
  root: {
    '& > *': {
      fontFamily: ['Montserrat', 'sans Serif'],
      fontSize: 14,
    },
    '& label.Mui-focused': {
      color: '#0031FF',
    }, 
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#2699F8',
      },
      '&:hover fieldset': {
        borderColor: '#0031FF',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#225378',
      },
      '&.Mui-disabled': {
        color: '#666666',
        fontWeight: 500,
      },
    },
    '& .MuiFormHelperText-root': {
      margin: '1px',
      justifyContent: 'left',
      height: '7px',
    },
    '& .MuiFormHelperText-contained': {
      justifyContent: 'left',
    },
  },

})(MuiTextField)

const AddRotaModal = ({ 
  isShowRota, 
  hide, 
  rotaID, 
  tipoCad, 
  disableEdit, 
  callback,
  origemUF,
  origemCidade,
  destinoUF,
  destinoCidade,
  tipoCadVei
}) => {
  
  const [initialValues, setInitialValues] = useState([])
  const [ufOrigem, setUfOrigem] = useState(null)
  const [ufDestino, setUfDestino] = useState(null)
  const [ufCidadesO, setUfCidadesO] = useState([])
  const [ufCidadesD, setUfCidadesD] = useState([])
  const [tipos, setTipos] = useState([])
  const [dadosCidades, setDadosCidades] = useState([])
  
  let submit

  useEffect(() => {
    limpaCampos()
    carregaTipos()

    let tmpcid = []
    dadosCidadesJSON.forEach(cidade => {
      tmpcid.push({
        codigo_ibge : cidade.codigo_ibge,
        nome : cidade.nome.normalize("NFD").replace(/[^a-zA-Z s]/g, "").toUpperCase(),
        latitude : cidade.latitude,
        longitude : cidade.longitude,
        capital : cidade.capital,
        codigo_uf : cidade.codigo_uf
      })
    })
    setDadosCidades(tmpcid)

    // console.log('**** AddRotaModal.buscaRota')
    const buscaRota = async () => {
      await api
        .get(`/rotas/${rotaID}`)
        .then(response => {
          const { data } = response
          setInitialValues(data)
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
              console.log('**** AddRotaModal.buscaRota.error.data', data)
            }
          } else if (error.request) {
            console.log('**** AddRotaModal.buscaRota.error', error)
          } else {
          }
        })
    }
    // console.log('**** AddRotaModal', rotaID, tipoCad)
    if (rotaID && rotaID > 0 && tipoCad === 'E') {
      buscaRota()
    } else if (tipoCad === 'N') {
      limpaCampos()
    } else if (tipoCad === 'D') {
      if (rotaID && rotaID > 0) {
        buscaRota()
      }
    }

    return () => {
      limpaCampos()
    }

  }, [rotaID, tipoCad, origemCidade, origemUF, destinoCidade, destinoUF, tipoCadVei])

  // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const filterCidadeO = (e, uf) => {
    setUfOrigem(uf)
    window.setFormValue('uf_origem', uf)
    const filteredUf = dadosUF.filter(uff => uff.uf.includes(uf))
    const filteredUfCidades = dadosCidades.filter(cidade => cidade.codigo_uf === filteredUf[0].codigo_uf)
    setUfCidadesO(filteredUfCidades)
  }

  const filterCidadeD = (e, uf) => {
    setUfDestino(uf)
    window.setFormValue('uf_destino', uf)
    const filteredUf = dadosUF.filter(uff => uff.uf.includes(uf))
    const filteredUfCidades = dadosCidades.filter(cidade => cidade.codigo_uf === filteredUf[0].codigo_uf)
    setUfCidadesD(filteredUfCidades)
  }

  const limpaCampos = () => {

    if (origemUF !== undefined && origemUF !== null) {
      filterCidadeO(null, origemUF)
    }

    if (destinoUF !== undefined && destinoUF !== null) {
      filterCidadeD(null, destinoUF)
    }

    var newData = {
      cidade_origem: origemCidade !== undefined && origemCidade !== null ? origemCidade.normalize("NFD").replace(/[^a-zA-Z s]/g, "").toUpperCase() : "",
      uf_origem: origemUF !== undefined && origemUF !== null ? origemUF : "",
      cidade_destino: destinoCidade !== undefined && destinoCidade !== null ? destinoCidade.normalize("NFD").replace(/[^a-zA-Z s]/g, "").toUpperCase() : "",
      uf_destino: destinoUF !== undefined && destinoUF !== null ? destinoUF : "",
      tipo_de_veiculo_id: tipoCadVei !== undefined && tipoCadVei !== null ? tipoCadVei : "",
      valor: 0,
    }
    // console.log('**** AddRotaModal.carregaTipos.limpaCampos.newData', newData)

    setInitialValues(newData)
  }

  const carregaTipos = async () => {
    await api
      .get('/tiposdeveiculos')
      .then(response => {
        const { data } = response
        setTipos(data)
        /*
        let tips = []
        data.forEach(tp => {
          tips.push(tp.nome)
        })

        // console.log('**** AddRotaModal.carregaTipos.tips', tips)
        setTiposCol(tips)
        */
      }).catch((error) => {
        if (error.response) {
          const { data } = error.response
          try {
            data.map(mensagem => {
              toast(mensagem.message, { type: 'error' })
            })
          }
          catch (e) {
            console.log('**** AddRotaModal.carregaTipos.error.data', data)
          }
        } else if (error.request) {
          console.log('**** AddRotaModal.carregaTipos.error', error)
        } else {
        }
      })

  }

  function clearNumber(value = '') {
    return value.replace(/\D+/g, '')
  }
  
  function formatCurrency(props) {
    const { inputRef, value, ...other } = props

    let val = value
    val = val.toString().replace('.', ',')

    return (
      <MaskedInput
        {...other}
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null)
        }}
        value={val}
        mask={numberMask}
        placeholderChar={'\u2000'}
        showMask
        style={{
          textAlign:"right",
        }}
      />
    )
  }

  formatCurrency.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  const fechar = async (e) => {
    // console.log('**** AddRotaModal.fechar', e)
    if (callback) {
      // await sleep(1000)
      callback(typeof e === 'object' ? false : e)
      limpaCampos()
    }
    hide()
  }

  async function onSubmit (values) {
    // console.log('**** AddRotaModal.onSubmit-values-0', values)

    let newValues = {}
    newValues['cidade_origem'] = values['cidade_origem']
    newValues['uf_origem'] = values['uf_origem']
    newValues['cidade_destino'] = values['cidade_destino']
    newValues['uf_destino'] = values['uf_destino']
    newValues['tipo_de_veiculo_id'] = values['tipo_de_veiculo_id']
    
    if (values['valor'] !== null) {
      let val = values['valor'].toString()
      if (val.indexOf(",") !== -1) {
        val = values['valor'].replace('.', '')
        val = val.replace(',', '.')
        newValues['valor'] = parseFloat(val).toFixed(2)
      }
    } else {
      newValues['valor'] = parseFloat(values['valor']).toFixed(2)
    }
    
    // console.log('**** AddRotaModal.onSubmit-values-1', values)
    let apiParams = {}
    if (rotaID !== null && tipoCad === 'E') {
      apiParams = {
        method: 'put',
        url: `/rotastabela/${rotaID}`,
        data: JSON.stringify(newValues),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    } else {
      apiParams = {
        method: 'post',
        url: `/rotastabela`,
        data: JSON.stringify(newValues),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    }
    
    // console.log('**** AddRotaModal.onSubmit-apiParams', apiParams)
    const rota = `${values.cidade_origem}/${values.uf_origem} X ${values.cidade_destino}/${values.uf_destino}`

    await api(apiParams, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    .then(response => {
      const { data } = response
      if (response.status !== 200) {
        toast(`Ocorreu um erro no processamento da rota [${rota}]!`,
          { type: 'error' })
        return
      }
      setInitialValues(data)
      fechar(true)
    }).catch((error) => {
      if (error.response) {
        const { data } = error.response
        try {
          data.map(mensagem => {
            toast(mensagem.message, { type: 'error' })
          })
        }
        catch (e) {
          console.log('**** AddRotaModal.onSubmit.error.data', data)
        }
      } else if (error.request) {
        console.log('**** AddRotaModal.onSubmit.error', error)
      } else {
      // toast(`Ocorreu um erro no processamento!`, { type: 'error' })
      }
    })
    
  }

  const required = value => (value ? undefined : '* Obrigatório!')

  // const checkExclusive = (props) => {
  //   return <Checkbox icon={<exclusive_pb />} checkedIcon={<exclusive />} {...props} />
  // }

  if (isShowRota) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal-addrota">
            <Container>
              <BoxTitulo height={24} bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                <Grid mb={5}>
                  <RLeft>
                    <Texto
                      size={22} height={24} italic={true} bold={700} font='Arial'
                      mt={3}
                      color='#2699FB' shadow={true}>
                      Cadastro de Nova Rota
                    </Texto>
                  </RLeft>
                  <RRight>
                    {/* <Blank><FaIcon icon='blank' size={20} height={20} width={20} /> </Blank> */}
                    { disableEdit ?
                      <Blank><FaIcon icon='blank' size={10} height={10} width={10} /> </Blank>
                    :
                      <Tooltip title="Salvar">
                        <Botao onClick={event=>{submit(event)}}><FaIcon icon='Save' size={20} /></Botao>
                      </Tooltip>
                    }
                    <Tooltip title="Fechar Janela">
                      <Botao onClick={fechar}><FaIcon icon='GiExitDoor' size={20} /></Botao>
                    </Tooltip>
                  </RRight>
                </Grid>
              </BoxTitulo>

              <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={required} 
                height={'300px'} width={'100%'}
                mutators={{
                  _setValue: ([field, value], state, { changeValue }) => {
                    changeValue(state, field, () => value)
                  },
                  get setValue() {
                    return this._setValue
                  },
                  set setValue(value) {
                    this._setValue = value
                  },
                }}
                render={({
                  handleSubmit,
                  form,
                  submitting,
                  pristine,
                  values,
                  props,
                }) => {
                  window.setFormValue = form.mutators.setValue
                  submit = handleSubmit

                  return (
                    <form onSubmit={handleSubmit} noValidate>

                      <BoxTitulo bgcolor='#FFFFFF' border='1px solid #2699F8' mb={10}>
                        <Grid>
                          <Row style={{ height: '54px', marginTop: '15px' }}>
                            <Col xs={4}>
                              <Autocomplete
                                disabled={disableEdit}
                                name="uf_origem"
                                label="UF Origem"
                                fullWidth
                                options={dadosUF}
                                getOptionValue={option => option.uf}
                                getOptionLabel={option => option.uf}
                                onChange={(e, newValue) => filterCidadeO(e, newValue.uf)}
                                renderInput={(params) => 
                                  <CssMuiTextField 
                                    {...params}
                                    name="uf_origem1"
                                    label="UF Origem" 
                                    variant="outlined" 
                                    size="small"
                                    margin="dense"
                                  />
                                }
                              />
                            </Col>
                            <Col xs={8}>
                              <Autocomplete
                                disabled={disableEdit}
                                name="cidade_origem"
                                label="Cidade Origem"
                                fullWidth
                                options={ufCidadesO}
                                getOptionValue={option => option.nome}
                                getOptionLabel={option => option.nome}
                                renderInput={(params) => 
                                  <CssMuiTextField 
                                    {...params}
                                    name="cidade_origem1"
                                    label="Cidade Origem" 
                                    variant="outlined" 
                                    size="small"
                                    margin="dense"
                                  />
                                }
                              />
                            </Col>
                          </Row>

                          <Row style={{ height: '54px', marginTop: '15px' }}> 
                            <Col xs={4}>
                              <Autocomplete
                                disabled={disableEdit}
                                name="uf_destino"
                                label="UF Destino"
                                fullWidth
                                options={dadosUF}
                                getOptionValue={option => option.uf}
                                getOptionLabel={option => option.uf}
                                onChange={(e, newValue) => filterCidadeD(e, newValue.uf)}
                                renderInput={(params) => 
                                  <CssMuiTextField 
                                    {...params}
                                    name="uf_destino1"
                                    label="UF Destino" 
                                    variant="outlined" 
                                    size="small"
                                    margin="dense"
                                  />
                                }
                              />
                            </Col>
                            <Col xs={8}>
                              <Autocomplete
                                disabled={disableEdit}
                                name="cidade_destino"
                                label="Cidade Destino"
                                fullWidth
                                options={ufCidadesD}
                                getOptionValue={option => option.nome}
                                getOptionLabel={option => option.nome}
                                renderInput={(params) => 
                                  <CssMuiTextField 
                                    {...params}
                                    name="cidade_destino1"
                                    label="Cidade Destino" 
                                    variant="outlined" 
                                    size="small"
                                    margin="dense"
                                  />
                                }
                              />
                            </Col>
                          </Row>

                          <Row style={{ height: '54px', marginTop: '15px' }}>
                            <Col xs={8}>
                              <Autocomplete
                                disabled={disableEdit}
                                name="tipo_de_veiculo_id"
                                label="Tipo de Veículo"
                                fullWidth
                                options={tipos}
                                getOptionValue={option => option.id}
                                getOptionLabel={option => option.nome}
                                renderInput={(params) => 
                                  <CssMuiTextField 
                                    {...params}
                                    name="tipo_de_veiculo_id1"
                                    label="Tipo de Veículo" 
                                    variant="outlined" 
                                    size="small"
                                    margin="dense"
                                  />
                                }
                              />
                            </Col>
                            <Col xs={4}>
                              <Field
                                disabled={disableEdit}
                                name="valor"
                                component={CssTextField}
                                type="text"
                                label="Valor"
                                variant="outlined"
                                fullWidth
                                size="small"
                                margin="dense"
                                InputProps={{
                                  inputComponent: formatCurrency,
                                }}
                              />
                            </Col>
                          </Row>
                        </Grid>
                      </BoxTitulo>

                    </form>
                  )
                }}
              />

            </Container>
          </div>
        </div>
      </React.Fragment>
      , document.body)
  }
  return null
}

export default AddRotaModal