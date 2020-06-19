'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Ws = use('Ws')

Route.post("/register", "AuthController.register")

Route.post("/authenticate", "AuthController.authenticate")

Route.group(() => {
  Route.get('/status', "UsuarioController.status")

  Route.post("/buscausuarios", "UsuarioController.busca")
  
  Route
    .resource('usuarios', 'UsuarioController')
    .validator( new Map([
      [['usuarios.store'],['StoreUsuario']],
      [['usuarios.update'],['UpdateUsuario']],
    ]))
    .apiOnly()
  Route.resource('pedidos', 'PedidoController')
    .apiOnly()
  Route.resource('veiculos', 'VeiculoController')
    .apiOnly()
  Route.post('veiculos/:id/images', 'ImageController.store')

  Route.resource('veiculosm', 'VeiculosMotoristaController')
    .apiOnly()
  // Route.post('veiculosm/:id/images', 'ImagevmController.store')

  Route.get('images/:path', 'ImageController.show')
  Route
    .resource('rotas', 'RotaController')
    .validator( new Map([
      [['rotas.store'],['UpdateRota']],
      [['rotas.update'],['UpdateRota']],
    ]))
    .apiOnly()

}).middleware('auth')
