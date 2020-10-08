'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContasAReceberSchema extends Schema {
  up () {
    this.create('contas_a_recebers', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('contas_a_recebers')
  }
}

module.exports = ContasAReceberSchema
