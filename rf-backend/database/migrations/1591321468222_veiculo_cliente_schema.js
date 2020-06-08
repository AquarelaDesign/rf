'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VeiculoClienteSchema extends Schema {
  up () {
    this.create('veiculo_clientes', (table) => {
      table.increments()
      table
        .integer("cliente_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("clientes")
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
    this.drop('veiculo_clientes')
  }
}

module.exports = VeiculoClienteSchema
