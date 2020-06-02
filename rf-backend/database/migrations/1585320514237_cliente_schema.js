'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClienteSchema extends Schema {
  up () {
    this.create('clientes', (table) => {
      table.increments()
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
      table.string('cpfcnpj').notNullable().unique()
      table.string('ierg').notNullable()
      table.string('nomerazao').notNullable()
      table.string('contato')
      table.string('email').notNullable()
      table.integer('celular').notNullable()
      table.integer('telefone')
      table.string('whatsapp')
      table.string('codigopush')
      table.enu('status', ['ATIVO','INATIVO','BLOQUEADO'])
      table.string('observacoes')
      table.timestamps()
    })
  }

  down () {
    this.drop('clientes')
  }
}

module.exports = ClienteSchema
