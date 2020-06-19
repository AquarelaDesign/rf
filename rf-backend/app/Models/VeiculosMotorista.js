'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class VeiculosMotorista extends Model {
  imagevms() {
    return this.hasMany('App/Models/Imagevm')
  }
}

module.exports = VeiculosMotorista
