import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'

export default forwardRef((props, ref) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (props.value !== undefined && props.value !== null) {
      setValue(props.value === 1 ? true : false)
    }
  },[value, props])

  const checkedHandler = (e) => {
    let checked = e.target.checked
    let colId = props.column.colId
    props.node.setDataValue(colId, checked)
    // console.log('**** CheckBoxRender.checkedHandler', e.target.checked, props)
    setValue(e.target.checked)
  }

  useImperativeHandle(ref, () => {
    return {
      getValue: () => {
        // console.log('**** CheckBoxRender.useImperativeHandle.value', value, props, ref)
        // let retVal = value === 0 ? false : true
        // return retVal
        setValue(value)
        return value
      },
      afterGuiAttached: () => {
        // console.log('**** CheckBoxRender.useImperativeHandle.props.value', props.value, props, ref)
        setValue(props.value)
      }
    }
  })

  return (
    <>
    {/* { console.log('**** CheckBoxRender.return.value', value, props) } */}
    <input 
      type="checkbox" 
      onClick={checkedHandler}
      checked={value}
    />
    </>
  )
})
