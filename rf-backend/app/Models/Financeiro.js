'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Financeiro extends Model {

  avarias() {
    return this.hasMany('App/Models/Avaria')
  }

}

module.exports = Financeiro
