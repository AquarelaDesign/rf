import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import { ptBR } from "date-fns/locale";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

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


export default forwardRef((props, ref) => {
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (selectedDate === null || selectedDate === undefined) {

      console.log('**** DateEditor.props.input.value', props)

      if (props.input.value !== null && props.input.value !== undefined && props.input.value !== "") {
        let year = props.input.value.substring(0, 4)
        let month = props.input.value.substring(5, 7)
        let day = props.input.value.substring(8)
        let selectedDate = new Date(year, month - 1, day);
        setSelectedDate(format(selectedDate, 'dd/MM/yyyy'))
      } else {
        let today = new Date();
        console.log('**** DateEditor',selectedDate, today, format(today, 'dd/MM/yyyy'))
        setSelectedDate(format(today, 'dd/MM/yyyy'))
      }
    }
  },[selectedDate, props])

  function handleDateChange(d) {
    // if (d) {
    //   d.setHours(0, 0, 0, 0);
    // }
    // console.log('**** DateEditor.handleDateChange.d', format(d, 'dd/MM/yyyy'))
    setSelectedDate(format(d, 'dd/MM/yyyy'));
  }

  useImperativeHandle(ref, () => {
    return {
      getValue: () => {
        let dateString = null;
        if (selectedDate) {
          dateString = format(selectedDate, 'dd/MM/yyyy');
        }
        return dateString;
      },
      isCancelAfterEnd: () => {
        return !selectedDate;
      },
      afterGuiAttached: () => {
        if (!props.value) {
          return;
        }
        const [_, day, month, year] = props.value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        let selectedDate = new Date(year, month - 1, day);
        setSelectedDate(selectedDate);
      }
    };
  });

  // console.log('**** DateEditor.selectedDate', selectedDate)

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
      <KeyboardDatePicker
        style={{ width: '100%', margin: 0, }}
        margin="none"
        id="date-picker-dialog"
        format="dd/MM/yyyy"
        value={selectedDate}
        inputValue={selectedDate}
        onChange={handleDateChange}
        variant="inline"
        inputVariant="outlined"
        label={props.label}
        size='small'
        // disableToolbar
        invalidDateMessage="Formato inválido."
        TextFieldComponent={CssTextField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          disabled: props.disabled,
        }}
        forwardedRef={ref}
      />
    </MuiPickersUtilsProvider>
  )
});
