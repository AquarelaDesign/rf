'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with contasarecebers
 */
class ContasAReceberController {
  /**
   * Show a list of all contasarecebers.
   * GET contasarecebers
   */
  async index ({ request, response, view }) {
  }

  /**
   * Create/save a new contasareceber.
   * POST contasarecebers
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single contasareceber.
   * GET contasarecebers/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Update contasareceber details.
   * PUT or PATCH contasarecebers/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a contasareceber with id.
   * DELETE contasarecebers/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ContasAReceberController
