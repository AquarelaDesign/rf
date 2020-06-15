'use strict'

class UserController {
  async login({ auth, request }) {
    const { email, password } = request.all()
    await auth.attempt(email, password)

    return 'Conectado com sucesso'
  }

  show({ auth, params }) {
    if (auth.user.id !== Number(params.id) && auth.user.tipo !== 'O') {
      return "Você não pode ver o perfil de outra pessoa"
    }
    return auth.user
  }
}

module.exports = UserController
