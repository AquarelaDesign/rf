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
  },
}))

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#0031FF',
    },
    //   '& .MuiInput-underline:after': {
    //     borderBottomColor: '#2699F8',
    //   },
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

export default function datePicker(props) {
  const classes = useStyles()
  const dataAtual = moment().format('YYYY-MM-DD')

  const [data, setData] = useState(props.input.value ? props.input.value.substring(0, 10) : null)

  useEffect(() => {
    if (data === null) {
      setData(props.input.value ? props.input.value.substring(0, 10) : null)
    } 
  },[data, dataAtual, props])

  const handleChange = (event) => {
    const { target: { value } } = event
    props.input.onChange(value)
    setData(value)
  }

  // if (data !== null) {
    return (
      <CssTextField 
        // id='dataTxt'
        label={props.label}
        name={props.input.name}
        type="date"
        format='dd/MM/yyyy'
        onChange={handleChange}
        variant="outlined"
        size='small'
        defaultValue={data}
        value={data}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
    )
  // } else {
  //   return (<></>)
  // }
}

