'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PagamentoSchema extends Schema {
  up () {
    this.create('pagamentos', (table) => {
      table.increments()

      table
        .integer("cotacao_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("cotacaos")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
      
      table.integer('numero',16).notNullable().unique()
      table.integer('vmes',2).notNullable()
      table.integer('vano',4).notNullable()
      table.integer('crv',3).notNullable()
      table.string('nome').notNullable()

      table.integer('parcelas', 3)
      table.decimal('valor', 6, 3)

      table.enu('status', ['ABERTO','EM ANALISE','FECHADO'])

      table.timestamps()
    })
  }

  down () {
    this.drop('pagamentos')
  }
}

module.exports = PagamentoSchema
