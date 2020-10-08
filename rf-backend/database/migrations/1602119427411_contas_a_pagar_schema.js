'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContasAPagarSchema extends Schema {
  up () {
    this.create('contas_a_pagars', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('contas_a_pagars')
  }
}

module.exports = ContasAPagarSchema
