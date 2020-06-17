'use strict'

class StoreUsuario {
  get rules () {
    return {
      nome: 'required',
      email: 'required|email|unique:usuarios,email',
      cpfcnpj: 'required|cpfcnpj|unique:usuarios,cpfcnpj',
      celular: 'required|integer',
      telefone: 'integer',
      logradouro: 'required',
      bairro: 'required',
      cidade: 'required',
      uf: 'required',
      cep: 'required|cep|integer',
      tipo: 'required'
    }
  }
  
  get messages () {
    return {
      'nome.required': 'Você deve fornecer um Nome/Razão Social',
      'email.required': 'Você deve fornecer um endereço de email.',
      'email.email': 'Você deve fornecer um endereço de email válido.',
      'email.unique': 'Este e-mail já está registado.',
      'cpfcnpj.required': 'Você deve fornecer uma CPF/CNPJ',
      'cpfcnpj.unique': 'Este CPF/CNPJ já está registado.',
      'celular.required': 'Você deve fornecer um Número de Celular',
      'celular.integer': 'somente números inteiros são permitidos como Celular',
      'telefone.integer': 'somente números inteiros são permitidos como Telefone',
      'logradouro.required': 'Você deve fornecer um Endereço',
      'bairro.required': 'Você deve fornecer um Bairro',
      'cidade.required': 'Você deve fornecer uma Cidade',
      'uf.required': 'Você deve fornecer uma UF/Estado',
      'cep.required': 'Você deve fornecer um CEP',
      'cep.integer': 'somente números inteiros são permitidos como CEP',
      'tipo.required': 'Você deve fornecer um Tipo ([O]perador, [M]otorista ou [C]liente)'
    }
  }
  
}

module.exports = StoreUsuario
