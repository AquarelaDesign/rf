'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Fiscal = use('App/Models/Fiscal')
const Usuario = use('App/Models/Usuario')
// const Event = use('Event')

/**
 * Resourceful controller for interacting with fiscals
 */
class FiscalController {
  /**
   * Show a list of all fiscals.
   * GET fiscals
   */
  async index ({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    try {    
      const fiscals = Fiscal.all()
      return fiscals
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum controle encontrado`
      })
    }

  }

  /**
   * Show a list of fiscals with parameters.
   * POST fiscals
   */
  async busca ({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    const condicoes = request.only([
      "tipo", 
      "pedido_id",
      "cliente_id",
      "status",
    ])

    try {    
      const query = Fiscal.query()
      if (condicoes.tipo !== null){
        query.andWhere('tipo','=',condicoes.tipo)
      }
      if (condicoes.pedido_id !== null){
        query.andWhere('pedido_id','=',condicoes.pedido_id)
      }
      if (condicoes.cliente_id !== null){
        query.andWhere('cliente_id','=',condicoes.cliente_id)
      }
      if (condicoes.status !== null){
        query.andWhere('status','=',condicoes.status)
      }
      const fiscal = await query.fetch()
      return fiscal
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum controle encontrado`
      })
    }
  }

  /**
   * Create/save a new fiscal.
   * POST fiscals
   */
  async store ({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const data = request.only([
      "tipo", 
      "pedido_id",
      "cliente_id", 
      "motorista_id",
      "valor",
      "status",
    ])
    
    try {
      const fiscals = await Fiscal.create(data)
      return fiscals
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum controle encontrado`
      })
    }
  }

  /**
   * Display a single fiscal.
   * GET fiscals/:id
   */
  async show ({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    
    try {
      const fiscals = await Fiscal.findOrFail(params.id)
      return fiscals
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum controle encontrado`
      })
    }
  }

  /**
   * Update fiscal details.
   * PUT or PATCH fiscals/:id
   */
  async update ({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const fiscals = await Fiscal.findOrFail(params.id);
      const data = request.only([
        "tipo", 
        "pedido_id",
        "cliente_id",
        "motorista_id",
        "valor",
        "status",
      ])
        
      fiscals.merge(data)
      await fiscals.save()
      return fiscals
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Controle não encontrado`
      })
    }
  }

  /**
   * Delete a fiscal with id.
   * DELETE fiscals/:id
   */
  async destroy ({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const fiscals = await Fiscal.findOrFail(params.id)
      await fiscals.delete()    
      return response.status(200).send({
        status: 200,
        message: `Registro excluído com sucesso`
      })
    } catch (e) {
      return response.status(404).send({
        status: 404,
        message: `Fiscal não encontrado`
      })
    }
  }
}

module.exports = FiscalController
