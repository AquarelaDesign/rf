'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FiscalSchema extends Schema {
  up () {
    this.create('fiscals', (table) => {
      table.increments()
      table.string('tipo').defaultTo('F')
      table.integer('pedido_id')
      table.integer('cliente_id')
      table.integer('motorista_id')
      table.decimal('valor')
      table.string('status').defaultTo('')
        .comment('[]Emitir CTe, [X]Encerrar Manifesto, [T]arefas Realizadas')
      table.timestamps()
    })
  }

  down () {
    this.drop('fiscals')
  }
}

module.exports = FiscalSchema
