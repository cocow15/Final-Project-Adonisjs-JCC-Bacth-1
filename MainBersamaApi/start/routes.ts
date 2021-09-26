/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
//import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

Route.get('/', async () => {
  return { hello: 'world' }
}).as("home")

// Route.get('/venues', 'ContactsController.index').as('venues.index')
// Route.post('/venues', 'ContactsController.store').as('venues.store')
// Route.get('/venues/:id', 'ContactsController.show').as('venues.show')
// Route.put('/venues/:id', 'ContactsController.update').as('venues.update')
// Route.delete('/venues/:id', 'ContactsController.destroy').as('venues.destroy')
// Route.resource('venues', 'ContactsController').apiOnly().middleware({'*': ['auth', 'verify']})
// Route.resource('venues.fields', 'PostsController').apiOnly()
//Route.post('/bookings', 'BookingsController.booking').as('contacts.booking')
// Route.post('/fields/:id/bookings', 'BookingsController.booking').as('fields.booking').middleware(['auth'])
// Route.get('/bookings/:id', 'BookingsController.show').as('bookings.show').middleware(['auth'])
// Route.put('/bookings/:id', 'BookingsController.join').as('bookings.join').middleware(['auth'])

Route.group(() =>{
  Route.group(() =>{
    Route.group(() =>{
      Route.resource('venues', 'ContactsController').apiOnly()
      Route.resource('venues.fields', 'PostsController').apiOnly()
    }).middleware(['role'])
    
    Route.group(() =>{
      Route.post('/venues/:id/bookings', 'BookingsController.booking').as('venues.booking')
      Route.get('/schedules', 'BookingsController.schedule').as('user.schedules')
      Route.get('/bookings', 'BookingsController.index').as('bookings.index')
      Route.get('/bookings/:id', 'BookingsController.show').as('bookings.show')
      Route.put('/bookings/:id', 'BookingsController.join').as('bookings.join')
    })

  }).middleware(['auth', 'verify'])
  Route.post('/register', 'AuthController.register').as('auth.register')
  Route.post('/login', 'AuthController.login').as('auth.login')
  Route.post('/verifikasi-otp', 'AuthController.otpConfirmation').as('auth.otpVerify')
}).prefix('/api/v1')