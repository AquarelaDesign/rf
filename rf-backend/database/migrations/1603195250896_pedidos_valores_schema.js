'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PedidosValoresSchema extends Schema {
  up () {
    this.create('pedidos_valores', (table) => {
      table.increments()
      table.integer('pedido_id').notNullable()
      table.integer('cliente_id')
      table.decimal('veiculos', 9, 2).defaultTo(0)
      table.decimal('transporte_rotas', 9, 2).defaultTo(0)
      table.decimal('seguro', 9, 2).defaultTo(0)
      table.decimal('seguro_roubo', 9, 2).defaultTo(0)
      table.decimal('custo_operacional', 9, 2).defaultTo(0)
      table.decimal('impostos', 9, 2).defaultTo(0)
      table.decimal('percentual_desconto', 9, 2).defaultTo(0)
      table.decimal('desconto', 9, 2).defaultTo(0)
      table.decimal('total', 9, 2).defaultTo(0)
      table.decimal('total_sem_desconto', 9, 2).defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('pedidos_valores')
  }
}

module.exports = PedidosValoresSchema
