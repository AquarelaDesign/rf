'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ValoresAdicionais = use('App/Models/ValoresAdicionai')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with valoresadicionais
 */
class ValoresAdicionaiController {
  /**
   * Show a list of all valoresadicionais.
   * GET valoresadicionais
   */
  async index ({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const valoresadicionais = ValoresAdicionais.all()
    return valoresadicionais
  }

  /**
   * Create/save a new valoresadicionai.
   * POST valoresadicionais
   */
  async store({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const data = request.only([
      "tipo", 
      "nome",
      "valor",
      "imposto",
      "exclusivo",
      "mostra",
      "cortesia",
    ])

    const valoresadicionais = await ValoresAdicionais.create(data)
    return valoresadicionais
  }

  /**
   * Display a single valoresadicionai.
   * GET valoresadicionais/:id
   */
  async show({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const valoresadicionais = await ValoresAdicionais.findOrFail(params.id)
      return valoresadicionais
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Update valoresadicionai details.
   * PUT or PATCH valoresadicionais/:id
   */
  async update({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const valoresadicionais = await ValoresAdicionais.findOrFail(params.id);
    const data = request.only([
      "tipo", 
      "nome",
      "valor",
      "imposto",
      "exclusivo",
      "mostra",
      "cortesia",
    ])

    try {
      valoresadicionais.merge(data)
      await valoresadicionais.save()
      return valoresadicionais
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Delete a valoresadicionai with id.
   * DELETE valoresadicionais/:id
   */
  async destroy({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const valoresadicionais = await ValoresAdicionais.findOrFail(params.id)
      await valoresadicionais.delete()
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

module.exports = ValoresAdicionaiController
