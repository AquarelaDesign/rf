'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContatosSchema extends Schema {
  up () {
    this.create('contatos', (table) => {
      table.increments()
      table
        .integer("cliente_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("clientes")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
      table.string('tipo').notNullable()
      table.string('dados').notNullable()
      table.string('contato')
      table.timestamps()
    })
  }

  down () {
    this.drop('contatos')
  }
}

module.exports = ContatosSchema
