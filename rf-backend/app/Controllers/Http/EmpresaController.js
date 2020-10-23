'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Empresa = use('App/Models/Empresa')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with empresas
 */
class EmpresaController {
  /**
   * Show a list of all empresas.
   * GET empresas
   */
  async index({ auth, response }) {
    // const usuarios = await Usuario.findOrFail(auth.user.id)
    // if (usuarios.tipo !== 'O') {
    //   return response.status(401).send({ 
    //     error: `Não autorizado [${usuarios.tipo}]`
    //   })
    // }
  
    const empresas = Empresa.all()
    return empresas
  }

  /**
   * Create/save a new empresa.
   * POST empresas
   */
  async store({ auth, request, response }) {
    // const usuarios = await Usuario.findOrFail(auth.user.id)
    // if (usuarios.tipo !== 'O') {
    //   return response.status(401).send({ 
    //     error: `Não autorizado [${usuarios.tipo}]`
    //   })
    // }
  
    const data = request.only([
      "cnpj",
      "razaosocial",
      "nomefantasia",
      "slogan",
      "ie",
      "contato",
      "celular",
      "whats",
      "telefone",
      "telefone1",
      "telefone2",
      "facebook",
      "instagram",
      "email",
      "codigopush",
      "logradouro",
      "numero",
      "complemento",
      "bairro",
      "codigocidade",
      "cidade",
      "codigouf",
      "uf",
      "codigopais",
      "pais",
      "cep",
      "certificado",
      "senha_cd",
      "tp_amb_cte",
      "tp_amb_nfe",
      "tp_amb_nfce",
      "schemes_cte",
      "schemes_nfe",
      "schemes_nfce",
      "versao_cte",
      "versao_nfe",
      "versao_nfce",
      "logo_login",
      "logo_header",
    ])

    const empresas = await Empresa.create(data)
    return empresas
  }

  /**
   * Display a single empresa.
   * GET empresas/:id
   */
  async show({ auth, params, response }) {
    // const usuarios = await Usuario.findOrFail(auth.user.id)
    // if (usuarios.tipo !== 'O') {
    //   return response.status(401).send({ 
    //     error: `Não autorizado [${usuarios.tipo}]`
    //   })
    // }
  
    try {  
      const empresas = await Empresa.findOrFail(params.id)
      return empresas
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Update empresa details.
   * PUT or PATCH empresas/:id
   */
  async update({ auth, params, request, response }) {
    // const usuarios = await Usuario.findOrFail(auth.user.id)
    // if (usuarios.tipo !== 'O') {
    //   return response.status(401).send({ 
    //     error: `Não autorizado [${usuarios.tipo}]`
    //   })
    // }
  
    const empresas = await Empresa.findOrFail(params.id);
    const data = request.only([
      "cnpj",
      "razaosocial",
      "nomefantasia",
      "slogan",
      "ie",
      "contato",
      "celular",
      "whats",
      "telefone",
      "telefone1",
      "telefone2",
      "facebook",
      "instagram",
      "email",
      "codigopush",
      "logradouro",
      "numero",
      "complemento",
      "bairro",
      "codigocidade",
      "cidade",
      "codigouf",
      "uf",
      "codigopais",
      "pais",
      "cep",
      "certificado",
      "senha_cd",
      "tp_amb_cte",
      "tp_amb_nfe",
      "tp_amb_nfce",
      "schemes_cte",
      "schemes_nfe",
      "schemes_nfce",
      "versao_cte",
      "versao_nfe",
      "versao_nfce",
      "logo_login",
      "logo_header",
    ])

    try {
      empresas.merge(data)
      await empresas.save()
      return empresas
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Delete a empresa with id.
   * DELETE empresas/:id
   */
  async destroy({ params, auth, response }) {
    // const usuarios = await Usuario.findOrFail(auth.user.id)
    // if (usuarios.tipo !== 'O') {
    //   return response.status(401).send({ 
    //     error: `Não autorizado [${usuarios.tipo}]`
    //   })
    // }
  
    try {
      const empresas = await Empresa.findOrFail(params.id)
      await empresas.delete()
      return response.status(200).send({
        status: 200,
        message: `Registro excluído com sucesso`
      })
    } catch (e) {
      return response.status(404).send({
        status: 404,
        message: `O registro não existe`
      })
    }
  }
}

module.exports = EmpresaController
