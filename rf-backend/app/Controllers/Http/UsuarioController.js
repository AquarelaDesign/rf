'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with usuarios
 */
class UsuarioController {
  /**
   * Show a list of all usuarios.
   * GET usuarios
   */
  async index ({ auth, request, response, view }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O' && usuarios !== undefined) {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    
    const usuario = await Usuario.all();
    return usuario
  }

  /**
   * Create/save a new usuario.
   * POST usuarios
   */
  async store ({ auth, request, response }) {
    try {
      const usuarios = await Usuario.findOrFail(auth.user.id)
      if (usuarios.tipo !== 'O' && usuarios !== undefined) {
        return response.status(401).send({ 
          error: `Não autorizado [${usuarios.tipo}]`
        })
      }
    }
    catch (e) {
      
    }

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
    ])

    const usuario = await Usuario.create(data)
    return usuario
  }

  /**
   * Display a single usuario.
   * GET usuarios/:id
   */
  async show ({ auth, params, request, response, view }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O' && usuarios !== undefined) {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    const usuario = await Usuario.findOrFail(params.id)
    return usuario
  }

  /**
   * Update usuario details.
   * PUT or PATCH usuarios/:id
   */
  async update ({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O' && usuarios !== undefined) {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    
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
    ])

    usuario.merge(data)
    await usuario.save()
    
    return usuario
  }

  /**
   * Delete a usuario with id.
   * DELETE usuarios/:id
   */
  async destroy ({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O' && usuarios !== undefined) {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    const usuario = await Usuario.findOrFail(params.id)
    await usuario.delete()
  }
}

module.exports = UsuarioController
