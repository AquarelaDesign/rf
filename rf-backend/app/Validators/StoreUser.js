'use strict'

class StoreUser {
  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required|min:6|max:12'
    }
  }

  get messages () {
    return {
      'email.required': 'Você deve fornecer um endereço de email.',
      'email.email': 'Você deve fornecer um endereço de email válido.',
      'email.unique': 'Este e-mail já está registado.',
      'password.required': 'Você deve fornecer sua Senha',
      'password.min': 'A Senha deve ter no mínimo 6 (seis) caracteres alfanuméricos',
      'password.max': 'A Senha deve ter no máximo 12 (doze) caracteres alfanuméricos'
    }
  }


}

module.exports = StoreUser
