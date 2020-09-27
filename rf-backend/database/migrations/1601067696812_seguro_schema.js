'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SeguroSchema extends Schema {
  up () {
    this.create('seguros', (table) => {
      table.increments()
      table.string('uf').notNullable().defaultTo('')
      table.decimal('ac', 5, 4).defaultTo(0.0000)
      table.decimal('al', 5, 4).defaultTo(0.0000)
      table.decimal('ap', 5, 4).defaultTo(0.0000)
      table.decimal('am', 5, 4).defaultTo(0.0000)
      table.decimal('ba', 5, 4).defaultTo(0.0000)
      table.decimal('ce', 5, 4).defaultTo(0.0000)
      table.decimal('df', 5, 4).defaultTo(0.0000)
      table.decimal('es', 5, 4).defaultTo(0.0000)
      table.decimal('go', 5, 4).defaultTo(0.0000)
      table.decimal('ma', 5, 4).defaultTo(0.0000)
      table.decimal('mt', 5, 4).defaultTo(0.0000)
      table.decimal('ms', 5, 4).defaultTo(0.0000)
      table.decimal('mg', 5, 4).defaultTo(0.0000)
      table.decimal('pa', 5, 4).defaultTo(0.0000)
      table.decimal('pb', 5, 4).defaultTo(0.0000)
      table.decimal('pr', 5, 4).defaultTo(0.0000)
      table.decimal('pe', 5, 4).defaultTo(0.0000)
      table.decimal('pi', 5, 4).defaultTo(0.0000)
      table.decimal('rj', 5, 4).defaultTo(0.0000)
      table.decimal('rn', 5, 4).defaultTo(0.0000)
      table.decimal('rs', 5, 4).defaultTo(0.0000)
      table.decimal('ro', 5, 4).defaultTo(0.0000)
      table.decimal('rr', 5, 4).defaultTo(0.0000)
      table.decimal('sc', 5, 4).defaultTo(0.0000)
      table.decimal('sp', 5, 4).defaultTo(0.0000)
      table.decimal('se', 5, 4).defaultTo(0.0000)
      table.decimal('to', 5, 4).defaultTo(0.0000)
      table.timestamps()
    })
  }

  down () {
    this.drop('seguros')
  }
}

module.exports = SeguroSchema
