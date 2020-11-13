export const columnDefs = [
  {
    headerName: "Tipo",
    field: "tipo_de_veiculo_id",
    width: 40,
    cellRenderer: 'buscaTipo',
    cellEditor: "autoCompleteEditor",
    cellEditorParams: {
      options: tipos
    }
  },
  {
    headerName: "Cidade Origem",
    field: "cidade_origem",
    flex: 1,
    width: 18,
  },
  {
    headerName: "UF",
    field: "uf_origem",
    width: 80,
  },
  {
    headerName: "Cidade Destino",
    field: "cidade_destino",
    flex: 1,
    width: 18,
  },
  {
    headerName: "Valor",
    field: "valor",
    width: 100,
  },
]

export const defaultColDef = {
  editable: true,
  resizable: true,
  filter: true,
  floatingFilter: true,
  suppressKeyboardEvent: params => params.editing
}