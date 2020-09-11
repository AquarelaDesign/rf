import React, { useEffect, useState, useRef } from 'react'
import { useField } from "@unform/core"

import styled from "styled-components"

import ReactSelect, { components } from "react-select"

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2px 0;
  position: relative;
  margin-top: 5px;
  color: #000;
  font-family: "Montserrat", sans-serif;
  /* border: 1px solid #0031FF; */

  /*
  & > input {
    border: 1px solid #2699F8;
    border-radius: 5px;
    background-color: #FFFFFF;
    outline: none;
    padding: 1px 0px 1px 10px;
    font-size: 14px;
    transition: all 0.2s ease;
    z-index: 499;
    height: 30px;
    margin-bottom: 1px;
  }

  & > input:disabled {
    color: #b4b4b4;
  }

  & > input:hover {
    border: 1px solid #0031FF;
    background-color: #FFFFFF;
  }
  */
  
  & > label {
    color: transparent;
    position: absolute;
    top: 15px;
    left: 10px;
    transition: all 0.2s ease;
    z-index: 500;
    border: none;

    ${props =>
      props.focused && `
        font-size: 13px;
        transform: translateY(-23px) translateX(-5px);
        z-index: 501;
        color: #000000;
        background: #FFFFFF;
        padding: 0px 5px 0px 5px;
        text-shadow: 0 0 15px #c8c8ca;
      `}
  }
`

const ph = (color = '#ccc') => ({
  alignItems: 'center',
  display: 'flex',
  fontSize: '12px',
  fontWeight: 'none',

  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 10,
    width: 10,
  },
})

const Placeholder = props => {
  return <components.Placeholder {...props} />
}

const IndicatorsContainer = props => {
  return (
    <div style={{ height: '20px' }}>
      <components.IndicatorsContainer {...props} />
    </div>
  )
}

const Input = props => {
  if (props.isHidden) {
    return <components.Input {...props} />;
  }
  return (
    <div style={{ 
      fontSize: '14px',
      transition: 'all 0.2s ease',
      zIndex: 499,
      height: '20px',
      padding: '0px',
    }}>
      <components.Input {...props} />
    </div>
  )
}

const customStyles = {
  // option: (provided, state) => ({
  //   ...provided,
  //   borderBottom: '2px dotted green',
  //   color: state.isSelected ? 'yellow' : 'black',
  //   backgroundColor: state.isSelected ? 'green' : 'white'
  // }),
  control: (provided, styles) => ({
    ...provided,
    border: '1px solid #2699F8',
    borderRadius: '5px',
    backgroundColor: '#FFFFFF',
    outline: 'none',
    padding: '1px 0px 1px 10px',
    height: '30px',
    ':hover': {
      ...styles[':hover'],
      border: '1px solid #0031FF',
      backgroundColor: '#FFFFFF',
    },
  }),
  menu: provided => ({ ...provided, zIndex: 9999 }),
  // input: styles => ({ 
  //   fontSize: '12px',
  //   transition: 'all 0.2s ease',
  //   zIndex: 499,
  //   height: '20px',
  //   marginBottom: '1px',
  //   ...styles, 
  // }),
  placeholder: base => ({
    ...base,
    fontSize: '14px',
    color: '#DDD',
    fontWeight: 'none',
  }),
}

const Select = ({ 
  name, 
  label,
  onBlur,
  onFocus,
  value,
  defaultVal,
  disabled,
  options, 
  ...rest 
}) => {
  const selectRef = useRef(null)
  const { fieldName, registerField, defaultValue, error } = useField(name)

  const [focused, setFocused] = useState(false)
  const [isFocused, setIsFocused] = useState(null)
  const [selectedOption , setSelectedOption ] = useState(null)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      // path: "state.value",
      getValue: (ref) => ref.state.value,
      setValue: (ref, value) => {
        ref.select.setValue(value || null)
      },
      // getValue: ref => {
      //   if (rest.isMulti) {
      //     if (!ref.state.value) {
      //       return []
      //     }
      //     return ref.state.value.map(option => option.value)
      //   } else {
      //     if (!ref.state.value) {
      //       return ""
      //     }
      //     return ref.state.value.value
      //   }
      // }
    })

    checkFocused()

  }, [fieldName, registerField, rest.isMulti])

  /*
  useEffect(() => {
    let valor = value

    if (valor) {
      selectRef.current.setInputValue(valor)
    }

    if (rest.value && String(rest.value).length) {
      valor = rest.value
    }

    if (selectRef.current && String(selectRef.current.value).length) {
      valor = selectRef.current.value
    }

    if (selectRef.current.props.defaultValue) {
      valor = selectRef.current.props.defaultValue
    }

    if (!valor) {
      valor = ''
    }
 
    // selectRef.current.setInputValue(valor)
    console.log('**** valor', name, valor)
    
    checkFocused()

  }, [name, value, rest.value, selectRef])
  */
  
  const handleOnFocus = () => {
    setFocused(true)
    return onFocus
  }

  const handleOnBlur = () => {
    setFocused(false)
    return onBlur
  }

  const handleChange = selectedOption => {
    selectRef.current.setState({ selectedOption })
    setSelectedOption(selectedOption)
    // console.log('**** Option selected:', selectedOption)
  }

  console.log('**** value', name, value, defaultValue, defaultVal, selectRef.current)

  const checkFocused = () => { 
    if (focused) { 
      setIsFocused(true)
      return
    } else if (defaultValue) {
      setIsFocused(true)
      return
    } 
    
    if (rest.value) {
      if (String(rest.value).length) {
        setIsFocused(true)
        return
      }
    } 
    
    if (selectRef.current) {
      if (String(selectRef.current.value).length) {
        setIsFocused(true)
        return
      }

      if (selectRef.current.props.value !== undefined) {
        if (String(selectRef.current.props.value).length) {
          setIsFocused(true)
          return
        }
      }
    }

    setIsFocused(false)
  }
  
  const renderLabel = () => label && <label>{label}</label>

  return (
    <SelectContainer focused={isFocused}>
      {renderLabel()}
      <ReactSelect
        ref={selectRef}
        components={{ Placeholder, Input }}
        placeholder={label}
        // placeholder={isFocused ? undefined : label}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onChange={handleChange}
        disabled={disabled}
        // value={value}
        defaultValue={
          defaultValue && options.find(option => option.value === defaultValue)
        }
        classNamePrefix="react-select"
        options={options}
        styles={customStyles}
        {...rest}
      />
      { 
        error && <span style={{ 
          color: '#E6474D',
          fontSize: '10px',
          fontWeight: 'normal',
          marginTop: '2px',
          marginBottom: '0px',
          paddingBottom: '0px',
        }}>{error}</span> 
      }
    </SelectContainer>
  )
}

export default Select
