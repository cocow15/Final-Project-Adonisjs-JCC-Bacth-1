import { SwaggerConfig } from '@ioc:Adonis/Addons/Swagger'

export default {
	uiEnabled: true, //disable or enable swaggerUi route
	uiUrl: 'docs', // url path to swaggerUI
	specEnabled: true, //disable or enable swagger.json route
	specUrl: '/swagger.json',

	middleware: [], // middlewares array, for protect your swagger docs and spec endpoints

	options: {
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'Application Main Bersama API',
				version: '1.0.0',
				description: 'Documentation of My application Main Bersama API'
			},
			components: {
				securitySchemes:{
					bearerAuth:{
						type: 'http',
						scheme: 'bearer'
					}
				},
				schemas: {
					otpConfirmation: {
					  type: "object",
					  properties: {
						email: {
						  type: "string",
						},
						otp_code: {
						  type: "string",
						},
					  },
					  required: ["email", "otp_code"],
					},
					loginSchema: {
					  type: "object",
					  properties: {
						email: {
						  type: "string",
						},
						password: {
						  type: "string",
						},
					  },
					  required: ["email", "password"],
					},
					UpdateVenueBody: {
						schema: {
						  type: "object",
						  properties: {
							name: {
							  type: "string"
							},
							phone: {
							  type: "string"
							},
							address: {
							  type: "string"
							}
						  }
						}
					}
				},
				responses: {
					Unauthorized: {
						description: "Anda tidak memiliki hak akses",
						content: {
						  "application/json": {
							schema: {
							  type: "object",
							  properties: {
								message: {
								  type: "string",
								  example: "E_UNAUTHORIZED_ACCESS: Unauthorized access"
								}
							  }
							}
						  }
						}
					},
					CreatedData: {
						description: "Berhasil menambahkan data",
						content: {
						  "application/json": {
							schema: {
							  type: "object",
							  properties: {
								message: {
								  type: "string",
								  example: "Berhasil menambahkan data"
								}
							  }
							}
						  }
						}
					}
				}
			}
		},

		apis: [
			'app/**/*.ts',
			'docs/swagger/**/*.yml',
			'start/routes.ts'
		],
		basePath: '/'
	},
	mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'RUNTIME',
  specFilePath: 'docs/swagger.json'
} as SwaggerConfig
