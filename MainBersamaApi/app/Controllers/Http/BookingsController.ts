import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import CreateBookingValidator from 'App/Validators/CreateBookingValidator'
import Field from 'App/Models/Field'
import Database from '@ioc:Adonis/Lucid/Database'
//MTE.kDf2498JGBrfspJz36Pg-CyI79W0YaGd4CekPN3vRJzotAcASZxBYJhn5ref user
export default class BookingsController {
    public async index({response}: HttpContextContract){
        let bookings = await Booking.query().preload('field').preload('players', (query) => {
            query.select('id', 'name', 'email')
        })
        return response.status(200).json({message: 'success get venues', data: bookings})
    }
    
    
    public async booking({request, response, params, auth}: HttpContextContract){
        try {
            const field = await Field.findByOrFail('id', params.id)
            const user = auth.user!
            await request.validate(CreateBookingValidator) 
            
            //Lucid Orm
            const newBooking = new Booking();
            newBooking.title = request.input('title')//payload.title
            newBooking.play_date_start = request.input('play_date_start') //payload.play_date_start
            newBooking.play_date_end = request.input('play_date_end') //payload.play_date_end
            
            await newBooking.related('field').associate(field)
            await user.related('myBooking').save(newBooking)

            return response.status(200).json({message: 'berhasil booking', data: newBooking})
        } catch (error) {
            response.unprocessableEntity({message: error.message})
        }
    }
    
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
