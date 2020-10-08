'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HistoricoSchema extends Schema {
  up () {
    this.create('historicos', (table) => {
      table.increments()
      table.integer('motorista_id')
      table.integer('cliente_id')
      table.integer('operador_id')
      table.integer('pedido_id')
      table.integer('titulo_pagar_id')
      table.integer('titulo_receber_id')
      table.text('observacao')
      table.decimal('valor')
      table.timestamps()
    })
  }

  down () {
    this.drop('historicos')
  }
}

module.exports = HistoricoSchema
