import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateFieldValidator from 'App/Validators/CreateFieldValidator'
//Models
import Field from 'App/Models/Field';

export default class PostsController {
  public async index ({request, response}: HttpContextContract) {
    if(request.qs().name){
      let name = request.qs().name
      let fieldsFiltered = await Field.findBy("name", name)
      return response.status(200).json({message: 'success get contacts', data: fieldsFiltered })
    }
    let fields = await Field.query().preload('venues')
    return response.status(200).json({message: 'success get contacts', data: fields })
  }

  public async store ({request, response, params, auth}: HttpContextContract) {
    try {
        await request.validate(CreateFieldValidator) 

        //auth
        await auth.use('api').authenticate()

        //Lucid Orm
        let newField = new Field();
        newField.name = request.input('name')
        newField.type =  request.input('type')
        newField.venueId = params.venue_id

        await newField.save()
        response.created({message: 'created', data: newField})
    }catch (error) {
        response.unprocessableEntity({error: error.message})
    }
  }

  public async show ({params, response}: HttpContextContract) {
      //let field = await Database.from('fields').where('id', params.id).select('id', 'name', 'type', 'venue_id').firstOrFail()
      //let field = await Field.find(params.id)
      const field = await Field.query().where('id', params.id).preload('Bookings', (bookingqQuery)=>{
        bookingqQuery.select(['title', 'play_date_start', 'play_date_end'])
      }).firstOrFail()
      return response.status(200).json({message: 'success get fields with id', data: field})

  }

  public async update ({request, response, params}: HttpContextContract) {
      let id = params.id
      //Model Orm
      let newField = await Field.findOrFail(id);
      newField.name = request.input('name')
      newField.type =  request.input('type')
      newField.venueId = params.venue_id

      newField.save()
      return response.status(200).json({message: 'updated'})
  }

  public async destroy ({response, params}: HttpContextContract) {
      let id = params.id
      let field = await Field.findOrFail(id)
      await field.delete()
      return response.ok({message: 'deleted'})
  }
}
