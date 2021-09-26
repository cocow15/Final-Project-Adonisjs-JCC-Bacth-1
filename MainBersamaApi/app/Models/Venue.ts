import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import Field from 'App/Models/Field'

  /**
   *  @swagger
   *  definitions:
   *    Venue:
   *      type: object
   *      properties:
   *        id:
   *          type: uint
   *          readOnly: true
   *        name:
   *          type: string
   *        phone:
   *          type: string
   *        address:
   *          type: string
   *      required:
   *        - name
   *        - phone
   *        - address
   */

export default class Venue extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public address: string
  
  @column()
  public phone: string
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Field)
  public fields: HasMany<typeof Field>

}
