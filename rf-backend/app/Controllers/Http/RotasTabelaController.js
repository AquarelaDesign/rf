'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const RotaTabela = use('App/Models/RotasTabela')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with rotastabelas
 */
class RotasTabelaController {
  /**
   * Show a list of all rotastabelas.
   * GET rotastabelas
   */
  async index ({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const rotas = RotaTabela.all()
    return rotas
  }

  /**
   * Show a list of rota with status.
   * GET rotastabela/:id
   */
  async busca({auth, params, request, response}) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    try {    
      const query = RotaTabela.query()
      if (params.id !== null){
        query.andWhere('tipo_de_veiculo_id','=', params.id)
      }
      const rotas = await query.fetch()
      return rotas

    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Tabela da Rota não encontrada ${e}`
      })
    }

  }

  /**
   * Create/save a new rotastabela.
   * POST rotastabelas
   */
  async store({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const data = request.only([
      "tipo_de_veiculo_id", 
      "cidade_origem",
      "uf_origem",
      "cidade_destino",
      "uf_destino",
      "nome",
      "valor",
    ])

    const rotas = await RotaTabela.create(data)
    return rotas
  }

  /**
   * Display a single rotastabela.
   * GET rotastabelas/:id
   */
  async show({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const rotas = await RotaTabela.findOrFail(params.id)
      return rotas
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Update rotastabela details.
   * PUT or PATCH rotastabelas/:id
   */
  async update({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const rotas = await RotaTabela.findOrFail(params.id);
    const data = request.only([
      "tipo_de_veiculo_id", 
      "cidade_origem",
      "uf_origem",
      "cidade_destino",
      "uf_destino",
      "nome",
      "valor",
    ])

    try {
      rotas.merge(data)
      await rotas.save()
      return rotas
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Delete a rotastabela with id.
   * DELETE rotastabelas/:id
   */
  async destroy({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const rotas = await RotaTabela.findOrFail(params.id)
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

module.exports = RotasTabelaController
