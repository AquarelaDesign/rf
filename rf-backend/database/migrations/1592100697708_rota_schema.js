'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RotaSchema extends Schema {
  up () {
    this.create('rotas', (table) => {
      table.increments()
      table
        .integer('pedido_id')
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("pedidos")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")

      table.string('descricao').notNullable().defaultTo('')
      table.string('logradouro').notNullable()
      table.string('numero').defaultTo('')
      table.string('complemento').defaultTo('')
      table.string('bairro').notNullable()
      table.string('cidade').notNullable()
      table.string('uf').notNullable()
      table.string('pais').defaultTo('')
      table.string('cep').notNullable()
      table.string('contato').notNullable().defaultTo('')
      table.integer('celular').notNullable()

      table.timestamps()
    })
  }

  down () {
    this.drop('rotas')
  }
}

module.exports = RotaSchema
