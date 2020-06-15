'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Veiculo = use('App/Models/Veiculo')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with veiculos
 */
class VeiculoController {
  /**
   * Show a list of all veiculos.
   * GET veiculos
   */
  async index ({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    const veiculos = Veiculo.all()
    await veiculos.load('images')
    return veiculos
  }

  /**
   * Create/save a new veiculo.
   * POST veiculos
   */
  async store ({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    const data = request.only([
      "placachassi", 
      "modelo",
      "estado",
      "ano",
      "valor",
      "fipe",
    ])

    const veiculos = await Veiculo.create(data)
    // const veiculos = await Veiculo.create({...data, pedido_id: id})
    return veiculos
  }

  /**
   * Display a single veiculo.
   * GET veiculos/:id
   */
  async show ({ auth, params }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const veiculos = await Veiculo.findOrFail(params.id)
    await veiculos.load('images')
    return veiculos
  }

  /**
   * Update veiculo details.
   * PUT or PATCH veiculos/:id
   */
  async update ({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
      
    const veiculos = await Veiculo.findOrFail(params.id);
    const data = request.only([
      "placachassi", 
      "modelo",
      "estado",
      "ano",
      "valor",
      "fipe",
    ])

    veiculos.merge(data)
    await veiculos.save()
    return veiculos
  }

  /**
   * Delete a veiculo with id.
   * DELETE veiculos/:id
   */
  async destroy ({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const veiculos = await Veiculo.findOrFail(params.id)
    await veiculos.delete()    
  }
}

module.exports = VeiculoController
