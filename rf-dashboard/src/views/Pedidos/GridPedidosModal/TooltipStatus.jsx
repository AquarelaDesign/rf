import React, { Component } from 'react'

export default class TooltipStatus extends Component {
  getReactContainerClasses() {
    return ['custom-tooltip']
  }

  status(params) {
    switch (params) {
        case 'A': return (<span>Online</span>)
        case 'I': return (<span>Offline</span>)
        default:  return (<></>)
      }
  }

  render() {
    const data = this.props.api.getDisplayedRowAtIndex(this.props.rowIndex)
      .data
      
      return (
      <div
        className="custom-tooltip"
        style={{ backgroundColor: this.props.color || 'white' }}
      >
        <p>
          {this.status(data.status)}
        </p>
      </div>
    )
  }
}