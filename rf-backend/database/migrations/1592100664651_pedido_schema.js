'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PedidoSchema extends Schema {
  up () {
    this.create('pedidos', (table) => {
      table.increments()
      table.string('tipo').defaultTo('C')
      table.string('local').defaultTo('')
      table.integer('cliente_id')
      table.integer('motorista_id')
      table.date('limitecoleta')
      table.date('limiteentrega')
      table.string('rota').defaultTo('')
      table.integer('localcoleta')
      table.integer('localentrega')
      table.enu('status', ['','D','A','C','T','O','E','X'])
        .defaultTo('')
        .comment('[]Em Manutenção, [D]isponivel,[A]guardando, Em [C]oleta, Em [T]ransporte, Em c[O]nferencia, [E]ntregue, [X]Cancelado')
      table.decimal('valor', 9, 2).defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('pedidos')
  }
}

module.exports = PedidoSchema
