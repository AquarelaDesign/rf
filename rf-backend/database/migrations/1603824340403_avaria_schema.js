'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AvariaSchema extends Schema {
  up () {
    this.create('avarias', (table) => {
      table.increments()
      table.integer('financeiro_id')
        .unsigned()
        .references('id')
        .inTable('financeiros')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('fornecedor_id')
      table.string('placa')
      table.string('descricao').notNullable()
      table.decimal('valor', 9, 2).defaultTo(0)
      table.string('status').defaultTo('')
        .comment('[ ] Aguardando, Em [A]nalise, Em [R]eparo, [L]iberado, [F]echado')
      table.timestamps()
    })
  }

  down () {
    this.drop('avarias')
  }
}

module.exports = AvariaSchema
