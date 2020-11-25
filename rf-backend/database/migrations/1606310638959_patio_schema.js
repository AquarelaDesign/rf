'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PatioSchema extends Schema {
  up () {
    this.create('patios', (table) => {
      table.increments()
      table.string('uf').defaultTo('')
      table.string('cidade').defaultTo('')
      table.integer('prioridade').defaultTo(0)
      table.string('nome').defaultTo('')
      table.string('cnpjcpf').defaultTo('')
      table.string('endereco').defaultTo('')
      table.string('numero').defaultTo('')
      table.string('complemento').defaultTo('')
      table.string('bairro').defaultTo('')
      table.string('cep').defaultTo('')
      table.string('contato').defaultTo(null)
      table.integer('celular').defaultTo(null)
      table.integer('celular1').defaultTo(null)
      table.integer('celular2').defaultTo(null)
      table.integer('fone').defaultTo(null)
      table.integer('fone1').defaultTo(null)
      table.integer('fone2').defaultTo(null)
      table.string('email').defaultTo('')
      table.string('email1').defaultTo('')
      table.string('email2').defaultTo('')
      table.string('atendimento').defaultTo('')
      table.decimal('valor_coleta').defaultTo(0)
      table.decimal('valor_embarque_carro').defaultTo(0)
      table.decimal('valor_embarque_van').defaultTo(0)
      table.decimal('valor_embarque_moto').defaultTo(0)
      table.decimal('valor_embarque_moto_300').defaultTo(0)
      table.integer('raio_coleta').defaultTo(0)
      table.integer('numero_diarias_gratis').defaultTo(0)
      table.decimal('diaria_carro').defaultTo(0)
      table.decimal('diaria_van').defaultTo(0)
      table.decimal('diaria_moto').defaultTo(0)
      table.decimal('diaria_moto_grande').defaultTo(0)
      table.string('motorista').defaultTo('')
      table.string('motorista_cpf').defaultTo('')
      table.string('motorista_placa').defaultTo('')
      table.string('banco').defaultTo('')
      table.string('agencia').defaultTo('')
      table.string('tipo_conta').defaultTo('')
      table.string('conta').defaultTo('')
      table.string('titular').defaultTo('')
      table.string('cpf_titular').defaultTo('')
      table.string('observacoes').defaultTo('')
      table.decimal('latitude', 9, 6).defaultTo(0)
      table.decimal('longitude', 9, 6).defaultTo(0)
      table.string('status')
        .defaultTo('A')
        .comment('[A]tivo, [I]nativo ou [B]loqueado')
      table.timestamps()
    })
  }

  down () {
    this.drop('patios')
  }
}

module.exports = PatioSchema
