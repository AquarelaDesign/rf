'use strict'

class StoreRotaPedido {
  get rules () {
    return {
      cpfcnpj: 'cpfcnpj',
      email_origem: 'email',
      celular_origem: 'integer',
      telefone_origem: 'integer',
      cep_origem: 'cep|integer',
      email_destino: 'email',
      celular_destino: 'integer',
      telefone_destino: 'integer',
      cep_destino: 'cep|integer',
    }
  }
  
  get messages () {
    return {
      'email_origem.email': 'Você deve fornecer um endereço de email válido.',
      'celular_origem.integer': 'somente números inteiros são permitidos como Celular',
      'telefone_origem.integer': 'somente números inteiros são permitidos como Telefone',
      'cep_origem.integer': 'somente números inteiros são permitidos como CEP',
      'email_destino.email': 'Você deve fornecer um endereço de email válido.',
      'celular_destino.integer': 'somente números inteiros são permitidos como Celular',
      'telefone_destino.integer': 'somente números inteiros são permitidos como Telefone',
      'cep_destino.integer': 'somente números inteiros são permitidos como CEP',
    }
  }
  
}

module.exports = StoreRotaPedido
