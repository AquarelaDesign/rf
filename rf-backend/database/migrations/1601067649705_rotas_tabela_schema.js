'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RotasTabelaSchema extends Schema {
  up () {
    this.create('rotas_tabelas', (table) => {
      table.increments()
      table.integer('tipo_de_veiculo_id').notNullable()
      table.string('cidade_origem').notNullable().defaultTo('')
      table.string('uf_origem').notNullable().defaultTo('')
      table.string('cidade_destino').notNullable().defaultTo('')
      table.string('uf_destino').notNullable().defaultTo('')
      table.string('nome').notNullable().defaultTo('')
      table.decimal('valor', 9, 2).defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('rotas_tabelas')
  }
}

module.exports = RotasTabelaSchema
