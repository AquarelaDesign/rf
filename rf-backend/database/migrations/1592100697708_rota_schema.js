'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RotaSchema extends Schema {
  up () {
    this.create('rotas', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('rotas')
  }
}

module.exports = RotaSchema
