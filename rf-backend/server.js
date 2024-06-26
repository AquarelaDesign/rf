'use strict'

/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstraps Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass a relative path from the project root.
*/

const { Ignitor } = require('@adonisjs/ignitor')
// const path = require('path')
const https = require('https')
const fs = require('fs')

// Certificate
const options = {
  // key: fs.readFileSync(path.join(__dirname, './server.key')),
  // cert: fs.readFileSync(path.join(__dirname, './server.crt'))
  key: fs.readFileSync('/etc/letsencrypt/live/retornofacil.com.br/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/retornofacil.com.br/cert.pem')
}

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .wsServer()
  .fireHttpServer((handler) => {
    return https.createServer(options, handler)
  })
  .catch(console.error)
