'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContasAPagarSchema extends Schema {
  up () {
    this.create('contas_a_pagars', (table) => {
      table.increments()
      table.integer('conta_id')
      table.string('titulo').defaultTo('')
      table.string('descricao').defaultTo('')
      table.date('data_vencimento')
      table.date('data_pagamento')
      table.decimal('valor', 9, 2).defaultTo(0)
      table.decimal('valor_pago', 9, 2).defaultTo(0)
      table.decimal('saldo', 9, 2).defaultTo(0)
      table.boolean('pago')
      table.integer('usuario_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('contas_a_pagars')
  }
}

module.exports = ContasAPagarSchema
