'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VeiculoMotoristaSchema extends Schema {
  up () {
    this.create('veiculo_motoristas', (table) => {
      table.increments()
      table
        .integer("motorista_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("motoristas")
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
    this.drop('veiculo_motoristas')
  }
}

module.exports = VeiculoMotoristaSchema
