'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Image = use('App/Models/Image')
const Usuario = use('App/Models/Usuario')
const Helpers = use('Helpers')

const Drive = use('Drive')

/**
 * Resourceful controller for interacting with images
 */
class ImageController {
  /**
   * Create/save a new image.
   * POST images
   */
  async store ({ params, request }) {
    try {
      const usuarios = await Usuario.findOrFail(params.id)
      if (usuarios === undefined) {
        return response.status(404).send({ 
          error: `Usuário de código [${params.id}] não foi localizado!`
        })
      }
    }
    catch (e) {
      
    }

    const images = request.file('file', {
      types: ['image'],
      size: '2mb'
    })

    const UserID = ("00000" + params.id).slice(-5)

    // await images.move(Helpers.tmpPath('uploads'), {
    await images.move(`${Helpers.appRoot()}/../rf-dashboard/public/images`, {
      name: `${UserID}_${Date.now()}_${images.clientName}`,
      overwrite: true
    })
    
    if (!images.moved()) {
      return images.error()
    }

    console.log('*** images', images)

    return {
      id: params.iid,
      name: images.fileName,
      size: images.size,
      uploaded: images.ended,
    }

    // await Promise.all(
    //   images
    //     .movedList()
    //     .map(image => usuarios.images().create({ path: image.fileName }))
    // )

  }

  /**
   * Delete a image with id.
   * DELETE imagess/:id
   */
  async destroy ({ params, response }) {
    try {
      const file = `${Helpers.appRoot()}/../rf-dashboard/public/images/${params.id}`
      const exists = await Drive.exists(file)
      
      if (exists) {
        await Drive.delete(file)
        return response.status(200).send({
          status: 200,
          message: `Arquivo [${params.id}] excluído com sucesso`
        })
      }
    } catch (e) {
      return response.status(404).send({
        status: 404,
        message: `O  arquivo [${params.id}] não foi localizado!`
      })
    }
  }

}

module.exports = ImageController