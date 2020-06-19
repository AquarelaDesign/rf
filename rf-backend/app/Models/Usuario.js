'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Usuario extends Model {
  veiculos() {
    return this.hasMany('App/Models/VeiculosMotorista')
  }
}

module.exports = Usuario
