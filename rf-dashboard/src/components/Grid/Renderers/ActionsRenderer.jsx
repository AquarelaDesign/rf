import React, { useState, useEffect } from 'react';
import { useComponentWillMount } from '../../utils';

import { Tooltip } from '@material-ui/core'

import { FaIcon } from '../../Icone'

export default (props) => {
  let [editing, setEditing] = useState(false);
  let [disabled, setDisabled] = useState(false);

  // custom hook
  useComponentWillMount(() => {
    let editingCells = props.api.getEditingCells();
    if (editingCells.length !== 0) {
      setDisabled(true);
    }
  })

  useEffect(() => {
    props.api.addEventListener('rowEditingStarted', onRowEditingStarted);
    props.api.addEventListener('rowEditingStopped', onRowEditingStopped);

    return () => {
      props.api.removeEventListener('rowEditingStarted', onRowEditingStarted);
      props.api.removeEventListener('rowEditingStopped', onRowEditingStopped);
    };
  }, []);

  function onRowEditingStarted(params) {
    if (props.node === params.node) {
      setEditing(true);
    } else {
      setDisabled(true);
    }
  };

  function onRowEditingStopped(params) {
    if (props.node === params.node) {
      if (isEmptyRow(params.data)) {
        deleteRow(true);
      } else {
        setEditing(false);
      }
    } else {
      setDisabled(false);
    }
  }

  function startEditing() {
    props.api.startEditingCell({
      rowIndex: props.rowIndex,
      colKey: props.column.colId
    });
  }

  function stopEditing(bool) {
    props.api.stopEditing(bool);
  }

  function deleteRow(force = false) {
    let data = props.data;
    let confirm = true;
    if (!force) {
      confirm = window.confirm(`tem certeza que deseja remover esta linha: ${JSON.stringify(data)})`)
    }
    if (confirm) {
      props.api.updateRowData({ remove: [data] });
      props.api.refreshCells({ force: true });
    }
  };

  function isEmptyRow(data) {
    let dataCopy = { ...data };
    delete dataCopy.id;
    return !Object.values(dataCopy).some(value => value);
  }

  return (
    <div style={{ width: '80px' }}>
      {editing
        ? <>
          <button
            color="primary"
            variant="contained"
            onClick={() => stopEditing(false)}
            disabled={disabled}
            style={{ width: '24px', backgroundColor: 'transparent', cursor: 'pointer' }}
          >
            <Tooltip title="Atualizar">
              <span style={{
                alignItems: 'center',
                // color: '#ff5330',
                marginLeft: '-18px',
                marginTop: '3px',
              }}>
                <FaIcon icon='GrUpdate' size={20} />
              </span>
            </Tooltip>
          </button>
          <button
            color="secondary"
            variant="contained"
            onClick={() => stopEditing(true)}
            disabled={disabled}
            style={{ width: '24px', backgroundColor: 'transparent', cursor: 'pointer' }}
          >
            <Tooltip title="Cancelar">
              <span style={{
                alignItems: 'center',
                color: '#ff5330',
                marginLeft: '-18px',
                marginTop: '3px',
              }}>
                <FaIcon icon='FcCancel' size={20} />
              </span>
            </Tooltip>
          </button>
        </>
        : <>
          <button
            color="primary"
            variant="outlined"
            onClick={startEditing}
            disabled={disabled}
            style={{ width: '24px', backgroundColor: 'transparent', cursor: 'pointer' }}
          >
            <Tooltip title="Editar">
              <span style={{
                alignItems: 'center',
                // color: '#ff5330',
                marginLeft: '-18px',
                marginTop: '3px',
              }}>
                <FaIcon icon='FaRegEdit' size={20} />
              </span>
            </Tooltip>
          </button>
          <button
            color="secondary"
            variant="outlined"
            onClick={() => deleteRow()}
            disabled={disabled}
            style={{ width: '24px', backgroundColor: 'transparent', cursor: 'pointer' }}
          >
            <Tooltip title="Excluir">
              <span style={{
                alignItems: 'center',
                color: '#ff5330',
                marginLeft: '-18px',
                marginTop: '3px',
              }}>
                <FaIcon icon='Deletar' size={20} />
              </span>
            </Tooltip>
          </button>
        </>
      }
    </div>
  )
}
