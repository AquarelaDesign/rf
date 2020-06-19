'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImagevmSchema extends Schema {
  up () {
    this.create('imagevms', (table) => {
      table.increments()
      table.integer('veiculos_motorista_id')
        .unsigned()
        .references('id')
        .inTable('veiculos_motoristas')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('path').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('imagevms')
  }
}

module.exports = ImagevmSchema
