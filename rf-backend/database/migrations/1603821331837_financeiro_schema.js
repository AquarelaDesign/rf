'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FinanceiroSchema extends Schema {
  up () {
    this.create('financeiros', (table) => {
      table.increments()
      table.string('tipo').defaultTo('P')
      table.integer('pedido_id')
      table.integer('cliente_id')
      table.integer('motorista_id')
      table.integer('operador_id')
      table.integer('fornecedor_id')
      table.string('status').defaultTo('')
        .comment('[ ] Aguardando, Em [A]nalise, [X] Com Avaria, Em processo de [L]iberacao, [F]echado')
      table.timestamps()
    })
  }

  down () {
    this.drop('financeiros')
  }
}

module.exports = FinanceiroSchema
