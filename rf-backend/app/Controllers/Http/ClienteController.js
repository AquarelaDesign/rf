'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Cliente = use("App/Models/Cliente");

/**
 * Resourceful controller for interacting with clientes
 */
class ClienteController {
  /**
   * Show a list of all clientes.
   * GET clientes
   *
   * @param {object} ctx
   */
  async index () {
    const clientes = await Cliente.all();
   
    return clientes;
  }

  /**
   * Create/save a new cliente.
   * POST clientes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store ({ request, auth }) {
    const data = request.only([
      "cpfcnpj", "ierg", "nomerazao", "contato", "email", "celular", "telefone", "whatsapp", "codigopush", "status", "observacoes"
    ]);
    const cliente = await Cliente.create({ user_id: auth.user.id, ...data });
    
    return cliente;
  }

  /**
   * Display a single cliente.
   * GET clientes/:id
   *
   * @param {object} ctx
   */
  async show ({ params }) {
    const clientes = await Cliente.findOrFail(params.id);

    await clientes.load('cartaos')
    await clientes.load('veiculos')
    await clientes.load('cotacaos')
    
    return clientes;
  }

  /**
   * Update cliente details.
   * PUT or PATCH clientes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async update ({ params, request }) {
    const clientes = await Cliente.findOrFail(params.id);
    const data = request.only([
      "cpfcnpj", "ierg", "nomerazao", "contato", "email", "celular", "telefone", "whatsapp", "codigopush", "status", "observacoes"
    ]);
    
    clientes.merge(data);
    await clientes.save();
    
    return clientes;
  }

  /**
   * Delete a cliente with id.
   * DELETE clientes/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    const clientes = await Cliente.findOrFail(params.id);
    
    if (clientes.cliente_id !== auth.user.id) {
      return response.status(401).send({ error: 'Sem Autorização' });
    }
    
    await clientes.delete();    
  }
}

module.exports = ClienteController
