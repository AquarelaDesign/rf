'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Rota = use('App/Models/Rota')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with rotas
 */
class RotaController {
  /**
   * Show a list of all rotas.
   * GET rotas
   */
  async index({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const rotas = Rota.all()
    return rotas
  }

  /**
   * Show a list of rota with status.
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
      const query = Rota.query()
      if (params.id !== null){
        query.andWhere('pedido_id','=', params.id)
      }
      const rota = await query.fetch()
      return rota

    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Rota não encontrada ${e}`
      })
    }

  }

  /**
   * Create/save a new rota.
   * POST rotas
   */
  async store({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const id = request.pedido_id
    const data = request.only([
      "pedido_id", 
      "nome",
      "cpfcnpj",
      "logradouro",
      "numero",
      "complemento",
      "bairro",
      "cidade",
      "uf",
      "pais",
      "cep",
      "contato",
      "celular",
      "telefone",
      "whats",
      "email",
      "motorista_id",
      "tipo",
      "rota_relacionada",
      "status",
    ])

    const rotas = await Rota.create(data)
    // const rotas = await Rota.create({ ...data, pedido_id: id });
    return rotas
  }

  /**
   * Display a single rota.
   * GET rotas/:id
   */
  async show({ auth, params }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const rotas = await Rota.findOrFail(params.id)
    return rotas
  }

  /**
   * Update rota details.
   * PUT or PATCH rotas/:id
   */
  async update({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const rotas = await Rota.findOrFail(params.id);
    const data = request.only([
      "pedido_id", 
      "nome",
      "cpfcnpj",
      "logradouro",
      "numero",
      "complemento",
      "bairro",
      "cidade",
      "uf",
      "pais",
      "cep",
      "contato",
      "celular",
      "telefone",
      "whats",
      "email",
      "motorista_id",
      "tipo",
      "rota_relacionada",
      "status",
    ])

    rotas.merge(data)
    await rotas.save()
    return rotas
  }

  /**
   * Delete a rota with id.
   * DELETE rotas/:id
   */
  async destroy({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const rotas = await Rota.findOrFail(params.id)
      await rotas.delete()
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

module.exports = RotaController
