import React, { useEffect, useState, useRef } from 'react'
import { useField } from "@unform/core"
import PropTypes from 'prop-types'

import styled from "styled-components"

import { Select as UnSelect } from 'unform-material-ui'

import {
  MenuItem,
  // withStyles,
} from '@material-ui/core'

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2px 0;
  position: relative;
  margin-top: 5px;
  color: #000;
  font-family: "Montserrat", sans-serif;
`

/*
const CssTextField = withStyles({
  root: {
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
*/

export default function Select({ 
  name, 
  label,
  value,
  disabled,
  options, 
  ...rest 
}) {
  const inputRef = useRef(null)
  const { fieldName, registerField, defaultValue, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      // path: "state.value",
      getValue: () => {
        return value
      },
      // setValue: (value) => {
      //   ref.select.setValue(value || null)
      // },
    })
  }, [fieldName, registerField])

  console.log('**** Select.inputRef', inputRef)

  return (
    <SelectContainer>
      <UnSelect
        ref={inputRef}
        name={name}
        label={label}
        disabled={disabled}
        // value={options.filter(({ val }) => val === value)}
        // defaultValue={
        //   defaultValue && options.find(option => option.value === defaultValue)
        // }
        variant="outlined"
        fullWidth
        select
        size="small"
        margin="dense"
        {...rest}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </UnSelect>
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

Select.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  inputRef: PropTypes.func,
  disabled: PropTypes.bool,
}

