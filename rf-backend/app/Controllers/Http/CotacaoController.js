'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Cotacao = use("App/Models/Cotacao");

/**
 * Resourceful controller for interacting with cotacaos
 */
class CotacaoController {
  /**
   * Show a list of all cotacaos.
   * GET cotacaos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const cotacao = await Cotacao.all();
   
    return cotacao;
  }

  /**
   * Create/save a new cotacao.
   * POST cotacaos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth }) {
    const data = request.only([
      "cliente_id", "modalidade", "valor", "desconto", "negociado", "validade", "status"
    ]);
    const cotacao = await Cotacao.create({ user_id: auth.user.id, ...data });
    
    return cotacao;
  }

  /**
   * Display a single cotacao.
   * GET cotacaos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const cotacao = await Cotacao.findOrFail(params.id);

    await cotacao.load('cotacao_veiculos')
    await cotacao.load('pagamentos')
    
    return cotacao;
  }

  /**
   * Render a form to update an existing cotacao.
   * GET cotacaos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update cotacao details.
   * PUT or PATCH cotacaos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a cotacao with id.
   * DELETE cotacaos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = CotacaoController
