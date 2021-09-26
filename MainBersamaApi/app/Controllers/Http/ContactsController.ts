import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateContactValidator from 'App/Validators/CreateContactValidator'
//import Database from '@ioc:Adonis/Lucid/Database'
//MTQ.0rIBw4aSVYPpABSUh3lqwp6Oivf9GE_RnmH-JU8qkIi_I8Gjdw6NBpHMLfY9 owner
//MTM.xNuPL7rdolY3lfdIdmSuA_YYJSzq6y1QDjN8f1tQTm11qxt-7G_4N5S8Pahe owner
//Models
import Venue from 'App/Models/Venue';

export default class ContactsController {
    public async index({request, response}: HttpContextContract){
        if(request.qs().name){
            let name = request.qs().name
            let venuesFiltered = await Venue.findBy("name", name)
            return response.status(200).json({message: 'success get venues', data: venuesFiltered })
        }
        let venues = await Venue.query().preload('fields')
        return response.status(200).json({message: 'success get venues', data: venues })
    }

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

    public async show({params, response}: HttpContextContract){
        let venue = await Venue.find(params.id)
        return response.status(200).json({message: 'success get venues with id', data: venue})
    }

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
