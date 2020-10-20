'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Pedido = use('App/Models/PedidosValore')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with pedidosvalores
 */
class PedidosValoreController {
  /**
   * Show a list of all pedidosvalores.
   * GET pedidosvalores
   */
  async index({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const pedidosvalores = Pedido.all()
    return pedidosvalores
  }

  /**
   * Show a list of rota with pedido.
   * POST buscavalped/:id
   */
  async busca({auth, params, request, response}) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    try {    
      const query = Pedido.query()
      if (params.id !== null){
        query.andWhere('pedido_id','=', params.id)
      }
      const pedidosvalores = await query.fetch()
      return pedidosvalores

    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Rota não encontrada ${e}`
      })
    }

  }

  /**
   * Create/save a new pedidosvalore.
   * POST pedidosvalores
   */
  async store({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const data = request.only([
      "pedido_id", 
      "cliente_id",
      "veiculos",
      "transporte_rotas",
      "seguro",
      "seguro_roubo",
      "custo_operacional",
      "impostos",
      "percentual_desconto",
      "desconto",
      "total",
      "total_sem_desconto",
    ])

    const pedidosvalores = await Pedido.create(data)
    return pedidosvalores
  }

  /**
   * Display a single pedidosvalore.
   * GET pedidosvalores/:id
   */
  async show({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {  
      const pedidosvalores = await Pedido.findOrFail(params.id)
      return pedidosvalores
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Update pedidosvalore details.
   * PUT or PATCH pedidosvalores/:id
   */
  async update({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const pedidosvalores = await Pedido.findOrFail(params.id);
    const data = request.only([
      "pedido_id", 
      "cliente_id",
      "veiculos",
      "transporte_rotas",
      "seguro",
      "seguro_roubo",
      "custo_operacional",
      "impostos",
      "percentual_desconto",
      "desconto",
      "total",
      "total_sem_desconto",
    ])

    try {
      pedidosvalores.merge(data)
      await pedidosvalores.save()
      return pedidosvalores
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Delete a pedidosvalore with id.
   * DELETE pedidosvalores/:id
   */
  async destroy({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const pedidosvalores = await Pedido.findOrFail(params.id)
      await pedidosvalores.delete()
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

module.exports = PedidosValoreController
