import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Raízes do Nordeste API',
      version: '1.0.0',
      description: 'API REST para rede de lanchonetes Raízes do Nordeste'
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/api/routes/*.js']
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec