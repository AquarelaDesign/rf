'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Endereco = use("App/Models/Endereco");

/**
 * Resourceful controller for interacting with enderecos
 */
class EnderecoController {
  /**
   * Show a list of all enderecos.
   * GET enderecos
   */
  async index () {
    const endereco = await Endereco.all();
   
    return endereco;
  }

  /**
   * Create/save a new endereco.
   * POST enderecos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth }) {
    const data = request.only([
      "logradouro", "numero", "complemento", "bairro", "cidade", "uf", "cep", "nome", "latitude", "longitude"
    ]);
    const endereco = await Endereco.create({ cliente_id: auth.user.id, ...data });
   
    return endereco;
  }

  /**
   * Display a single endereco.
   * GET enderecos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const endereco = await Endereco.findOrFail(params.id);
    
    return endereco;
  }

  async list ({ params }) {
    const endereco = await Endereco
    .query()
    .where('cliente_id','=', params.id)
    .fetch();
    
    return endereco;
  }

  /**
   * Update endereco details.
   * PUT or PATCH enderecos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const endereco = await Endereco.findOrFail(params.id);
    const data = request.only([
      "logradouro", "numero", "complemento", "bairro", "cidade", "uf", "cep", "nome", "latitude", "longitude"
    ]);
    
    endereco.merge(data);
    await endereco.save();
    
    return endereco;
  }

  /**
   * Delete a endereco with id.
   * DELETE enderecos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    const endereco = await Endereco.findOrFail(params.id);
    
    if (endereco.cliente_id !== auth.user.id) {
      return response.status(401);
    }
    
    await endereco.delete();    
  }
}

module.exports = EnderecoController
