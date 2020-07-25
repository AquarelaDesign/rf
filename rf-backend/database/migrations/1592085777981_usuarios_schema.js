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
      table.string('celular').defaultTo('')
      table.string('telefone').defaultTo('')
      table.string('whats').defaultTo('')
      table.string('codigopush').defaultTo('')
      table.string('logradouro').defaultTo('')
      table.string('numero').defaultTo('')
      table.string('complemento').defaultTo('')
      table.string('bairro').defaultTo('')
      table.string('cidade').notNullable()
      table.string('uf').notNullable()
      table.string('pais').defaultTo('')
      table.string('cep').defaultTo('')
      table.integer('codbanco')
      table.string('banco')
      table.string('agencia')
      table.string('conta')
      table.string('tipoconta')
      table.string('foto').defaultTo('') 
      table.string('habilitacao').defaultTo('') 
      table.string('habilitacaoimg').defaultTo('')
      table.date('habilitacaovct')
      table.string('cavalo').defaultTo('') 
      table.string('cavaloimg').defaultTo('')
      table.date('cavalovct')
      table.string('cavalo1').defaultTo('') 
      table.string('cavalo1img').defaultTo('')
      table.date('cavalo1vct')
      table.string('ANTT').defaultTo('') 
      table.string('ANTTimg').defaultTo('')
      table.date('ANTTvct')
      table.decimal('rate', 9, 6).defaultTo(0)
      table.string('localizacao').defaultTo('')
      table.string('origem').defaultTo('')
      table.string('destino').defaultTo('')
      table.decimal('latitude', 9, 6).defaultTo(0)
      table.decimal('longitude', 9, 6).defaultTo(0)
      table.string('status')
        .defaultTo('A')
        .comment('[A]tivo, [I]nativo ou [B]loqueado')
      table.string('estado')
        .defaultTo('')
        .comment('[] Disponível, Aguardando A[P]rovacao, [A]guardando Coleta, Em [T]ransporte')
      table.string('tipo')
        .notNullable()
        .comment('[O]perador, [F]ornecedor, [M]otorista ou [C]liente')
      table.integer('user_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('usuarios')
  }
}

module.exports = UsuariosSchema
