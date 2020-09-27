'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const TiposDeVeiculo = use('App/Models/TiposDeVeiculo')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with tiposdeveiculos
 */
class TiposDeVeiculoController {
  /**
   * Show a list of all tiposdeveiculos.
   * GET tiposdeveiculos
   */
  async index ({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const tiposdeveiculos = TiposDeVeiculo.all()
    return tiposdeveiculos
  }

  /**
   * Create/save a new tiposdeveiculo.
   * POST tiposdeveiculos
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
    ])

    const tiposdeveiculos = await TiposDeVeiculo.create(data)
    return tiposdeveiculos
  }

  /**
   * Display a single tiposdeveiculo.
   * GET tiposdeveiculos/:id
   */
  async show({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {  
      const tiposdeveiculos = await TiposDeVeiculo.findOrFail(params.id)
      return tiposdeveiculos
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }
}

  /**
   * Update tiposdeveiculo details.
   * PUT or PATCH tiposdeveiculos/:id
   */
  async update({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const tiposdeveiculos = await TiposDeVeiculo.findOrFail(params.id);
    const data = request.only([
      "tipo",
      "nome",
    ])

    try {
      tiposdeveiculos.merge(data)
      await tiposdeveiculos.save()
      return tiposdeveiculos
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Delete a tiposdeveiculo with id.
   * DELETE tiposdeveiculos/:id
   */
  async destroy({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const tiposdeveiculos = await TiposDeVeiculo.findOrFail(params.id)
      await tiposdeveiculos.delete()
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

module.exports = TiposDeVeiculoController
