'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VeiculosMotoristaSchema extends Schema {
  up () {
    this.create('veiculos_motoristas', (table) => {
      table.increments()
      table.integer('usuario_id')
        .unsigned()
        .references('id')
        .inTable('usuarios')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('placachassi').notNullable().defaultTo('')
      table.string('modelo').notNullable().defaultTo('')
      table.integer('ano').defaultTo(0)
      table.integer('vagas').defaultTo(0)
      table.string('tipo').defaultTo(0)
      table.string('habilitacao').defaultTo('') 
      table.string('habilitacaoimg').defaultTo('')
      table.date('habilitacaovct')
      table.string('cavalo').defaultTo('') 
      table.string('cavaloimg').defaultTo('')
      table.date('cavalovct')
      table.string('carreta').defaultTo('') 
      table.string('carretaimg').defaultTo('')
      table.date('carretavct')
      table.string('carreta1').defaultTo('') 
      table.string('carreta1img').defaultTo('')
      table.date('carreta1vct')
      table.string('ANTT').defaultTo('') 
      table.string('ANTTimg').defaultTo('')
      table.date('ANTTvct')
      table.timestamps()
    })
  }

  down () {
    this.drop('veiculos_motoristas')
  }
}

module.exports = VeiculosMotoristaSchema
