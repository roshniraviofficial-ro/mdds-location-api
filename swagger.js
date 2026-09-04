const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'MDDS Location API',
    description: 'Master Data Directory System - Location Hierarchy API with Redis Caching and API Key Security',
  },
  host: 'localhost:5000',
  schemes: ['http'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'x-api-key',
      description: 'Enter your API Key (Default: mdds-secret-key-123)'
    }
  },
  security: [
    {
      apiKeyAuth: []
    }
  ]
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);