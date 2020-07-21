'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')
const Usuario = use('App/Models/Usuario')
const Ws = use('Ws')
const Event = use('Event')


/**
 * Resourceful controller for interacting with usuarios
 */
class UsuarioController {
  /**
   * Show a list of all usuarios.
   * GET usuarios
   */
  async index ({ auth, request, response }) {
    /*
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O' && usuarios !== undefined) {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    */
    const condicoes = request.only([
      "status",
      "estado",
      "tipo",
    ])

    try {    
      const usuario = await Usuario.query()
                                   .with('veiculos')
                                   .fetch()
      return usuario
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Show a list of usuarios with parameters.
   * GET usuarios
   */
  async busca ({ auth, request, response }) {
    /*
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O' && usuarios !== undefined) {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    */
    const condicoes = request.only([
      "email",
      "status",
      "estado",
      "tipo",
    ])

    try {    
      /*
      const usuario = await Usuario.query()
        .where({ status: condicoes.status, estado: condicoes.estado, tipo: condicoes.tipo })
        .with('veiculos')
        .fetch()
      */
      const query = Usuario.query()
      if (condicoes.email !== null){
        query.andWhere('email','=',condicoes.email)
      }
      if (condicoes.tipo !== null){
        query.andWhere('tipo','=',condicoes.tipo)
      }
      if (condicoes.status !== null){
        query.andWhere('status','=',condicoes.status)
      }
      if (condicoes.estado !== null){
        query.andWhere('estado','=',condicoes.estado)
      }
      query.with('veiculos')
      const usuario = await query.fetch()

      return usuario
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }
  }

  /**
   * Search usuarios with parameters.
   * GET usuarios
   */
  async search({params, request, response}) {

    // console.log(request.input('query'))
    let query = request.input('query')

    let usuarios = await Usuario.query().where('nome', 'like', '%' + query + '%')
      .orWhere('cpfcnpj', 'like', '%' + query + '%').fetch()

    Event.fire('search::results', usuarios.toJSON())

    return response.json('ok')
  }

  /**
   * Show a list of usuarios with status.
   * GET usuarios
   */
  async status({auth, request, response}) {
    /*
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O' && usuarios !== undefined) {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    */
    try {    
      /*
      const usuario = await Usuario.query()
        .where({ status: "A", estado: "", tipo: "M" })
        .with('veiculos')
        .fetch()
      */
      const query = Usuario.query()
      query.where('tipo','=',"M")
      query.andWhere('status','=',"A")
      query.andWhere('estado','='," ")
      query.with('veiculos')
      const usuario = await query.fetch()
  

      Event.fire('status::results', usuario)
      return usuario
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado ${e}`
      })
    }

  }

  /**
   * Create/save a new usuario.
   * POST usuarios
   */
  async store ({ auth, request, response }) {
    /*
    try {
      const usuarios = await Usuario.findOrFail(auth.user.id)
      if (usuarios.tipo !== 'O' && usuarios !== undefined) {
        return response.status(401).send({ 
          error: `Não autorizado [${usuarios.tipo}]`
        })
      }
    }
    catch (e) {}
    */
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
      "cep",
      "codbanco",
      "banco",
      "agencia",
      "conta",
      "tipoconta",
      "foto",
      "habilitacao",
      "habilitacaoimg",
      "habilitacaovct",
      "cavalo",
      "cavaloimg",
      "cavalovct",
      "cavalo1",
      "cavalo1img",
      "cavalo1vct",
      "ANTT",
      "ANTTimg",
      "ANTTvct",
      "rate",
      "latitude",
      "longitude",
      "localizacao",
      "origem",
      "destino",
      "status",
      "estado",
      "tipo",
      "user_id",
    ])

    const usuario = await Usuario.create(data)
    return usuario
  }

  /**
   * Display a single usuario.
   * GET usuarios/:id
   */
  async show ({ auth, params, request, response, view }) {
    /*
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O' && usuarios !== undefined) {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    */
    const usuario = await Usuario.findOrFail(params.id)
    await usuario.load('veiculos')
    return usuario
  }

  /**
   * Update usuario details.
   * PUT or PATCH usuarios/:id
   */
  async update ({ auth, params, request, response }) {
    /*
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O' && usuarios !== undefined) {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    */
    try {
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
        "cep",
        "codbanco",
        "banco",
        "agencia",
        "conta",
        "tipoconta",
        "foto",
        "habilitacao",
        "habilitacaoimg",
        "habilitacaovct",
        "cavalo",
        "cavaloimg",
        "cavalovct",
        "cavalo1",
        "cavalo1img",
        "cavalo1vct",
        "ANTT",
        "ANTTimg",
        "ANTTvct",
        "rate",
        "latitude",
        "longitude",
        "localizacao",
        "origem",
        "destino",
        "status",
        "estado",
        "tipo",
        "user_id",
      ])

      usuario.merge(data)
      await usuario.save()
      /*
      const topic = Ws.getChannel('chat').topic('chat')
      console.log('topic', topic)
      if (topic) {
        if (data.status === 'A') {
          topic.broadcast('message', {message: `Motorista ${usuario.nome} Conectado!`, tipo: 'info'})
        } else {
          topic.broadcast('message', {message: `Motorista ${usuario.nome} Desconectado!`, tipo: 'dark'})
        }
      }
      */
      await usuario.load('veiculos')
      return usuario
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `O registro não existe ${e}`
      })
    }
  }

  /**
   * Delete a usuario with id.
   * DELETE usuarios/:id
   */
  async destroy ({ auth, params, request, response }) {
    /*
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O' && usuarios !== undefined) {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    */

    try {
      const usuario = await Usuario.findOrFail(params.id)
      await usuario.delete()
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

module.exports = UsuarioController
