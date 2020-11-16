'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NumeradorSchema extends Schema {
  up () {
    this.create('numeradors', (table) => {
      table.increments()
      table.string('tipo').notNullable()
      table.integer('numero').defaultTo(0)
      table.string('descricao').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('numeradors')
  }
}

module.exports = NumeradorSchema
