'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Patio = use('App/Models/Patio')
const Usuario = use('App/Models/Usuario')

/**
 * Resourceful controller for interacting with patios
 */
class PatioController {
  /**
   * Show a list of all patios.
   * GET patios
   */
  async index({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const patios = Patio.all()
    return patios
  }

  /**
   * Show a list of patios with parameters.
   * GET patios/:id
   */
  async busca({auth, request, response}) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    const condicoes = request.only([
      "uf",
      "cidade",
    ])

    try {    
      const query = Patio.query()

      if (condicoes.uf !== null && condicoes.uf !== undefined){
        query.where('uf', condicoes.uf)
      }
      if (condicoes.cidade !== null && condicoes.cidade !== undefined){
        query.where('cidade', condicoes.cidade)
      }

      const patios = await query.fetch()
      return patios

    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado - ${e}`
      })
    }

  }

  /**
   * Create/save a new patio.
   * POST patios
   */
  async store({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const data = request.only([
      "uf", 
      "cidade", 
      "prioridade", 
      "nome", 
      "cnpjcpf", 
      "endereco", 
      "numero", 
      "complemento", 
      "bairro", 
      "cep", 
      "contato", 
      "celular", 
      "celular1", 
      "celular2", 
      "fone", 
      "fone1", 
      "fone2", 
      "email", 
      "email1", 
      "email2", 
      "atendimento", 
      "valor_coleta", 
      "valor_embarque_carro", 
      "valor_embarque_van", 
      "valor_embarque_moto", 
      "valor_embarque_moto_300", 
      "raio_coleta", 
      "numero_diarias_gratis", 
      "diaria_carro", 
      "diaria_van", 
      "diaria_moto", 
      "diaria_moto_grande", 
      "motorista", 
      "motorista_cpf", 
      "motorista_placa", 
      "banco", 
      "agencia", 
      "tipo_conta", 
      "conta", 
      "titular", 
      "cpf_titular", 
      "observacoes", 
      "latitude", 
      "longitude", 
      "status", 
    ])

    const patios = await Patio.create(data)
    return patios
  }

  /**
   * Display a single patio.
   * GET patios/:id
   */
  async show({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {  
      const patios = await Patio.findOrFail(params.id)
      return patios
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Update patio details.
   * PUT or PATCH patios/:id
   */
  async update({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const patios = await Patio.findOrFail(params.id);
    const data = request.only([
      "uf", 
      "cidade", 
      "prioridade", 
      "nome", 
      "cnpjcpf", 
      "endereco", 
      "numero", 
      "complemento", 
      "bairro", 
      "cep", 
      "contato", 
      "celular", 
      "celular1", 
      "celular2", 
      "fone", 
      "fone1", 
      "fone2", 
      "email", 
      "email1", 
      "email2", 
      "atendimento", 
      "valor_coleta", 
      "valor_embarque_carro", 
      "valor_embarque_van", 
      "valor_embarque_moto", 
      "valor_embarque_moto_300", 
      "raio_coleta", 
      "numero_diarias_gratis", 
      "diaria_carro", 
      "diaria_van", 
      "diaria_moto", 
      "diaria_moto_grande", 
      "motorista", 
      "motorista_cpf", 
      "motorista_placa", 
      "banco", 
      "agencia", 
      "tipo_conta", 
      "conta", 
      "titular", 
      "cpf_titular", 
      "observacoes", 
      "latitude", 
      "longitude", 
      "status", 
    ])

    try {
      patios.merge(data)
      await patios.save()
      return patios
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Delete a patio with id.
   * DELETE patios/:id
   */
  async destroy({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const patios = await Patio.findOrFail(params.id)
      await patios.delete()
      return response.status(200).send({
        status: 200,
        message: `Registro excluído com sucesso`
      })
    } catch (e) {
      return response.status(404).send({
        status: 404,
        message: `O registro não existe`
      })
    }
  }
}

module.exports = PatioController
