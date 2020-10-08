'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const RotaPedido = use('App/Models/RotasPedido')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with rotaspedidos
 */
class RotasPedidoController {
  /**
   * Show a list of all rotaspedidos.
   * GET rotaspedidos
   */
  async index({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const rotaspedidos = RotaPedido.all()
    return rotaspedidos
  }

  /**
   * Show a list of rota with pedido.
   * GET rotas/:id
   */
  async busca({auth, params, request, response}) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    try {    
      const query = RotaPedido.query()
      if (params.id !== null){
        query.andWhere('pedido_id','=', params.id)
      }
      const rotaspedidos = await query.fetch()
      return rotaspedidos

    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Rota não encontrada ${e}`
      })
    }

  }

  /**
   * Create/save a new rotaspedido.
   * POST rotaspedidos
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
      "nome", 
      "cpfcnpj",
      "motorista_id",
      "ordem",
      "logradouro_origem",
      "numero_origem",
      "complemento_origem",
      "bairro_origem",
      "cidade_origem",
      "uf_origem",
      "pais_origem",
      "cep_origem",
      "contato_origem",
      "celular_origem",
      "telefone_origem",
      "whats_origem",
      "email_origem",
      "latitude_origem",
      "longitude_origem",
      "logradouro_destino",
      "numero_destino",
      "complemento_destino",
      "bairro_destino",
      "cidade_destino",
      "uf_destino",
      "pais_destino",
      "cep_destino",
      "contato_destino",
      "celular_destino",
      "telefone_destino",
      "whats_destino",
      "email_destino",
      "latitude_destino",
      "longitude_destino",
      "status",
    ])

    const rotaspedidos = await RotaPedido.create(data)
    return rotaspedidos
  }

  /**
   * Display a single rotaspedido.
   * GET rotaspedidos/:id
   */
  async show({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {  
      const rotaspedidos = await RotaPedido.findOrFail(params.id)
      return rotaspedidos
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Update rotaspedido details.
   * PUT or PATCH rotaspedidos/:id
   */
  async update({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const rotaspedidos = await RotaPedido.findOrFail(params.id);
    const data = request.only([
      "pedido_id", 
      "nome", 
      "cpfcnpj",
      "motorista_id",
      "ordem",
      "logradouro_origem",
      "numero_origem",
      "complemento_origem",
      "bairro_origem",
      "cidade_origem",
      "uf_origem",
      "pais_origem",
      "cep_origem",
      "contato_origem",
      "celular_origem",
      "telefone_origem",
      "whats_origem",
      "email_origem",
      "latitude_origem",
      "longitude_origem",
      "logradouro_destino",
      "numero_destino",
      "complemento_destino",
      "bairro_destino",
      "cidade_destino",
      "uf_destino",
      "pais_destino",
      "cep_destino",
      "contato_destino",
      "celular_destino",
      "telefone_destino",
      "whats_destino",
      "email_destino",
      "latitude_destino",
      "longitude_destino",
      "status",
    ])

    try {
      rotaspedidos.merge(data)
      await rotaspedidos.save()
      return rotaspedidos
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Delete a rotaspedido with id.
   * DELETE rotaspedidos/:id
   */
  async destroy({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const rotaspedidos = await RotaPedido.findOrFail(params.id)
      await rotaspedidos.delete()
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

module.exports = RotasPedidoController
