'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')
const Usuario = use('App/Models/Usuario')

class UserController {
  async login({ auth, request }) {
    const { email, password } = request.all()
    await auth.attempt(email, password)

    return 'Conectado com sucesso'
  }

  // show({ auth, params }) {
  //   if (auth.user.id !== Number(params.id) && auth.user.tipo !== 'O') {
  //     return "Você não pode ver o perfil de outra pessoa"
  //   }
  //   return auth.user
  // }

  /**
   * Show a list of all users.
   * GET users
   */
  async index ({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    try {    
      const users = User.query().fetch()
      return users
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum usuário encontrado`
      })
    }

  }

  /**
   * Create/save a new user.
   * POST user
   */
  async store ({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const data = request.only([
      "username", 
      "email",
      "password",
      "usuario_id",
    ])
    
    try {
      const user = await User.create(data)
      return user
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum usuário encontrado`
      })
    }
  }

    /**
   * Display a single pedido.
   * GET user/:id
   */
  async show ({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    
    try {
      const user = await User.findOrFail(params.id)
      return user
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum usuário encontrado`
      })
    }
  }

  /**
   * Display a single user.
   * GET user/:id
   */
  async show ({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
    
    try {
      const user = await User.findOrFail(params.id)
      return user
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum usuário encontrado`
      })
    }
  }

  /**
   * Update user details.
   * PUT or PATCH user/:id
   */
  async update ({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const user = await User.findOrFail(params.id);
      const data = request.only([
        "username", 
        "email",
        "password",
        "usuario_id",
        ])
        
      user.merge(data)
      await user.save()
      return user
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Usuário não encontrado`
      })
    }
  }

  /**
   * Delete a user with id.
   * DELETE user/:id
   */
  async destroy ({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()    
      return response.status(200).send({
        status: 200,
        message: `Registro excluído com sucesso`
      })
    } catch (e) {
      return response.status(404).send({
        status: 404,
        message: `Usuário não encontrado`
      })
    }
  }

}

module.exports = UserController
