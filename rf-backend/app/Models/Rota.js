'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Rota extends Model {
  rotas() {
    return this.belongsTo('App/Models/Pedido')
  }
}

module.exports = Rota
