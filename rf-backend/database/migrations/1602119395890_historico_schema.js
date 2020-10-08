'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HistoricoSchema extends Schema {
  up () {
    this.create('historicos', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('historicos')
  }
}

module.exports = HistoricoSchema
