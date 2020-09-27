'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MetropolesSchema extends Schema {
  up () {
    this.create('metropoles', (table) => {
      table.increments()
      table.string('nome').notNullable().defaultTo('')
      table.timestamps()
    })
  }

  down () {
    this.drop('metropoles')
  }
}

module.exports = MetropolesSchema
