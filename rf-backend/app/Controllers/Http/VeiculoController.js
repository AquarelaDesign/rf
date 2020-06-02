'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Veiculo = use("App/Models/Veiculo");

/**
 * Resourceful controller for interacting with veiculos
 */
class VeiculoController {
  /**
   * Show a list of all veiculos.
   * GET veiculos
   */
  async index ({ request, response, view }) {
    const veiculo = await Veiculo.all();
   
    return veiculo;
  }

  /**
   * Create/save a new veiculo.
   * POST veiculos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth }) {
    const data = request.only([
      "placa", "chassi", "marca", "modelo", "ano", "valor"
    ]);
    const veiculo = await Veiculo.create({ cliente_id: auth.user.id, ...data });
   
    return veiculo;
  }

  /**
   * Display a single veiculo.
   * GET veiculos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const veiculo = await Veiculo.findOrFail(params.id);
    
    return veiculo;
  }

  async list ({ params }) {
    const veiculo = await Veiculo
    .query()
    .where('cliente_id','=', params.id)
    .fetch();
    
    return veiculo;
  }

  /**
   * Update veiculo details.
   * PUT or PATCH veiculos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const veiculo = await Veiculo.findOrFail(params.id);
    const data = request.only([
      "placa", "chassi", "marca", "modelo", "ano", "valor"
    ]);
    
    veiculo.merge(data);
    await veiculo.save();
    
    return veiculo;
  }

  /**
   * Delete a veiculo with id.
   * DELETE veiculos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    const veiculo = await Veiculo.findOrFail(params.id);
    
    if (veiculo.cliente_id !== auth.user.id) {
      return response.status(401);
    }
    
    await veiculo.delete();    
  }
}

module.exports = VeiculoController
