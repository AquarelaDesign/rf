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

Route.post('images/:id/:iid', 'ImageController.store')
Route.delete('images/:id', 'ImageController.destroy')

Route.group(() => {
  Route.get('/status', "UsuarioController.status")
  Route.post("/buscausuarios", "UsuarioController.busca")

  Route.resource('users', 'UserController')
    .apiOnly()

  Route
    .resource('usuarios', 'UsuarioController')
    .validator( new Map([
      [['usuarios.store'],['StoreUsuario']],
      [['usuarios.update'],['UpdateUsuario']],
    ]))
    .apiOnly()

  Route.get('/statuspedidos', "PedidoController.status")
  Route.post("/buscapedidos", "PedidoController.busca")
  Route.resource('pedidos', 'PedidoController')
    .apiOnly()
  Route.resource('veiculos', 'VeiculoController')
    .apiOnly()
  // Route.post('veiculos/:id/images', 'ImageController.store')
  Route.post("/buscaveiculos/:id", "VeiculoController.busca")

  Route.post("/buscaveiculosm/:id", "VeiculosMotoristaController.busca")
  Route.resource('veiculosm', 'VeiculosMotoristaController')
    .apiOnly()
  // Route.post('veiculosm/:id/images', 'ImagevmController.store')

  // Route.get('images/:path', 'ImageController.show')
  Route
    .resource('rotas', 'RotaController')
    .validator( new Map([
      [['rotas.store'],['UpdateRota']],
      [['rotas.update'],['UpdateRota']],
    ]))
    .apiOnly()
  Route.post("/buscarotas/:id", "RotaController.busca")

  Route.resource('metropoles', 'MetropoleController').apiOnly()
  Route.resource('rotastabela', 'RotasTabelaController').apiOnly()
  Route.post("/rotastabela/:id", "RotasTabelaController.busca")
  Route.resource('seguros', 'SeguroController').apiOnly()
  Route.resource('tiposdeveiculos', 'TiposDeVeiculoController').apiOnly()
  Route.resource('valoresadicionais', 'ValoresAdicionaiController').apiOnly()

  Route
    .resource('rotaspedidos', 'RotasPedidoController')
    .validator( new Map([
      [['rotaspedidos.store'],['UpdateRotaPedido']],
      [['rotaspedidos.update'],['UpdateRotaPedido']],
    ]))
    .apiOnly()
  Route.get("/buscarotaspedidos/:id", "RotasPedidoController.busca")

  Route.resource('historicos', 'HistoricoController').apiOnly()
  Route.post("/buscahistoricos", "HistoricoController.busca")

  Route
    .resource('pedidosvalores', 'PedidosValoreController')
    .apiOnly()
  Route.post("/buscavalped/:id", "PedidosValoreController.busca")

}).middleware('auth')
