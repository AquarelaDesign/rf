'use strict'

class StoreUsuario {
  get rules () {
    return {
      email: 'email',
      cpfcnpj: 'cpfcnpj',
      celular: 'integer',
      telefone: 'integer',
      cep: 'cep|integer'
    }
  }
  
  get messages () {
    return {
      'email.email': 'Você deve fornecer um endereço de email válido.',
      'celular.integer': 'somente números inteiros são permitidos como Celular',
      'telefone.integer': 'somente números inteiros são permitidos como Telefone',
      'cep.integer': 'somente números inteiros são permitidos como CEP'
    }
  }
  
}

module.exports = StoreUsuario
