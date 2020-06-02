'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Cartao = use("App/Models/Cartao");

/**
 * Resourceful controller for interacting with cartaos
 */
class CartaoController {
  /**
   * Show a list of all cartaos.
   * GET cartaos
   */
  async index () {
    const cartao = await Cartao.all();
   
    return cartao;
  }

  /**
   * Create/save a new cartao.
   * POST cartaos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth }) {
    const data = request.only([
      "numero", "vmes", "vano", "crv", "nome"
    ]);
    const cartao = await Cartao.create({ cliente_id: auth.user.id, ...data });
   
    return cartao;
  }

  /**
   * Display a single cartao.
   * GET cartaos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const cartao = await Cartao.findOrFail(params.id);
    
    return cartao;
  }

  async list ({ params }) {
    const cartao = await Cartao
    .query()
    .where('cliente_id','=', params.id)
    .fetch();
    
    return cartao;
  }

  /**
   * Update cartao details.
   * PUT or PATCH cartaos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const cartao = await Cartao.findOrFail(params.id);
    const data = request.only([
      "numero", "vmes", "vano", "crv", "nome"
    ]);
    
    cartao.merge(data);
    await cartao.save();
    
    return cartao;
  }

  /**
   * Delete a cartao with id.
   * DELETE cartaos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    const cartao = await Cartao.findOrFail(params.id);
    
    if (cartao.cliente_id !== auth.user.id) {
      return response.status(401);
    }
    
    await cartao.delete();    
  }
}

module.exports = CartaoController
