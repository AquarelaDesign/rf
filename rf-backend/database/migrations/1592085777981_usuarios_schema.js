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
      table.string('cep').notNullable()
      table.integer('codbanco')
      table.string('banco')
      table.string('agencia')
      table.string('conta')
      table.string('tipoconta')
      table.string('foto').defaultTo('') // https://jakweb.com.br/rf/sem_foto.png
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
      table.string('localizacao').notNullable()
      table.string('origem').notNullable()
      table.string('destino').notNullable()
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
