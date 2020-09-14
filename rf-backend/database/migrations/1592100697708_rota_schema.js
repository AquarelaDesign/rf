'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RotaSchema extends Schema {
  up () {
    this.create('rotas', (table) => {
      table.increments()
      table.integer('pedido_id')
        .unsigned()
        .references('id')
        .inTable('pedidos')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('nome').notNullable()
      table.string('cpfcnpj').notNullable().defaultTo('')
      table.string('logradouro').notNullable()
      table.string('numero').defaultTo('')
      table.string('complemento').defaultTo('')
      table.string('bairro').notNullable()
      table.string('cidade').notNullable()
      table.string('uf').notNullable()
      table.string('pais').defaultTo('')
      table.string('cep').notNullable()
      table.string('contato').notNullable().defaultTo('')
      table.string('celular').notNullable()
      table.string('telefone')
      table.string('whats')
      table.string('email')
      table.integer('motorista_id')
      table.string('tipo').comment('[C]oleta / [E]ntrega')
      table.integer('rota_relacionada').comment('Rota Relacionada')
      table.string('status').comment('[]Aguardando / [C]oletando / [A] Caminho / [E]ntregue')
      table.timestamps()
    })
  }

  down () {
    this.drop('rotas')
  }
}

module.exports = RotaSchema
