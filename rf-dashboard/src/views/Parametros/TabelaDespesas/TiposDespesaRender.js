import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'

const tipos = [
  { id: 'margem', nome: 'MARGEM' },
  { id: 'imposto', nome: 'IMPOSTO' },
  { id: 'valorkm', nome: 'VALOR DO KM' },
]

export default forwardRef((props, ref) => {
  const [value, setValue] = useState('')

  const onChangeHandler = (e) => {
    console.log('**** TiposDespesasRenderer.onChangeHandler', e.target.value, props)
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
              {tip.nome}
            </option>
          )
        })}
      </select>
    </div>
  )
})
