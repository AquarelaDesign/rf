'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Financeiro = use('App/Models/Financeiro')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with financeiros
 */
class FinanceiroController {
  /**
   * Show a list of all financeiros.
   * GET financeiros
   */
  async index ({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    try {    
      const financeiros = Financeiro.query()
                                    .with('avarias')
                                    .fetch()
      return financeiros
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum controle encontrado`
      })
    }

  }

  /**
   * Show a list of financeiros with financeiro.
   * POST financeiros
   */
  async busca({auth, params, request, response}) {
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
      "motorista_id",
      "operador_id",
      "fornecedor_id",
      "status",
    ])

    try {    
      const query = Financeiro.query()
      if (condicoes.tipo !== null){
        query.andWhere('tipo','=',condicoes.tipo)
      }
      if (condicoes.pedido_id !== null){
        query.andWhere('pedido_id','=',condicoes.pedido_id)
      }
      if (condicoes.cliente_id !== null){
        query.andWhere('cliente_id','=',condicoes.cliente_id)
      }
      if (condicoes.motorista_id !== null){
        query.andWhere('motorista_id','=',condicoes.motorista_id)
      }
      if (condicoes.operador_id !== null){
        query.andWhere('operador_id','=',condicoes.operador_id)
      }
      if (condicoes.fornecedor_id !== null){
        query.andWhere('fornecedor_id','=',condicoes.fornecedor_id)
      }
      if (condicoes.status !== null){
        query.andWhere('status','=',condicoes.status)
      }
      query
        .with('avarias')
      
      const financeiros = await query.fetch()
      return financeiros
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Financeiro não encontrada ${e}`
      })
    }
  }

  /**
   * Create/save a new fiscal.
   * POST financeiros
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
      "operador_id",
      "fornecedor_id",
      "valor",
      "status",
    ])
    
    try {
      const financeiros = await Financeiro.create(data)
      await financeiros.load('avarias')
      return financeiros
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum controle encontrado`
      })
    }
  }

  /**
   * Display a single financeiro.
   * GET financeiros/:id
   */
  async show ({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    
    try {
      const financeiros = await Financeiro.findOrFail(params.id)
      await financeiros.load('avarias')
      return financeiros
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum controle encontrado`
      })
    }
  }

  /**
   * Update financeiro details.
   * PUT or PATCH financeiros/:id
   */
  async update ({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const financeiros = await Financeiro.findOrFail(params.id);
      const data = request.only([
        "tipo", 
        "pedido_id",
        "cliente_id", 
        "motorista_id",
        "operador_id",
        "fornecedor_id",
        "valor",
        "status",
        ])
        
      financeiros.merge(data)
      await financeiros.save()
      await financeiros.load('avarias')
      return financeiros
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Controle não encontrado`
      })
    }
  }

  /**
   * Delete a financeiro with id.
   * DELETE financeiros/:id
   */
  async destroy ({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const financeiros = await Financeiro.findOrFail(params.id)
      await financeiros.delete()    
      return response.status(200).send({
        status: 200,
        message: `Registro excluído com sucesso`
      })
    } catch (e) {
      return response.status(404).send({
        status: 404,
        message: `Financeiro não encontrado`
      })
    }
  }
}

module.exports = FinanceiroController
