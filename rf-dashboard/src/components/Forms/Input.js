import React, { useEffect, useState, useRef } from 'react'
import { useField } from '@unform/core'
import PropTypes from 'prop-types'
import styled from "styled-components";

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
    border: 1px solid #ececed;
    border-radius: 5px;
    background-color: #dadadb;
    outline: none;
    padding: 1px 0px 1px 10px;
    font-size: 14px;
    transition: all 0.2s ease;
    z-index: 499;
    height: 30px;
    margin-bottom: 1px;
  }

  & > input:hover {
    /* border: 1px solid #0031FF; */
    background-color: #ececed;
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
        // background: transparent;
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
  callButton,
  ...rest 
}) {
  const inputRef = useRef(null)
  const { fieldName, registerField, defaultValue, error } = useField(name)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      clearValue(ref) {
        ref.value = ''
        // ref.clear()
      },
      setValue(ref, value) {
        ref.setNativeProps({ text: value })
        inputRef.current.value = value
      },
      getValue(ref) {
        return ref.value
      },
    })
  }, [fieldName, registerField])

  const handleOnFocus = () => {
    setFocused(true)
    return onFocus
  }

  const handleOnBlur = () => {
    setFocused(false)
    return onBlur
  }

  const isFocused = focused || 
    rest.value ? String(rest.value).length ? true : false : false || 
    inputRef.current ? String(inputRef.current.value).length ? true : false : false || 
    defaultValue ? true : false || 
    type === "date"
  
  const renderLabel = () => label && <label>{label}</label>
  
  const renderIcon = () => icon && <Buttom>
    <button type="button" onClick={callButton}>{icon}</button>
  </Buttom>

  if (value === null) {
    value = undefined
  }
  // console.log('**** rest.value', rest.value)

  return (
    <InputContainer focused={isFocused}>
      {renderLabel()}
      {renderIcon()}
      <input 
        ref={inputRef} 
        type={type}
        value={value}
        placeholder={isFocused ? undefined : label}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
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
    </InputContainer>
  )
}

Input.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  inputRef: PropTypes.func,
  callButton: PropTypes.func,
  icon: PropTypes.element,
}