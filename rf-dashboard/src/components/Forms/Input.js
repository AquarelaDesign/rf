import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'
import PropTypes from 'prop-types'

import { Container, TextInput } from './styles'

export default function Input({ name, ...rest }) {
  const inputRef = useRef(null)
  const { fieldName, registerField, defaultValue, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value'
    })
  }, [fieldName, registerField])

  return (
    <Container>
      <TextInput ref={inputRef} defaultValue={defaultValue} {...rest} />
      { error && <span style={{ color: '#F00' }}>{error}</span> }
    </Container>
  )
}

Input.propTypes = {
  name: PropTypes.string,
  inputRef: PropTypes.func.isRequired,
}
