'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Pagamento = use("App/Models/Pagamento");

/**
 * Resourceful controller for interacting with pagamentos
 */
class PagamentoController {
  /**
   * Show a list of all pagamentos.
   * GET pagamentos
   */
  async index () {
    const pagamento = await Pagamento.all();
   
    return pagamento;
  }

  /**
   * Create/save a new pagamento.
   * POST pagamentos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth }) {
    const data = request.only([
      "cotacao_id", "numero", "vmes", "vano", "crv", "nome", "parcelas", "valor", "status"
    ]);
    const pagamento = await Pagamento.create({ 
      cliente_id: auth.user.id, 
      ...data 
    });
   
    return pagamento;
  }

  /**
   * Display a single pagamento.
   * GET pagamentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const pagamento = await Pagamento.findOrFail(params.id);
    
    return pagamento;
  }

  async list ({ params }) {
    const pagamento = await Pagamento
    .query()
    .where('cotacao_id','=', params.id)
    .fetch();
    
    return pagamento;
  }

  /**
   * Update pagamento details.
   * PUT or PATCH pagamentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const pagamento = await Pagamento.findOrFail(params.id);
    const data = request.only([
      "cotacao_id", "numero", "vmes", "vano", "crv", "nome", "parcelas", "valor", "status"
    ]);
    
    pagamento.merge(data);
    await pagamento.save();
    
    return pagamento;
  }

  /**
   * Delete a pagamento with id.
   * DELETE pagamentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    const pagamento = await Pagamento.findOrFail(params.id);
    
    if (pagamento.cotacao_id !== auth.user.id) {
      return response.status(401);
    }
    
    await pagamento.delete();    
  }
}

module.exports = PagamentoController
