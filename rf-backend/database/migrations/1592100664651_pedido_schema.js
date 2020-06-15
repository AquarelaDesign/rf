'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PedidoSchema extends Schema {
  up () {
    this.create('pedidos', (table) => {
      table.increments()
      table.string('tipo').defaultTo('C')
      table.string('local').defaultTo('')
      table.integer('motorista_id')
      table.date('limitecoleta')
      table.date('limiteentrega')
      table.string('rota').defaultTo('')
      table.integer('localcoleta')
      table.integer('localentrega')
      table.timestamps()
    })
  }

  down () {
    this.drop('pedidos')
  }
}

module.exports = PedidoSchema
