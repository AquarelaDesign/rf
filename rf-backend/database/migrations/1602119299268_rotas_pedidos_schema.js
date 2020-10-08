'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RotasPedidosSchema extends Schema {
  up () {
    this.create('rotas_pedidos', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('rotas_pedidos')
  }
}

module.exports = RotasPedidosSchema
