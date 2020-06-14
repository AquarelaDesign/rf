'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate } = use('Validator')

const Usuario = use('App/Models/Usuario');

/**
 * Resourceful controller for interacting with usuarios
 */
class UsuarioController {
  /**
   * Show a list of all usuarios.
   * GET usuarios
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const usuarios = await Usuario.all();
    
    return usuarios;
  }

  /**
   * Create/save a new usuario.
   * POST usuarios
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    
    const data = request.only([
      "nome", 
      "email",
      "cpfcnpj",
      "ierg",
      "contato",
      "celular",
      "telefone",
      "whats",
      "codigopush",
      "logradouro",
      "numero",
      "complemento",
      "bairro",
      "cidade",
      "uf",
      "foto",
      "cep",
      "rate",
      "latitude",
      "longitude",
      "status",
      "estado",
      "tipo",
    ]);

    const usuario = await Usuario.create(data);
    
    return usuario;
  }

  /**
   * Display a single usuario.
   * GET usuarios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const usuario = await Usuario.findOrFail(params.id);
    return usuario;
  }

  /**
   * Update usuario details.
   * PUT or PATCH usuarios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const usuario = await Usuario.findOrFail(params.id);
    const data = request.only([
      "nome", 
      "email",
      "cpfcnpj",
      "ierg",
      "contato",
      "celular",
      "telefone",
      "whats",
      "codigopush",
      "logradouro",
      "numero",
      "complemento",
      "bairro",
      "cidade",
      "uf",
      "foto",
      "cep",
      "rate",
      "latitude",
      "longitude",
      "status",
      "estado",
      "tipo",
    ]);
    
    usuario.merge(data);
    await usuario.save();
    
    return usuario
  }

  /**
   * Delete a usuario with id.
   * DELETE usuarios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const usuario = await Usuario.findOrFail(params.id);
    await usuario.delete();
  }
}

module.exports = UsuarioController
