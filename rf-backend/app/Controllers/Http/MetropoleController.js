'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Metropole = use('App/Models/Metropole')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with metropoles
 */
class MetropoleController {
  /**
   * Show a list of all metropoles.
   * GET metropoles
   */
  async index ({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const metropoles = Metropole.all()
    return metropoles
  }

  /**
   * Create/save a new metropole.
   * POST metropoles
   */
  async store({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const data = request.only([
      "nome", 
    ])

    const metropoles = await Metropole.create(data)
    return metropoles
  }

  /**
   * Display a single metropole.
   * GET metropoles/:id
   */
  async show({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const metropoles = await Metropole.findOrFail(params.id)
      return metropoles
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Update metropole details.
   * PUT or PATCH metropoles/:id
   */
  async update({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const metropoles = await Metropole.findOrFail(params.id);
    const data = request.only([
      "nome", 
    ])

    try {  
      metropoles.merge(data)
      await metropoles.save()
      return metropoles
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }
  }

  /**
   * Delete a metropole with id.
   * DELETE metropoles/:id
   */
  async destroy({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const metropoles = await Metropole.findOrFail(params.id)
      await metropoles.delete()
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

module.exports = MetropoleController
