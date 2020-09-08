import React, { useEffect, useState, useRef } from 'react'
import { useField } from '@unform/core'
import PropTypes from 'prop-types'
import styled from "styled-components";
import ReactInputMask from 'react-input-mask'
import { AiOutlineSearch } from 'react-icons/ai'

import ErrorBoundary from '../ErrorBoundary'

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2px 0;
  position: relative;
  margin-top: 5px;
  color: #000;
  font-family: "Montserrat", sans-serif;
  /* border: 1px solid #0031FF; */

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
    /* background-color: #f8f8ff; */
    color: #b4b4b4;
  }

  & > input:hover {
    border: 1px solid #0031FF;
    background-color: #FFFFFF;
    /* z-index: 499; */
  }

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

const Buttom = styled.div`
  position: absolute;
  top: 1px;
  right: 1px;
  z-index: 502;
  outline:none;

  & > button {
    background-color: #DCDCDC;
    height: 28px;
    width: 28px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    border: none;
    outline:none;
    transition-duration: 0.4s;
  }
  
  & > button:hover {
    background-color: #CCC;
    border: none;
    outline:none;
  }

  & > button:active {
    background-color: #DDD;
    border: none;
    outline:none;
  }
`

export default function Input({ 
  name,
  label,
  type,
  onBlur,
  onFocus,
  icon,
  value,
  callSearch,
  disabled,
  tipo,
  ...rest 
}) {
  const inputRef = useRef(null)
  const { fieldName, registerField, defaultValue, error } = useField(name)
  const [focused, setFocused] = useState(false)
  const [sMask, setSMask] = useState(null)
  const [isFocused, setIsFocused] = useState(null)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      setValue(ref, value) {
        ref.setInputValue(value)
        // ref.setValue(value)
      },
      // clearValue(ref) {
      //   ref.setInputValue('')
      // },
    })

    checkFocused()

  }, [fieldName, registerField])

  useEffect(() => {
    let valor = value

    if (valor) {
      inputRef.current.setInputValue(valor)
    }

    if (rest.value && String(rest.value).length) {
      valor = rest.value
    }

    if (inputRef.current && String(inputRef.current.value).length) {
      valor = inputRef.current.value
    }

    if (!valor) {
      valor = ''
    }

    let clearValor = undefined
  
    switch (name.toLowerCase()) {
      case 'cpf':
      case 'cnpj':
      case 'cpfcnpj':
        clearValor = clearNumber(valor)
        setSMask('999.999.999-99')
        if (clearValor.length > 11) {
          setSMask('99.999.999/9999-99')
        }
        break
      case 'celular':
      case 'whats':
      case 'telefone':
        clearValor = clearNumber(valor)
        setSMask('(99) 9999-9999')
        if (clearValor.length > 10) {
          setSMask('(99) 99999-9999')
        }
        break
      case 'cep':
        setSMask('99999-999')
        break
      default:
        setSMask(/[a-zA-Z0-9,.@\/_s-]/) // [!#$%^&*()?":{}|<>]
    }

    checkFocused()

  }, [name, value, rest.value, inputRef])

  const handleOnFocus = () => {
    setFocused(true)
    return onFocus
  }

  const handleOnBlur = () => {
    setFocused(false)
    return onBlur
  }

  function clearNumber(value = '') {
    return value.replace(/\D+/g, '')
  }
  
  // console.log('**** value', name, rest.value, inputRef.current, defaultValue)

  const checkFocused = () => { 
    if (type === "date") {
      setIsFocused(true)
      return
    } else if (focused) { 
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
    
    if (inputRef.current) {
      if (String(inputRef.current.value).length) {
        setIsFocused(true)
        return
      }

      if (inputRef.current.props.value !== undefined) {
        if (String(inputRef.current.props.value).length) {
          setIsFocused(true)
          return
        }
      }
    }

    setIsFocused(false)
  }
  
  const renderLabel = () => label && <label>{label}</label>
  
  const renderIcon = () => icon && <Buttom>
    <button type="button" onClick={callSearch}><AiOutlineSearch /></button>
  </Buttom>

  if (value === null) {
    value = undefined
  }

  return (
    <InputContainer focused={isFocused}>
      {renderLabel()}
      {renderIcon()}
      <ErrorBoundary>
        <ReactInputMask 
          ref={inputRef} 
          type={type}
          value={value}
          placeholder={isFocused ? undefined : label}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          disabled={disabled}
          defaultValue={defaultValue}
          onChange={e => inputRef.current.setInputValue(e.target.value)}
          mask={sMask}
          {...rest} 
        />
      </ErrorBoundary>
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
    </InputContainer>
  )
}

Input.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  tipo: PropTypes.string,
  inputRef: PropTypes.func,
  callSearch: PropTypes.func,
  icon: PropTypes.bool,
  disabled: PropTypes.bool,
}
