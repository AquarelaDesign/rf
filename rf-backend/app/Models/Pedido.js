'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Pedido extends Model {
  veiculos() {
    return this.hasMany('App/Models/Veiculo')
  }

  rotas() {
    return this.hasMany('App/Models/Rota')
  }

  rotaspedido() {
    return this.hasMany('App/Models/RotasPedido')
  }

}

module.exports = Pedido
