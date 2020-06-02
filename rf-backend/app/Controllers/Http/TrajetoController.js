'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Trajeto = use("App/Models/Trajeto");

/**
 * Resourceful controller for interacting with trajetos
 */
class TrajetoController {
  /**
   * Show a list of all trajetos.
   * GET trajetos
   */
  async index () {
    const trajeto = await Trajeto.all();
   
    return trajeto;
  }

  /**
   * Create/save a new trajeto.
   * POST trajetos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth }) {
    const data = request.only([
      "cotacao_id",
      "ologradouro", "onumero", "ocomplemento", "obairro", "ocidade", "ouf", "ocep", "olatitude", "olongitude",
      "dlogradouro", "dnumero", "dcomplemento", "dbairro", "dcidade", "duf", "dcep", "dlatitude", "dlongitude",
      "valorkm", "kmlitro"
    ]);
    const trajeto = await Trajeto.create({ 
      cliente_id: auth.user.id, 
      ...data 
    });
   
    return trajeto;
  }

  /**
   * Display a single trajeto.
   * GET trajetos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const trajeto = await Trajeto.findOrFail(params.id);
    
    return trajeto;
  }

  async list ({ params }) {
    const trajeto = await Trajeto
    .query()
    .where('cotacao_id','=', params.id)
    .fetch();
    
    return trajeto;
  }

  /**
   * Update trajeto details.
   * PUT or PATCH trajetos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const trajeto = await Trajeto.findOrFail(params.id);
    const data = request.only([
      "cotacao_id",
      "ologradouro", "onumero", "ocomplemento", "obairro", "ocidade", "ouf", "ocep", "olatitude", "olongitude",
      "dlogradouro", "dnumero", "dcomplemento", "dbairro", "dcidade", "duf", "dcep", "dlatitude", "dlongitude",
      "valorkm", "kmlitro"
    ]);
    
    trajeto.merge(data);
    await trajeto.save();
    
    return trajeto;
  }

  /**
   * Delete a trajeto with id.
   * DELETE trajetos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    const trajeto = await Trajeto.findOrFail(params.id);
    
    if (trajeto.cotacao_id !== auth.user.id) {
      return response.status(401);
    }
    
    await trajeto.delete();    
  }
}

module.exports = TrajetoController
