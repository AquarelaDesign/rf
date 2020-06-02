'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CartaoSchema extends Schema {
  up () {
    this.create('cartaos', (table) => {
      table.increments()
      table
        .integer("cliente_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("clientes")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
      table.integer('numero',16).notNullable().unique()
      table.integer('vmes',2).notNullable()
      table.integer('vano',4).notNullable()
      table.integer('crv',3).notNullable()
      table.string('nome').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('cartaos')
  }
}

module.exports = CartaoSchema
