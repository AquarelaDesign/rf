'use strict'

const { isCPF, isCNPJ, isPhone, isCEP } = require('brazilian-values');

const { ServiceProvider } = require('@adonisjs/fold')

class CadastroProvider extends ServiceProvider {
  
  async isCpfCorrect(data, field, message, args, get) {
    const cpfcnpj = get(data, field);

    if(!cpfcnpj){
       return
    }

    if (!isCPF(cpfcnpj)) {
      if (!isCNPJ(cpfcnpj)) {
        throw 'CPF/CNPJ Inválido!';
      }
    }

  }

  async isCepCorrect(data, field, message, args, get) {
    const cep = get(data, field);

    if(!cep){
       return
    }

    if (!isCEP(cep)) {
      throw 'CEP Inválido!';
    }

  }

  async isPhoneCorrect(data, field, message, args, get) {
    const phone = get(data, field);

    if(!phone){
      return
    }

   switch (field) {
      case 'celular':
        if (!isPhone(phone)) {
          throw 'Número do Celular Inválido!';
        }
        break;
      case 'telefone':
        if (!isPhone(phone)) {
          throw 'Número do Telefone Inválido!';
        }
        break;
      case 'whats':
        if (!isPhone(phone)) {
          throw 'Número do WhatsApp Inválido!';
        }
        break;
      default:
        throw `O campo "${field}" não foi reconhecido`;
    }
  }

  boot () {
    const Validator = use('Validator');
    Validator.extend('cpfcnpj', this.isCpfCorrect);
    Validator.extend('cep', this.isCepCorrect);
    Validator.extend('celular', this.isPhoneCorrect);
    Validator.extend('telefone', this.isPhoneCorrect);
    Validator.extend('whats', this.isPhoneCorrect);
  }
}

module.exports = CadastroProvider
