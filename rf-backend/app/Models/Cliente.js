'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Cliente extends Model {
    user () {
        return this.belongsTo('App/Models/User')
    }

    enderecos () {
        return this.hasMany("App/Models/Endereco")
    }
    
    cartaos () {
        return this.hasMany("App/Models/Cartao")
    }
    
    veiculos () {
        return this.hasMany("App/Models/Veiculo")
    }
    
    cotacaos () {
        return this.hasMany("App/Models/Cotacao")
    }
    
}

module.exports = Cliente
