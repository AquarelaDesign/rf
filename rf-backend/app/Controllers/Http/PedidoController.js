'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Pedido = use('App/Models/Pedido')
const Usuario = use('App/Models/Usuario')
const Event = use('Event')

/**
 * Resourceful controller for interacting with pedidos
 */
class PedidoController {
  /**
   * Show a list of all pedidos.
   * GET pedidos
   */
  async index ({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    try {    
      const pedidos = Pedido.query()
                            .with('veiculos')
                            .with('rotas')
                            .orderBy('created_at', 'desc')
                            .fetch()
      return pedidos
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum pedido encontrado`
      })
    }

  }

  /**
   * Show a list of pedidos with parameters.
   * POST pedidos
   */
  async busca ({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    const condicoes = request.only([
      "status",
      "tipo",
      "cliente_id",
      "motorista_id",
      "id",
    ])

    try {    
      const query = Pedido.query()

      if (condicoes.status !== null && condicoes.status !== undefined) {
        query.where('status', condicoes.status)
      }

      if (condicoes.tipo !== null && condicoes.tipo !== undefined) {
        query.where('tipo', condicoes.tipo)
      }

      if (condicoes.cliente_id !== null && condicoes.cliente_id !== undefined) {
        query.where('cliente_id', condicoes.cliente_id)
      }

      if (condicoes.motorista_id !== null && condicoes.motorista_id !== undefined) {
        query.where('motorista_id', condicoes.motorista_id)
      }

      if (condicoes.id !== null && condicoes.id !== undefined) {
        query.where('id', condicoes.id)
      }

      query
        .with('veiculos')
        .with('rotas')

      const pedido = await query.fetch()
      return pedido
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum pedido encontrado`
      })
    }
  }

  /**
   * Show a list of pedido with status.
   * GET pedido
   */
  async status({auth, request, response}) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    try {    
      const query = Pedido.query()
      query.where('tipo','=',"C")
      query.andWhere('status','=',"D")
      query
        .with('veiculos')
        .with('rotas')
      const pedido = await query.fetch()
  
      Event.fire('statusp::results', pedido)
      return pedido
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Pedido não encontrado ${e}`
      })
    }

  }

  /**
   * Create/save a new pedido.
   * POST pedidos
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
      "local",
      "cliente_id",
      "motorista_id",
      "limitecoleta",
      "limiteentrega",
      "rota",
      "localcoleta",
      "localentrega",
      "status",
      "valor",
      "percentual_desconto",
      "valor_desconto",
    ])
    
    try {
      const pedidos = await Pedido.create(data)
      await pedidos.load('veiculos')
      await pedidos.load('rotas')
      return pedidos
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum pedido encontrado`
      })
    }
  }

  /**
   * Display a single pedido.
   * GET pedidos/:id
   */
  async show ({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    
    try {
      // const pedidos = await Pedido.findOrFail(params.id)
      // await pedidos.load('veiculos')
      // await pedidos.load('rotas')
      
      const query = Pedido.query()
            query.andWhere('id','=',params.id)
            query.with('veiculos')
                 .with('rotas', (builder) => {
                   builder.orderBy('rota_relacionada', 'asc') 
                 })
      const pedidos = await query.fetch()
      return pedidos
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum pedido encontrado`
      })
    }
  }

  /**
   * Update pedido details.
   * PUT or PATCH pedidos/:id
   */
  async update ({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const pedidos = await Pedido.findOrFail(params.id);
      const data = request.only([
        "tipo", 
        "local",
        "cliente_id",
        "motorista_id",
        "limitecoleta",
        "limiteentrega",
        "rota",
        "localcoleta",
        "localentrega",
        "status",
        "valor",
        "percentual_desconto",
        "valor_desconto",
        ])
        
      pedidos.merge(data)
      await pedidos.save()
      await pedidos.load('veiculos')
      await pedidos.load('rotas')
      return pedidos
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Pedido não encontrado`
      })
    }
  }

  /**
   * Delete a pedido with id.
   * DELETE pedidos/:id
   */
  async destroy ({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const pedidos = await Pedido.findOrFail(params.id)
      await pedidos.delete()    
      return response.status(200).send({
        status: 200,
        message: `Registro excluído com sucesso`
      })
    } catch (e) {
      return response.status(404).send({
        status: 404,
        message: `Pedido não encontrado`
      })
    }
  }
}

module.exports = PedidoController
