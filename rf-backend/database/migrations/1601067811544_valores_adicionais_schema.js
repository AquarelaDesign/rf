'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ValoresAdicionaisSchema extends Schema {
  up () {
    this.create('valores_adicionais', (table) => {
      table.increments()
      table.integer('tipo_de_veiculo_id')
        .unsigned()
        .references('id')
        .inTable('tipos_de_veiculos')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('tipo').notNullable().defaultTo('')
      table.string('nome').notNullable().defaultTo('')
      table.decimal('valor', 9, 2).defaultTo(0)
      table.boolean('imposto').defaultTo(false)
      table.boolean('exclusivo').defaultTo(false)
      table.boolean('mostra').defaultTo(true)
      table.boolean('cortesia').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('valores_adicionais')
  }
}

module.exports = ValoresAdicionaisSchema
