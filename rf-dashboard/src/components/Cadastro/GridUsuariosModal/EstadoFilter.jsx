import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import { FaIcon } from '../../Icone'

export default class EstadoFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };

    this.valueGetter = this.props.valueGetter;

    this.onChange = this.onChange.bind(this);
  }

  isFilterActive() {
    return this.state.text != null && this.state.text !== '';
  }

  doesFilterPass(params) {
    try {
      return this.state.text
        .toLowerCase()
        .split(' ')
        .every(
          filterWord =>
            this.valueGetter(params.node)
              .toString()
              .toLowerCase()
              .indexOf(filterWord) >= 0
        );
    }
    catch (e) {
      // console.log('*** doesFilterPass-e', e);
    }
  }

  getModel() {
    return { value: this.state.text };
  }

  setModel(model) {
    // this.state.text = model ? model.value : '';
    this.setState({
      text: model ? model.value : '',
    })
  }

  afterGuiAttached(params) {
    this.focus();
  }

  focus() {
    window.setTimeout(() => {
      const container = ReactDOM.findDOMNode(this.refs.input);

      if (container) {
        container.focus();
      }
    });
  }

  componentMethod(message) {
    alert(`Alert from StatusFilterComponent: ${message}`);
  }

  onChange(event) {
    const newValue = event.target.value;

    if (this.state.text !== newValue) {
      this.setState(
        {
          text: newValue
        },
        () => {
          this.props.filterChangedCallback();
        }
      );
    }
  }

  render() {
    const style = {
      // border: '1px solid #0031FF',
      borderRadius: '5px',
      backgroundColor: '#FFFFFF',
      width: '160px',
      height: '50px',
      fontWeight: 'bold',
      textShadow: '#B5B5B5 2px 3px 3px',
    };

    return (
      <div style={style}>
        <FormControl style={{ margin: '1px', height: '30px', width: '150px' }}>
          {/* <InputLabel id="status-label">Status</InputLabel> */}
          <Select
            labelId="status-label"
            id="status"
            value={this.state.text}
            onChange={this.onChange}
          >
            <MenuItem value='P'>
              <ListItemIcon>
                <span style={{ color: 'blue' }}><FaIcon icon='FaTruckLoading' size={20} /></span>
              </ListItemIcon>
              Aprovação
            </MenuItem>
            <MenuItem value='A'>
              <ListItemIcon>
                <span style={{ color: 'orange' }}><FaIcon icon='FaHandPaper' size={20} /></span>
              </ListItemIcon>
              Coleta
            </MenuItem>
            <MenuItem value='T'>
              <ListItemIcon>
                <span style={{ color: 'red' }}><FaIcon icon='GrDeliver' size={20} /></span>
              </ListItemIcon>
              Transporte
            </MenuItem>

            <MenuItem value='B'>
              <ListItemIcon>
                <span style={{ color: 'red' }}><FaIcon icon='FcCancel' size={20} /></span>
              </ListItemIcon>
              Bloqueado
            </MenuItem>
            <MenuItem value='R'>
              <ListItemIcon>
                <span style={{ color: 'red' }}><FaIcon icon='FiAlertOctagon' size={20} /></span>
              </ListItemIcon>
              Recusado
            </MenuItem>
            <MenuItem value='7'>
              <ListItemIcon>
                <span style={{ color: 'orange' }}><FaIcon icon='FiAlertTriangle' size={20} /></span>
              </ListItemIcon>
              Suspenso 7 dias
            </MenuItem>
            <MenuItem value=''>
              <ListItemIcon>
                <span style={{ color: 'green' }}><FaIcon icon='FaRegThumbsUp' size={20} /></span>
              </ListItemIcon>
              Todos
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  }
}