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

Route.post("/register", "AuthController.register")

Route.post("/authenticate", "AuthController.authenticate")

Route.group(() => {
  Route.resource("clientes", "ClienteController").apiOnly()
  Route.resource("enderecos", "EnderecoController").apiOnly()
  Route.get("/enderecos/list/:id", "EnderecoController.list")
  Route.resource("cartaos", "CartaoController").apiOnly()
  Route.get("/cartaos/list/:id", "CartaoController.list")
}).middleware('auth')

// room
Route.group(() => {
  Route.post('', 'RoomController.create')
  Route.get(':id', 'RoomController.select')
  Route.post(':id', 'RoomController.createMessage')
}).prefix('/rooms')
