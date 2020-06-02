'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Contato = use("App/Models/Contato");

/**
 * Resourceful controller for interacting with contatoes
 */
class ContatoController {
  /**
   * Show a list of all contatoes.
   * GET contatoes
   */
  async index () {
    const contato = await Contato.all();
   
    return contato;
  }

  /**
   * Create/save a new contato.
   * POST contatoes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth }) {
    const data = request.only([
      "tipo", "dados", "contato"
    ]);
    const contato = await Contato.create({ cliente_id: auth.user.id, ...data });
   
    return contato;
  }

  /**
   * Display a single contato.
   * GET contatoes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const contato = await Contato.findOrFail(params.id);
    
    return contato;
  }

  async list ({ params }) {
    const contato = await Contato
    .query()
    .where('cliente_id','=', params.id)
    .fetch();
    
    return contato;
  }

  /**
   * Update contato details.
   * PUT or PATCH contatoes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const contato = await Contato.findOrFail(params.id);
    const data = request.only([
      "tipo", "dados", "contato"
    ]);
    
    contato.merge(data);
    await contato.save();
    
    return contato;
  }

  /**
   * Delete a contato with id.
   * DELETE contatoes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    const contato = await Contato.findOrFail(params.id);
    
    if (contato.cliente_id !== auth.user.id) {
      return response.status(401);
    }
    
    await contato.delete();    
  }
}

module.exports = ContatoController
