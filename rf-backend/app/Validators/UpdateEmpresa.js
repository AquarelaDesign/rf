'use strict'

class UpdateEmpresa {
  get rules () {
    return {
      email: 'email',
      cnpj: 'cnpj|unique:empresas,cnpj',
    }
  }
  
  get messages () {
    return {
      'email.email': 'Você deve fornecer um endereço de email válido.',
      'cnpj.unique': 'Este CNPJ já está registado.',
    }
  }
  
}

module.exports = UpdateEmpresa
