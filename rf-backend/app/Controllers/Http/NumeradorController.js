'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Numerador = use('App/Models/Numerador')
const Usuario = use('App/Models/Usuario')
/**
 * Resourceful controller for interacting with numeradors
 */
class NumeradorController {
  /**
   * Show a list of all numeradors.
   * GET numeradors
   */
  async index ({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    try {    
      const numeradors = Numerador.query().fetch()
      return numeradors
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum numerador encontrado`
      })
    }

  }

  /**
   * Show a list of numeradors with numerador.
   * POST numeradors
   */
  async busca({auth, params, request, response}) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    const condicoes = request.only([
      "tipo", 
    ])

    try {    
      const query = Numerador.query()
      if (condicoes.tipo !== null){
        query.andWhere('tipo','=',condicoes.tipo)
      }
      
      const numeradors = await query.fetch()
      return numeradors
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Numerador não encontrada ${e}`
      })
    }
  }

  /**
   * Create/save a new numerador.
   * POST numeradors
   */
  async store ({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const data = request.only([
      "tipo", 
      "numero",
      "descricao", 
    ])
    
    try {
      const numeradors = await Numerador.create(data)
      return numeradors
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum numerador encontrado`
      })
    }
  }

  /**
   * Display a single numerador.
   * GET numeradors/:id
   */
  async show ({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    
    try {
      const numeradors = await Numerador.findOrFail(params.id)
      return numeradors
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum numerador encontrado`
      })
    }
  }

  /**
   * Update numerador details.
   * PUT or PATCH numeradors/:id
   */
  async update ({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const numeradors = await Numerador.findOrFail(params.id);
      const data = request.only([
        "tipo", 
        "numero",
        "descricao", 
        ])
        
      numeradors.merge(data)
      await numeradors.save()
      return numeradors
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Numerador não encontrado`
      })
    }
  }

  /**
   * Delete a numerador with id.
   * DELETE numeradors/:id
   */
  async destroy ({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const numeradors = await Numerador.findOrFail(params.id)
      await numeradors.delete()    
      return response.status(200).send({
        status: 200,
        message: `Registro excluído com sucesso`
      })
    } catch (e) {
      return response.status(404).send({
        status: 404,
        message: `Numerador não encontrado`
      })
    }
  }
}

module.exports = NumeradorController
