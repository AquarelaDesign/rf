'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Veiculo extends Model {
  pedidos() {
    return this.belongsTo('App/Models/Pedido')
  }

  images() {
    return this.hasMany('App/Models/Image')
  }
}

module.exports = Veiculo
