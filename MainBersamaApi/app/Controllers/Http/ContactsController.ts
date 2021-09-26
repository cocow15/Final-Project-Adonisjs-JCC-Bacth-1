import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateContactValidator from 'App/Validators/CreateContactValidator'

//Models
import Venue from 'App/Models/Venue';

export default class ContactsController {
    /**
   *
   * @swagger
   * /api/v1/venues:
   *  get:
   *    summary: Menampilkan Venue
   *    description: Mendapatkan list venue dan field dan hanya Owner yang memiliki akses.
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Venue
   *    responses:
   *       200:
   *         description: Data Venue didapat
   *         content:
   *            application/json:
   *               example:
   *                 message: "Berhasil mendapatkan data venue"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
    
    public async index({request, response}: HttpContextContract){
        if(request.qs().name){
            let name = request.qs().name
            let venuesFiltered = await Venue.findBy("name", name)
            return response.status(200).json({message: 'success get venues', data: venuesFiltered })
        }
        let venues = await Venue.query().preload('fields')
        return response.status(200).json({message: 'success get venues', data: venues })
    }

    /**
   *
   * @swagger
   * /api/v1/venues:
   *  post:
   *    summary: Mendaftarkan venue baru
   *    description: Pengguna Owner mendaftarkan venue dan hanya Owner yang memiliki akses.
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Venue
   *    requestBody:
   *     required : true
   *     content :
   *       application/x-www-form-urlencoded:
   *          schema:
   *            $ref: '#definitions/Venue'
   *       application/json:
   *          schema:
   *            $ref: '#definitions/Venue'
   *    responses:
   *       201:
   *         $ref: '#/components/responses/CreatedData'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       422:
   *         description: Gagal menambahkan venue
   *         content:
   *            application/json:
   *              example:
   *                 message: "Gagal aktivasi akun"
   */
    public async store({request, response, auth}: HttpContextContract){
        try {
            const data = await request.validate(CreateContactValidator) 
            const newVenue = await Venue.create(data)
            //auth
            await auth.use('api').authenticate()
            auth.user?.id
            response.created({message: 'venues is created', data: newVenue})
        } catch (error) {
            response.unprocessableEntity({message: error.message})
        }
    }

   /**
   *
   * @swagger
   * /api/v1/venues/{id}:
   *  get:
   *    summary: Mencari venue berdasarkan id
   *    description: Owner dapat melihat jadwal booking pada suatu venue
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Venue
   *    parameters:
   *     - in: path
   *       name : id
   *       required : true
   *       schema :
   *          type: number
   *          minimum: 1
   *       description: ID dari venue
   *    responses:
   *       200:
   *         description: Data venue ditemukan
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
    public async show({params, response}: HttpContextContract){
        let venue = await Venue.find(params.id)
        return response.status(200).json({message: 'success get venues with id', data: venue})
    }

    /**
   *
   * @swagger
   * /api/v1/venues/{id}:
   *  put:
   *    summary: Mengubah data venue berdasarkan id
   *    description: Owner dapat mengubah data venue.
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Venue
   *    parameters:
   *     - in: path
   *       name : id
   *       required : true
   *       schema :
   *          type: number
   *          minimum: 1
   *       description: ID dari venue
   *    requestBody:
   *      required : true
   *      content :
   *       application/x-www-form-urlencoded:
   *          $ref: '#/components/schemas/UpdateVenueBody'
   *       application/json:
   *          $ref: '#/components/schemas/UpdateVenueBody'
   *    responses:
   *       201:
   *         $ref: '#/components/responses/UpdateData'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       422:
   *         $ref: '#/components/responses/FailedUpdatedData'
   */
    public async update({request, response, params}: HttpContextContract){
        let id = params.id
        //Model Orm
        let NewVenue = await Venue.findOrFail(id)
        NewVenue.name = request.input('name')
        NewVenue.address = request.input('address')
        NewVenue.phone = request.input('phone')

        NewVenue.save()
        return response.status(200).json({message: 'updated'})
    }

    public async destroy({response, params}: HttpContextContract){
        let id = params.id
        let venue = await Venue.findOrFail(id)
        await venue.delete()
        return response.ok({message: 'deleted'})
    }
}
