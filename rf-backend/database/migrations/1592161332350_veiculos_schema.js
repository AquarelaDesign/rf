'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VeiculosSchema extends Schema {
  up () {
    this.create('veiculos', (table) => {
      table.increments()
      table.integer('pedido_id')
        .unsigned()
        .references('id')
        .inTable('pedidos')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('placachassi').notNullable().defaultTo('')
      table.string('modelo').notNullable().defaultTo('')
      table.enu('estado', ['Funcionando','Pane','Sinistrado']).defaultTo('Funcionando')
      table.integer('ano').defaultTo(0)
      table.decimal('valor', 18, 2).defaultTo(0)
      table.string('fipe').defaultTo('')
      table.string('fipe_tipo').defaultTo('')
      table.integer('fipe_marca_id').defaultTo(0)
      table.integer('fipe_modelo_id').defaultTo(0)
      table.string('fipe_ano_id').defaultTo('')
      table.timestamps()
    })
  }

  down () {
    this.drop('veiculos')
  }
}

module.exports = VeiculosSchema
