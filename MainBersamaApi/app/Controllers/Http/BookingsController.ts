import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import CreateBookingValidator from 'App/Validators/CreateBookingValidator'
import Field from 'App/Models/Field'
import Database from '@ioc:Adonis/Lucid/Database'

export default class BookingsController {
    /**
   *
   * @swagger
   * /api/v1/bookings:
   *  get:
   *    summary: Menampilkan list booking
   *    description: User dan Owner dapat melihat list booking
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Booking
   *    responses:
   *       200:
   *         description: success get bookings data
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */

    public async index({response}: HttpContextContract){
        let bookings = await Booking.query().preload('field').preload('players', (query) => {
            query.select('id', 'name', 'email')
        })
        return response.status(200).json({message: 'success get bookings data', data: bookings})
    }
   
   /**
   *
   * @swagger
   * /api/v1/venues/{field_id}/bookings:
   *  post:
   *    summary: Menambahkan jadwal booking baru
   *    description: User dan Owner dapat membuat jadwal booking di venue untuk tanggal tertentu.
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Booking
   *    parameters:
   *       - in: path
   *         name : field_id
   *         required : true
   *         schema :
   *            type: number
   *            minimum: 1
   *         description: ID dari venue field yang akan di booking
   *    requestBody:
   *      required : true
   *      content :
   *        application/x-www-form-urlencoded:
   *          schema:
   *            $ref: '#definitions/Booking'
   *        application/json:
   *          schema:
   *            $ref: '#definitions/Booking'
   *    responses:
   *       201:
   *         $ref: '#/components/responses/CreatedData'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
    public async booking({request, response, params, auth}: HttpContextContract){
        try {
            const field = await Field.findByOrFail('id', params.id)
            const user = auth.user!
            await request.validate(CreateBookingValidator) 
            
            //Lucid Orm
            const newBooking = new Booking();
            newBooking.title = request.input('title')
            newBooking.play_date_start = request.input('play_date_start') 
            newBooking.play_date_end = request.input('play_date_end')
            
            await newBooking.related('field').associate(field)
            await user.related('myBooking').save(newBooking)

            return response.status(200).json({message: 'berhasil booking', data: newBooking})
        } catch (error) {
            response.unprocessableEntity({message: error.message})
        }
    }

   /**
   *
   * @swagger
   * /api/v1/bookings/{id}:
   *  get:
   *    summary: Menampilkan data booking berdasarkan id
   *    description: Menampilkan detail booking dengan id tertentu beseta list pemain yang sudah mendaftar
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Booking
   *    parameters:
   *       - in: path
   *         name : id
   *         required : true
   *         schema :
   *          type: number
   *          minimum: 1
   *         description: Masukan id booking
   *    responses:
   *       200:
   *         description: berhasil get data booking by id
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
    public async show({params, response }: HttpContextContract) {
        try {
            const booking = await Booking.query()
                .select('id', 'play_date_start', 'play_date_end')
                .where('id', '=', params.id)
                .withCount('players', (query) => {
                    query.as('players_count')
                })
                .preload('players', (query) => {
                    query.select('id', 'name', 'email')
                })
                .firstOrFail()
            const {id, play_date_start, play_date_end, players} = booking.toJSON()
            const players_count = booking.$extras.players_count
            response.ok({ message : 'berhasil get data booking by id', data: {id, play_date_start, play_date_end, players_count, players}})
        } catch (error) {
            if (error.messages) {
                return response.unprocessableEntity({ message: 'failed', error: error.messages})
            } else {
                return response.unprocessableEntity({ message: 'failed', error: error.message})
            }
        }
    }
    
    /**
    * 
    * @swagger
    * /api/v1/bookings/{booking_id}/join:
    *  put:
    *    summary: Join ke jadwal booking
    *    description: User dan Owner dapat melakukan join atau unjoin terhadap suatu jadwal.
    *    security:
    *      - bearerAuth: [] 
    *    tags:
    *      - Booking
    *    parameters:
    *       - in: path
    *         name : booking_id
    *         required : true
    *         schema :
    *            type: number
    *            minimum: 1
    *         description: masukkan booking_id
    *    responses:
    *       200:
    *         description: Berhasil melakukan join
    *         content:
    *            application/json:
    *                example:
    *                 message: "successfully join/unjoin"
    *       401:
    *         $ref: '#/components/responses/Unauthorized'
    */
    public async join({response, auth, params}:HttpContextContract){
        const booking = await Booking.findOrFail(params.id)
        let user = auth.user!
        const checkJoin = await Database.from('users_has_bookings').where('booking_id', params.id).where('user_id', user.id).first()

        if (!checkJoin) {
            await booking.related('players').attach([user.id])
        } else {
            await booking.related('players').detach([user.id])
        }

        return response.ok({message: 'success', data: 'successfully join/unjoin'})
    }

    /**
   *
   * @swagger
   * /api/v1/schedules:
   *  get:
   *    summary: Mendapatkan jadwal main
   *    description: Menampilkan list booking yang diikuti oleh user yang sedang melakukan login
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Booking
   *    responses:
   *       200:
   *         description: Jadwal user ditemukan
   *         content:
   *            application/json:
   *                example:
   *                 message: "Berhasil mendapatkan data list booking"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
    public async schedule({auth, response}:HttpContextContract){
        let user = auth.user!
        let i, result;
        let jadwal = [{}];
        const schedule = await Database.from('users_has_bookings').where('user_id', user.id).select('*')
        if (!schedule) {
            return response.status(400).json({message: 'You dont have any schedule'})
        } else {
            for(i=0; i<schedule.length; i++){
                result = await Booking.query().where('id', schedule[i].booking_id).preload('field').preload('players', (query) => {
                    query.select('id', 'name', 'email')
                })
                jadwal[i] = result
            }

            return response.ok({message: 'Your schedule', data: jadwal})
        }
    }
}
