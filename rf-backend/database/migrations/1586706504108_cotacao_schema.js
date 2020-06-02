'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CotacaoSchema extends Schema {
  up () {
    this.create('cotacaos', (table) => {
      table.increments()

      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
      
      table.string('cliente_id').notNullable()
      table.enu('modalidade', ['DEDICADO','COMPARTILHADO']).defaultTo('DEDICADO')
      table.decimal('valor', 6, 3)
      table.decimal('desconto', 6, 3)
      table.decimal('negociado', 6, 3)
      table.date('validade')
      table.enu('status', ['ABERTO','FECHADO']).defaultTo('ABERTO')
      
      table.timestamps()
    })
  }

  down () {
    this.drop('cotacaos')
  }
}

module.exports = CotacaoSchema
