'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TiposDeVeiculoSchema extends Schema {
  up () {
    this.create('tipos_de_veiculos', (table) => {
      table.increments()
      table.string('tipo').notNullable().defaultTo('')
      table.string('nome').notNullable().defaultTo('')
      table.timestamps()
    })
  }

  down () {
    this.drop('tipos_de_veiculos')
  }
}

module.exports = TiposDeVeiculoSchema
