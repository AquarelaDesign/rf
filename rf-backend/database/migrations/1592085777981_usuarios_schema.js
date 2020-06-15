'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsuariosSchema extends Schema {
  up () {
    this.create('usuarios', (table) => {
      table.increments()
      table.string('nome').notNullable()
      table.string('email').notNullable()
      table.string('cpfcnpj').notNullable().unique()
      table.string('ierg').notNullable()
      table.string('contato').defaultTo('')
      table.integer('celular').notNullable()
      table.integer('telefone').defaultTo(0)
      table.integer('whats')
      table.string('codigopush').defaultTo('')
      table.string('logradouro').notNullable()
      table.string('numero').defaultTo('')
      table.string('complemento').defaultTo('')
      table.string('bairro').notNullable()
      table.string('cidade').notNullable()
      table.string('uf').notNullable()
      table.string('pais').defaultTo('')
      table.string('foto').defaultTo('https://jakweb.com.br/rf/sem_foto.png')
      table.string('cep').notNullable()
      table.decimal('rate', 9, 6).defaultTo(0)
      table.decimal('latitude', 9, 6).defaultTo(0)
      table.decimal('longitude', 9, 6).defaultTo(0)
      table.enu('status', ['A','I','B']).defaultTo('A')
      table.enu('estado', ['D','A','C','T','']).defaultTo('')
      table.enu('tipo', ['O','M','C']).notNullable()
      table.integer('user_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('usuarios')
  }
}

module.exports = UsuariosSchema
