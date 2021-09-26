import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Field from 'App/Models/Field'

/**
*  @swagger
*  definitions:
*    Booking:
*      type: object
*      properties:
*        id:
*          type: uint
*          readOnly: true
*        title:
*          type: string
*        play_date_start:
*          type: string
*          format: date
*          description: "Format waktu adalah yyyy-MM-ddTHH:mm:ss, contoh: 2021-09-27T12:00:00"
*        play_date_end:
*          type: string
*          format: date
*          description: "Format waktu adalah yyyy-MM-ddTHH:mm:ss, contoh: 2021-09-27T12:00:00"
*        userId:
*          type: string
*          readOnly: true
*        fieldId:
*          type: string
*          readOnly: true
*      required:
*        - title
*        - play_date_start
*        - play_date_end
*/
export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public title: string

  @column()
  public play_date_start: DateTime

  @column()
  public play_date_end: DateTime

  @column()
  public userId: number

  @column()
  public fieldId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @manyToMany(() => User,{
    pivotTable: 'users_has_bookings'
  })
  public players: ManyToMany<typeof User> 

  @belongsTo(() => User)
  public bookingUser: BelongsTo<typeof User>

  @belongsTo(() => Field)
  public field: BelongsTo<typeof Field>

}
