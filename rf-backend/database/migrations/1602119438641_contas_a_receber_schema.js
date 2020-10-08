'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContasAReceberSchema extends Schema {
  up () {
    this.create('contas_a_recebers', (table) => {
      table.increments()
      table.integer('conta_id')
      table.string('titulo').defaultTo('')
      table.string('descricao').defaultTo('')
      table.date('data_vencimento')
      table.date('data_recebimento')
      table.decimal('valor', 9, 2).defaultTo(0)
      table.decimal('valor_recebido', 9, 2).defaultTo(0)
      table.decimal('saldo', 9, 2).defaultTo(0)
      table.boolean('recebido')
      table.integer('usuario_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('contas_a_recebers')
  }
}

module.exports = ContasAReceberSchema
