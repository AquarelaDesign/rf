'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with contasapagars
 */
class ContasAPagarController {
  /**
   * Show a list of all contasapagars.
   * GET contasapagars
   */
  async index ({ request, response, view }) {
  }

  /**
   * Create/save a new contasapagar.
   * POST contasapagars
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single contasapagar.
   * GET contasapagars/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Update contasapagar details.
   * PUT or PATCH contasapagars/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a contasapagar with id.
   * DELETE contasapagars/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ContasAPagarController
