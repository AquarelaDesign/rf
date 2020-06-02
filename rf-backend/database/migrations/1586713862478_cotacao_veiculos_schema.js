'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CotacaoVeiculosSchema extends Schema {
  up () {
    this.create('cotacao_veiculos', (table) => {
      table.increments()

      table
        .integer("cotacao_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("cotacaos")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
      
        table.string('placa',7)
        table.string('chassi',17)
        table.string('marca',50).notNullable()
        table.string('modelo',100).notNullable()
        table.integer('ano',4).notNullable()
        table.float('valor',[7,2]).notNullable()
        
        table.timestamps()
    })
  }

  down () {
    this.drop('cotacao_veiculos')
  }
}

module.exports = CotacaoVeiculosSchema
