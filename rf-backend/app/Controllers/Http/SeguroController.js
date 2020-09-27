'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Seguro = use('App/Models/Seguro')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with seguros
 */
class SeguroController {
  /**
   * Show a list of all seguros.
   * GET seguros
   */
  async index ({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const seguro = Seguro.all()
    return seguro
  }

  /**
   * Create/save a new seguro.
   * POST seguros
   */
  async store({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const data = request.only([
      "uf", 
      "ac",
      "al",
      "ap",
      "am",
      "ba",
      "ce",
      "df",
      "es",
      "go",
      "ma",
      "mt",
      "ms",
      "mg",
      "pa",
      "pb",
      "pr",
      "pe",
      "pi",
      "rj",
      "rn",
      "rs",
      "ro",
      "rr",
      "sc",
      "sp",
      "se",
      "to",
    ])

    const seguros = await Seguro.create(data)
    return seguros
  }

  /**
   * Display a single seguro.
   * GET seguros/:id
   */
  async show({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const seguros = await Seguro.findOrFail(params.id)
      return seguros
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Update seguro details.
   * PUT or PATCH seguros/:id
   */
  async update({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const seguros = await Seguro.findOrFail(params.id);
    const data = request.only([
      "uf", 
      "ac",
      "al",
      "ap",
      "am",
      "ba",
      "ce",
      "df",
      "es",
      "go",
      "ma",
      "mt",
      "ms",
      "mg",
      "pa",
      "pb",
      "pr",
      "pe",
      "pi",
      "rj",
      "rn",
      "rs",
      "ro",
      "rr",
      "sc",
      "sp",
      "se",
      "to",
    ])

    try {
      seguros.merge(data)
      await seguros.save()
      return seguros
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Delete a seguro with id.
   * DELETE seguros/:id
   */
  async destroy({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const seguros = await Seguro.findOrFail(params.id)
      await seguros.delete()
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

module.exports = SeguroController
