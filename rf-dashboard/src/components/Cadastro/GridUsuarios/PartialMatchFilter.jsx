import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class PartialMatchFilter extends Component {
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
    this.state.text = model ? model.value : '';
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
    alert(`Alert from PartialMatchFilterComponent: ${message}`);
  }

  onChange(event) {
    const newValue = event.target.value;

    if (this.state.text !== newValue) {
      this.setState(
        {
          text: newValue,
        },
        () => {
          this.props.filterChangedCallback();
        }
      );
    }
  }

  render() {
    const style = {
      border: '1px solid #0031FF',
      borderRadius: '5px',
      backgroundColor: '#2699F8',
      width: '200px',
      height: '50px',
      fontWeight: 'bold',
      textShadow: '#B5B5B5 2px 3px 3px',
    };

    return (
      <div style={style}>
        Filtro:{' '}
        <input
          style={{ marginLeft: '7px', height: '20px', width: '180px' }}
          ref="input"
          value={this.state.text}
          onChange={this.onChange}
          className="form-control"
        />
      </div>
    );
  }
}