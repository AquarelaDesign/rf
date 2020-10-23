'use strict'

class StoreEmpresa {
  get rules () {
    return {
      // razaosocial: 'required',
      // email: 'required|email',
      // cnpj: 'required|cnpj|unique:empresas,cnpj',
      email: 'email',
      cnpj: 'cnpj|unique:empresas,cnpj',
    }
  }
  
  get messages () {
    return {
      // 'razaosocial.required': 'Você deve fornecer uma Razão Social',
      // 'email.required': 'Você deve fornecer um endereço de email.',
      'email.email': 'Você deve fornecer um endereço de email válido.',
      // 'cnpj.required': 'Você deve fornecer uma CNPJ',
      'cnpj.unique': 'Este CNPJ já está registado.',
    }
  }
  
}

module.exports = StoreEmpresa
