'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Motorista = use("App/Models/Motorista");

/**
 * Resourceful controller for interacting with motoristas
 */
class MotoristaController {
  /**
   * Show a list of all motoristas.
   * GET motoristas
   *
   * @param {object} ctx
   */
  async index () {
    const motoristas = await Motorista.all();
   
    return motoristas;
  }

  /**
   * Create/save a new motorista.
   * POST motoristas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store ({ request, auth }) {
    const data = request.only([
      "cpfcnpj", "ierg", "nomerazao", "contato", "email", "celular", "telefone", "whatsapp", "codigopush", "status", "observacoes"
    ]);
    const motoristas = await Motorista.create({ user_id: auth.user.id, ...data });
    
    return motoristas;
  }

  /**
   * Display a single motorista.
   * GET motoristas/:id
   *
   * @param {object} ctx
   */
  async show ({ params }) {
    const motoristas = await Motorista.findOrFail(params.id);

    await motoristas.load('veiculos')
    
    return motoristas;
  }

  /**
   * Update motorista details.
   * PUT or PATCH motoristas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async update ({ params, request }) {
    const motoristas = await Motorista.findOrFail(params.id);
    const data = request.only([
      "cpfcnpj", "ierg", "nomerazao", "contato", "email", "celular", "telefone", "whatsapp", "codigopush", "status", "observacoes"
    ]);
    
    motoristas.merge(data);
    await motoristas.save();
    
    return motoristas;
  }

  /**
   * Delete a motorista with id.
   * DELETE motoristas/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    const motoristas = await Motorista.findOrFail(params.id);
    
    if (motoristas.motorista_id !== auth.user.id) {
      return response.status(401).send({ error: 'Sem Autorização' });
    }
    
    await motoristas.delete();    
  
  }
}

module.exports = MotoristaController
