'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Pedido = use('App/Models/Pedido')
const Usuario = use('App/Models/Usuario')

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

    const pedidos = Pedido.query()
                          .with('veiculos')
                          .with('rotas')
                          .fetch()
    // await pedidos.load('veiculos')
    // await pedidos.load('rotas')
    return pedidos
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
    ])

    const pedidos = await Pedido.create(data)
    return pedidos
  }

  /**
   * Display a single pedido.
   * GET pedidos/:id
   */
  async show ({ auth, params }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const pedidos = await Pedido.findOrFail(params.id)
    await pedidos.load('veiculos')
    await pedidos.load('rotas')
    return pedidos
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
    ])
      
    pedidos.merge(data)
    await pedidos.save()
    return pedidos
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
        message: `O registro não existe`
      })
    }
  }
}

module.exports = PedidoController
