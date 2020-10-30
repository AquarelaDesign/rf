'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Avaria = use('App/Models/Avaria')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with avarias
 */
class AvariaController {
  /**
   * Show a list of all avarias.
   * GET avarias
   */
  async index ({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    try {    
      const avarias = Avaria.all()
      return avarias
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhuma avaria encontrada`
      })
    }

  }

  /**
   * Show a list of avarias with financeiro.
   * POST avarias
   */
  async busca({auth, params, request, response}) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    const condicoes = request.only([
      "pedido_id",
      "financeiro_id",
      "fornecedor_id",
      "motorista_id",
      "placa",
      "status",
    ])

    try {    
      const query = Avaria.query()
      if (condicoes.pedido_id !== null){
        query.andWhere('pedido_id','=',condicoes.pedido_id)
      }
      if (condicoes.financeiro_id !== null){
        query.andWhere('financeiro_id','=',condicoes.financeiro_id)
      }
      if (condicoes.fornecedor_id !== null){
        query.andWhere('fornecedor_id','=',condicoes.fornecedor_id)
      }
      if (condicoes.motorista_id !== null){
        query.andWhere('motorista_id','=',condicoes.motorista_id)
      }
      if (condicoes.placa !== null){
        query.andWhere('placa','=',condicoes.placa)
      }
      if (condicoes.status !== null){
        query.andWhere('status','=',condicoes.status)
      }
      const avarias = await query.fetch()
      return avarias
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Avaria não encontrada ${e}`
      })
    }

  }

  /**
   * Create/save a new avaria.
   * POST avarias
   */
  async store ({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const data = request.only([
      "pedido_id",
      "financeiro_id",
      "fornecedor_id",
      "motorista_id",
      "placa",
      "descricao",
      "valor",
      "status",
  ])
    
    try {
      const avarias = await Avaria.create(data)
      return avarias
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhuma avaria encontrada`
      })
    }
  }

  /**
   * Display a single avaria.
   * GET avarias/:id
   */
  async show ({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    
    try {
      const avarias = await Avaria.findOrFail(params.id)
      return avarias
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhuma avaria encontrada`
      })
    }
  }

  /**
   * Update avaria details.
   * PUT or PATCH avarias/:id
   */
  async update ({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const avarias = await Avaria.findOrFail(params.id)
      const data = request.only([
        "pedido_id",
        "financeiro_id",
        "fornecedor_id",
        "motorista_id",
        "placa",
        "descricao",
        "valor",
        "status",
        ])
        
      avarias.merge(data)
      await avarias.save()
      return avarias
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Avaria não encontrada`
      })
    }
  }

  /**
   * Delete a avaria with id.
   * DELETE avarias/:id
   */
  async destroy ({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const avarias = await Avaria.findOrFail(params.id)
      await avarias.delete()    
      return response.status(200).send({
        status: 200,
        message: `Registro excluído com sucesso`
      })
    } catch (e) {
      return response.status(404).send({
        status: 404,
        message: `Avaria não encontrada`
      })
    }
  }
}

module.exports = AvariaController
