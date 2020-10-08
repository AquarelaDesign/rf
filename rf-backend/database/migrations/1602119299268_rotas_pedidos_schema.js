'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RotasPedidosSchema extends Schema {
  up () {
    this.create('rotas_pedidos', (table) => {
      table.increments()
      table.integer('pedido_id')
        .unsigned()
        .references('id')
        .inTable('pedidos')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('nome').notNullable()
      table.string('cpfcnpj').notNullable().defaultTo('')
      table.integer('motorista_id')
      table.integer('ordem')
      table.string('logradouro_origem').notNullable()
      table.string('numero_origem').defaultTo('')
      table.string('complemento_origem').defaultTo('')
      table.string('bairro_origem').notNullable()
      table.string('cidade_origem').notNullable()
      table.string('uf_origem').notNullable()
      table.string('pais_origem').defaultTo('')
      table.string('cep_origem').notNullable()
      table.string('contato_origem').notNullable().defaultTo('')
      table.string('celular_origem').notNullable()
      table.string('telefone_origem')
      table.string('whats_origem')
      table.string('email_origem')
      table.decimal('latitude_origem', 9, 6).defaultTo(0)
      table.decimal('longitude_origem', 9, 6).defaultTo(0)
      table.string('logradouro_destino').notNullable()
      table.string('numero_destino').defaultTo('')
      table.string('complemento_destino').defaultTo('')
      table.string('bairro_destino').notNullable()
      table.string('cidade_destino').notNullable()
      table.string('uf_destino').notNullable()
      table.string('pais_destino').defaultTo('')
      table.string('cep_destino').notNullable()
      table.string('contato_destino').notNullable().defaultTo('')
      table.string('celular_destino').notNullable()
      table.string('telefone_destino')
      table.string('whats_destino')
      table.string('email_destino')
      table.decimal('latitude_destino', 9, 6).defaultTo(0)
      table.decimal('longitude_destino', 9, 6).defaultTo(0)
      table.string('status').comment('[]Aguardando / [C]oletando / [A] Caminho / [E]ntregue')
      table.timestamps()
    })
  }

  down () {
    this.drop('rotas_pedidos')
  }
}

module.exports = RotasPedidosSchema
