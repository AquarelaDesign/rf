'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OperadorSchema extends Schema {
  up () {
    this.create('operadors', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('operadors')
  }
}

module.exports = OperadorSchema
