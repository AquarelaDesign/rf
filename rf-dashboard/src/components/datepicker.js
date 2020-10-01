/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react"

import { withStyles, makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import moment from "moment"
// import 'moment/locale/pt-br'
// moment.locale('pt-BR')

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  withoutLabel: {
    marginTop: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    fontFamily: ['Montserrat', 'sans Serif'],
    fontSize: 12,
},
}))

const CssTextField = withStyles({
  root: {
    '& > *': {
      fontFamily: ['Montserrat', 'sans Serif'],
      fontSize: 14,
    },
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
      '&.Mui-disabled': {
        color: '#666666',
        fontWeight: 500,
      },
    },
    '& .MuiFormHelperText-root': {
      margin: '1px',
      justifyContent: 'left',
      height: '12px',
    },
    '& .MuiFormHelperText-contained': {
      justifyContent: 'left',
    },
  },
})(TextField)

export default function datePicker(props) {
  const classes = useStyles()
  const dataAtual = moment().format('YYYY-MM-DD')

  const [data, setData] = useState(props.input.value ? props.input.value.substring(0, 10) : undefined)
  const [dataID, setDataID] = useState(props.input.value ? props.input.value.substring(0, 10) : undefined)

  useEffect(() => {
    if (data === undefined) {
      setData(props.input.value ? props.input.value.substring(0, 10) : undefined)
    }
    setDataID(`dataTxt_${props.input.name}`)
  },[data, dataAtual, props])

  const handleChange = (event) => {
    const { target: { value } } = event
    // console.log('**** datapicker value', value, props)
    props.input.onChange(value)
    setData(value)
  }

  // console.log('**** props', props)
  // if (data !== null) {
    return (
      <CssTextField 
        id={dataID}
        label={props.label}
        name={props.input.name}
        type="date"
        format='dd/MM/yyyy'
        onChange={handleChange}
        variant="outlined"
        size='small'
        // defaultValue={data}
        disabled={props.disabled}
        // value={data}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          value: data,
          defaultValue: data,
          validate: props.input.validate,
          disabled: props.disabled,
        }}
      />
    )
  // } else {
  //   return (<></>)
  // }
}

