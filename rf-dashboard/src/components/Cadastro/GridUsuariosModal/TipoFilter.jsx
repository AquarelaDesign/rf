import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import { FaIcon } from '../../Icone'

export default class TipoFilter extends Component {
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
          <Select
            labelId="status-label"
            id="status"
            value={this.state.text}
            onChange={this.onChange}
          >
            <MenuItem value='O'>
              <ListItemIcon>
                <FaIcon icon='FaHeadphonesAlt' size={20} />
              </ListItemIcon>
              Operador
            </MenuItem>
            <MenuItem value='M'>
              <ListItemIcon>
                <FaIcon icon='FaTruck1' size={20} />
              </ListItemIcon>
              Mecânico
            </MenuItem>
            <MenuItem value='C'>
              <ListItemIcon>
                <FaIcon icon='FaUserTie' size={20} />
              </ListItemIcon>
              Cliente
            </MenuItem>
            <MenuItem value='F'>
              <ListItemIcon>
                <FaIcon icon='supplier' size={20} />
              </ListItemIcon>
              Fornecedor
            </MenuItem>
            <MenuItem value=''>
              Todos
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  }
}