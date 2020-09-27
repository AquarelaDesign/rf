'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Veiculo = use('App/Models/VeiculosMotorista')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with veiculosmotoristas
 */
class VeiculosMotoristaController {
  /**
   * Show a list of all veiculosmotoristas.
   * GET veiculosmotoristas
   */
  async index ({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    const veiculos = Veiculo.query()
                            .with('imagevms')
                            .fetch()
    return veiculos
  }

  /**
   * Show a list of pedido with status.
   * GET veiculosmotoristas/:id
   */
  async busca({auth, params, request, response}) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    try {    
      const query = Veiculo.query()
      if (params.id !== null){
        query.andWhere('usuario_id','=', params.id)
      }
      const veiculo = await query.fetch()
      return veiculo

    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Veículo não encontrado ${e}`
      })
    }

  }

  /**
   * Create/save a new veiculosmotorista.
   * POST veiculosmotoristas
   */
  async store ({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    const data = request.only([
      "usuario_id", 
      "placachassi", 
      "modelo",
      "ano",
      "vagas",
      "tipo",
      "habilitacao",
      "habilitacaoimg",
      "habilitacaovct",
      "cavalo",
      "cavaloimg",
      "cavalovct",
      "carreta",
      "carretaimg",
      "carretavct",
      "carreta1",
      "carreta1img",
      "carreta1vct",
      "ANTT",
      "ANTTimg",
      "ANTTvct",
    ])

    const veiculos = await Veiculo.create(data)
    // const veiculos = await Veiculo.create({...data, usuario_id: id})
    return veiculos
  }

  /**
   * Display a single veiculosmotorista.
   * GET veiculosmotoristas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const veiculos = await Veiculo.findOrFail(params.id)
      // await veiculos.load('imagevms')
      return veiculos
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Update veiculosmotorista details.
   * PUT or PATCH veiculosmotoristas/:id
   */
  async update ({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
      
    const veiculos = await Veiculo.findOrFail(params.id);
    const data = request.only([
      "usuario_id", 
      "placachassi", 
      "modelo",
      "ano",
      "vagas",
      "tipo",
      "habilitacao",
      "habilitacaoimg",
      "habilitacaovct",
      "cavalo",
      "cavaloimg",
      "cavalovct",
      "carreta",
      "carretaimg",
      "carretavct",
      "carreta1",
      "carreta1img",
      "carreta1vct",
      "ANTT",
      "ANTTimg",
      "ANTTvct",
    ])

    try {
      veiculos.merge(data)
      await veiculos.save()
      return veiculos
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Delete a veiculosmotorista with id.
   * DELETE veiculosmotoristas/:id
   */
  async destroy ({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const veiculos = await Veiculo.findOrFail(params.id)
      await veiculos.delete()    
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

module.exports = VeiculosMotoristaController
