import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styled from "styled-components"

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

export default function Input({ 
  name,
  label,
  type,
  onBlur,
  onFocus,
  ...rest 
}) {
  const inputRef = useRef(null)

  const renderLabel = () => label && <label>{label}</label>

  return (
    <InputContainer focused={true}>
      {renderLabel()}
      <input 
        ref={inputRef} 
        type={type}
        {...rest} 
      />
    </InputContainer>
  )
}

Input.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  inputRef: PropTypes.func,
}
