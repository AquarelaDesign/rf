'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Historico = use('App/Models/Historico')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with historicos
 */
class HistoricoController {
  /**
   * Show a list of all historicos.
   * GET historicos
   */
  async index({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const historicos = Historico.all()
    return historicos
  }

  /**
   * Show a list of historicos with parameters.
   * GET historicos/:id
   */
  async busca({auth, request, response}) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    const condicoes = request.only([
      "motorista_id",
      "cliente_id",
      "operador_id",
      "pedido_id",
      "titulo_pagar_id",
      "titulo_receber_id",
    ])

    try {    
      const query = Historico.query()
      if (condicoes.motorista_id !== null){
        query.andWhere('motorista_id','=',condicoes.motorista_id)
      }
      if (condicoes.cliente_id !== null){
        query.andWhere('cliente_id','=',condicoes.cliente_id)
      }
      if (condicoes.operador_id !== null){
        query.andWhere('operador_id','=',condicoes.operador_id)
      }
      if (condicoes.pedido_id !== null){
        query.andWhere('pedido_id','=',condicoes.pedido_id)
      }
      if (condicoes.titulo_pagar_id !== null){
        query.andWhere('titulo_pagar_id','=',condicoes.titulo_pagar_id)
      }
      if (condicoes.titulo_receber_id !== null){
        query.andWhere('titulo_receber_id','=',condicoes.titulo_receber_id)
      }
      query.orderBy('updated_at', 'desc')

      const historicos = await query.fetch()
      return historicos

    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Create/save a new historico.
   * POST historicos
   */
  async store({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const data = request.only([
      "motorista_id", 
      "cliente_id",
      "operador_id",
      "pedido_id",
      "titulo_pagar_id",
      "titulo_receber_id",
      "observacao",
      "valor",
    ])

    const historicos = await Historico.create(data)
    return historicos
  }

  /**
   * Display a single historico.
   * GET historicos/:id
   */
  async show({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {  
      const historicos = await Historico.findOrFail(params.id)
      return historicos
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Update historico details.
   * PUT or PATCH historicos/:id
   */
  async update({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const historicos = await Historico.findOrFail(params.id);
    const data = request.only([
      "motorista_id", 
      "cliente_id",
      "operador_id",
      "pedido_id",
      "titulo_pagar_id",
      "titulo_receber_id",
      "observacao",
      "valor",
    ])

    try {
      historicos.merge(data)
      await historicos.save()
      return historicos
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Delete a historico with id.
   * DELETE historicos/:id
   */
  async destroy({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const historicos = await Historico.findOrFail(params.id)
      await historicos.delete()
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

module.exports = HistoricoController
