import React, { useEffect, useState, useRef, forwardRef } from 'react'
import { useField } from '@unform/core'
import PropTypes from 'prop-types'
import styled from "styled-components";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
  position: relative;
  margin-top: 10px;
  color: #000;

  & > input {
    border: 1px solid #2699F8;
    border-radius: 0.25rem;
    background-color: #FFF;
    outline: none;
    padding: 8px 2px 8px 11px;
    font-size: 14px;
    transition: all 0.2s ease;
    z-index: 500;
    height: 35px;
  }

  & > input:hover {
    border: 1px solid #0031FF;
  }

  & > label {
    color: #757575;
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
        color: #757575;
        background: #FFF;
        padding: 0px 5px 0px 5px;
      `}
  } 
  
`;

function Input({ 
  name,
  label,
  type,
  onBlur,
  onFocus,
  ...rest 
}) {
  const inputRef = useRef(null)
  const { fieldName, registerField, defaultValue, error } = useField(name)
  const [focused, setFocused] = useState(false)
  // const [isFocused, setIsFocused] = useState(false)

  // useEffect(() => {
  //   inputRef.current.value = defaultValue
  // }, [defaultValue])

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      // clearValue(ref) {
      //   ref.value = ''
      //   ref.clear()
      // },
      // setValue(ref, value) {
      //   ref.setNativeProps({ text: value })
      //   inputRef.current.value = value
      // },
      // getValue(ref) {
      //   return ref.value
      // },
    })
  }, [fieldName, registerField])

  /*
  useEffect(() => {
    const fncFocused = () => {
      if (type === "date") {
        setIsFocused(true)
        return
      }
  
      if (focused) {
        setIsFocused(true)
        return
      } 
      
      if (inputRef.current) {
        // console.log('**** value', String(inputRef.current.value).length, defaultValue)
        if (String(inputRef.current.value).length > 0 || String(rest.value).length > 0) {
          setIsFocused(true)
          return
        }
      } 
      
      setIsFocused(false)
      return
    }
    fncFocused()
  }, [type, focused, rest])
  

  if (rest.value === null || typeof rest.value === 'object') {
    rest.value = ""
  }
  */

  const handleOnFocus = () => {
    setFocused(true)
    return onFocus
  }

  const handleOnBlur = () => {
    setFocused(false)
    return onBlur
  }

  const isFocused = focused || inputRef.current ? String(inputRef.current.value).length ? true : false : false || type === "date"
  
  const renderLabel = () => label && <label>{label}</label>
  // console.log('**** renderLabel', label)
  console.log('**** rest', rest)

  return (
    <InputContainer focused={isFocused}>
      {renderLabel()}
      <input 
        ref={inputRef} 
        type={type}
        defaultValue={defaultValue}
        placeholder={isFocused ? undefined : label}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        // onChange={value => {
        //   if (inputRef.current) {
        //     inputRef.current.value = value
        //   }
        // }}
        {...rest} 
      />
      { error && <span style={{ color: '#F00' }}>{error}</span> }
    </InputContainer>
  )
}

Input.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  inputRef: PropTypes.func,
}

export default forwardRef(Input)