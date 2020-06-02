'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TrajetoSchema extends Schema {
  up () {
    this.create('trajetos', (table) => {
      table.increments()

      table
        .integer("cotacao_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("cotacaos")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
      
      table.string('ologradouro').notNullable()
      table.string('onumero')
      table.string('ocomplemento')
      table.string('obairro').notNullable()
      table.string('ocidade').notNullable()
      table.string('ouf').notNullable()
      table.integer('ocep').notNullable()
      table.decimal('olatitude', 9, 6)
      table.decimal('olongitude', 9, 6)

      table.string('dlogradouro').notNullable()
      table.string('dnumero')
      table.string('dcomplemento')
      table.string('dbairro').notNullable()
      table.string('dcidade').notNullable()
      table.string('duf').notNullable()
      table.integer('dcep').notNullable()
      table.decimal('dlatitude', 9, 6)
      table.decimal('dlongitude', 9, 6)

      table.decimal('valorkm', 3, 3)
      table.decimal('kmlitro', 3, 3)

      table.timestamps()
    })
  }

  down () {
    this.drop('trajetos')
  }
}

module.exports = TrajetoSchema
