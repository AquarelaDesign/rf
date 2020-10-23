'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EmpresasSchema extends Schema {
  up () {
    this.create('empresas', (table) => {
      table.increments()
      table.string('cnpj').notNullable().unique()
      table.string('razaosocial').notNullable()
      table.string('nomefantasia')
      table.string('slogan')
      table.string('ie').defaultTo('')
      table.string('contato').defaultTo('')
      table.string('celular').defaultTo('')
      table.string('whats').defaultTo('')
      table.string('telefone').defaultTo('')
      table.string('telefone1').defaultTo('')
      table.string('telefone2').defaultTo('')
      table.string('facebook').defaultTo('')
      table.string('instagram').defaultTo('')
      table.string('email').defaultTo('')
      table.string('codigopush').defaultTo('')
      table.string('logradouro').defaultTo('')
      table.string('numero').defaultTo('')
      table.string('complemento').defaultTo('')
      table.string('bairro').defaultTo('')
      table.integer('codigocidade').defaultTo(0)
      table.string('cidade').notNullable()
      table.integer('codigouf').defaultTo(0)
      table.string('uf').notNullable()
      table.integer('codigopais').defaultTo(1058)
      table.string('pais').defaultTo('')
      table.string('cep').defaultTo('')
      table.string('certificado').defaultTo('')
      table.string('senha_cd').defaultTo('')
      table.integer('tp_amb_cte').defaultTo(2).comment('1 - Producao / 2 - homologacao')
      table.integer('tp_amb_nfe').defaultTo(2).comment('1 - Producao / 2 - homologacao')
      table.integer('tp_amb_nfce').defaultTo(2).comment('1 - Producao / 2 - homologacao')
      table.string('schemes_cte').defaultTo('PL_CTe_300')
      table.string('schemes_nfe').defaultTo('')
      table.string('schemes_nfce').defaultTo('')
      table.string('versao_cte').defaultTo('3.00')
      table.string('versao_nfe').defaultTo('')
      table.string('versao_nfce').defaultTo('')
      table.string('logo_login').defaultTo('').comment('PNG L225 x A115')
      table.string('logo_header').defaultTo('').comment('PNG L120 x A120')
      table.timestamps()
    })
  }

  down () {
    this.drop('empresas')
  }
}

module.exports = EmpresasSchema
