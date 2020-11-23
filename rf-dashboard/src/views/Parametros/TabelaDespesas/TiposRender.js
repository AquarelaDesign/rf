import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'

import api from '../../../services/rf'

export default forwardRef((props, ref) => {
  const [value, setValue] = useState('')
  const [tipos, setTipos] = useState([])

  useEffect(() => {
    carregaTipos()
  }, [])

  const carregaTipos = async () => {
    await api
    .get('/tiposdeveiculos')
    .then(response => {
      const { data } = response
      setTipos(data)
    }).catch((error) => {
      if (error.response) {
        const { data } = error.response
        try {
          data.map(mensagem => {
            console.log('**** TiposRenderer.carregaTipos.mensagem.message', mensagem.message)
          })
        }
        catch (e) {
          console.log('**** TiposRenderer.carregaTipos.error.data', data)
        }
      } else if (error.request) {
        console.log('**** TiposRenderer.carregaTipos.error', error)
      } else {
      }
    })
  }

  const onChangeHandler = (e) => {
    console.log('**** TiposRenderer.onTipoChange', e.target.value, props)
    setValue(e.target.value)
  }

  useImperativeHandle(ref, () => {
    return {
      getValue: () => {
        return value;
      },
      afterGuiAttached: () => {
        setValue(props.value)
      }
    };
  });

  return (
    <div>
      <select value={value} onChange={onChangeHandler}>
        {tipos.map(tip => {
          return (
            <option key={tip.id} value={tip.id}>
              {`${tip.id} - ${tip.nome}`}
            </option>
          )
        })}
      </select>
    </div>
  )
})
