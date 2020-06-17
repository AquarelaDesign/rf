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
      table.string('ierg').defaultTo('')
      table.string('contato').defaultTo('')
      table.string('celular').notNullable()
      table.string('telefone')
      table.string('whats')
      table.string('codigopush').defaultTo('')
      table.string('logradouro').notNullable()
      table.string('numero').defaultTo('')
      table.string('complemento').defaultTo('')
      table.string('bairro').notNullable()
      table.string('cidade').notNullable()
      table.string('uf').notNullable()
      table.string('pais').defaultTo('')
      table.string('foto').defaultTo('') // https://jakweb.com.br/rf/sem_foto.png
      table.string('cep').notNullable()
      table.decimal('rate', 9, 6).defaultTo(0)
      table.decimal('latitude', 9, 6).defaultTo(0)
      table.decimal('longitude', 9, 6).defaultTo(0)
      table.enu('status', ['A','I','B'])
        .defaultTo('A')
        .comment('[A]tivo, [I]nativo ou [B]loqueado')
      table.enu('estado', ['','A','P','T'])
        .defaultTo('')
        .comment('[] Disponível, Aguardando A[P]rovacao, [A]guardando Coleta, Em [T]ransporte')
      table.enu('tipo', ['O','M','C'])
        .notNullable()
        .comment('[O]perador, [M]otorista ou [C]liente')
      table.integer('user_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('usuarios')
  }
}

module.exports = UsuariosSchema
