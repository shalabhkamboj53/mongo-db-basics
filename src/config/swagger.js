const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mongo DB Basics API',
      version: '1.0.0',
      description: 'API documentation for database setup, seeding, and MongoDB practice queries.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    tags: [
      { name: 'Setup' },
      { name: 'Users' },
      { name: 'Orders' },
      { name: 'Assignment' },
      { name: 'CRUD' },
    ],
    components: {
      schemas: {
        Item: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1' },
            name: { type: 'string', example: 'Shalabh' },
          },
          required: ['id', 'name'],
        },
        ItemInput: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Shalabh' },
          },
          required: ['name'],
        },
        ItemResponse: {
          type: 'object',
          properties: {
            data: {
              $ref: '#/components/schemas/Item',
            },
          },
          required: ['data'],
        },
        ItemListResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Item' },
            },
          },
          required: ['data'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Item not found' },
          },
          required: ['message'],
        },
      },
    },
    paths: {
      '/api/setup': {
        post: {
          tags: ['Setup'],
          summary: 'Initialize database collections and setup tasks',
          responses: {
            200: { description: 'Setup completed successfully' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/api/seed': {
        post: {
          tags: ['Setup'],
          summary: 'Seed initial data into database',
          responses: {
            201: { description: 'Seed data inserted successfully' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/api/users/read': {
        get: {
          tags: ['Users'],
          summary: 'Run basic read operations for users',
          responses: {
            200: { description: 'Read operations result' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/api/users/operators': {
        get: {
          tags: ['Users'],
          summary: 'Run query operators examples',
          responses: {
            200: { description: 'Query operator results' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/api/users/projection': {
        get: {
          tags: ['Users'],
          summary: 'Run projection examples',
          responses: {
            200: { description: 'Projection results' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/api/users/update': {
        patch: {
          tags: ['Users'],
          summary: 'Run user update operations',
          responses: {
            200: { description: 'Update operations result' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/api/users/delete': {
        delete: {
          tags: ['Users'],
          summary: 'Run user delete operations',
          responses: {
            200: { description: 'Delete operations result' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/api/users/sort-limit': {
        get: {
          tags: ['Users'],
          summary: 'Run sorting and limiting examples',
          responses: {
            200: { description: 'Sort and limit results' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/api/users/count-distinct': {
        get: {
          tags: ['Users'],
          summary: 'Run count and distinct examples',
          responses: {
            200: { description: 'Count and distinct results' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/api/users/indexing': {
        post: {
          tags: ['Users'],
          summary: 'Create indexes and run indexing tasks',
          responses: {
            200: { description: 'Indexing task result' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/api/users/aggregation': {
        get: {
          tags: ['Users'],
          summary: 'Run user aggregation pipeline',
          responses: {
            200: { description: 'Aggregation result' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/api/orders/tasks': {
        get: {
          tags: ['Orders'],
          summary: 'Run orders collection tasks',
          responses: {
            200: { description: 'Orders task result' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/api/assignment/final': {
        get: {
          tags: ['Assignment'],
          summary: 'Run final assignment queries',
          responses: {
            200: { description: 'Final assignment result' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/crud': {
        get: {
          tags: ['CRUD'],
          summary: 'Get all items',
          responses: {
            200: {
              description: 'List of items',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ItemListResponse' },
                },
              },
            },
          },
        },
        post: {
          tags: ['CRUD'],
          summary: 'Create a new item',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ItemInput' },
              },
            },
          },
          responses: {
            201: {
              description: 'Item created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ItemResponse' },
                },
              },
            },
            400: {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/crud/{id}': {
        get: {
          tags: ['CRUD'],
          summary: 'Get item by id',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string', minimum: 1 },
              description: 'Item id',
            },
          ],
          responses: {
            200: {
              description: 'Single item',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ItemResponse' },
                },
              },
            },
            400: {
              description: 'Invalid id',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            404: {
              description: 'Item not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        put: {
          tags: ['CRUD'],
          summary: 'Update item by id',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string', minimum: 1 },
              description: 'Item id',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ItemInput' },
              },
            },
          },
          responses: {
            200: {
              description: 'Updated item',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ItemResponse' },
                },
              },
            },
            400: {
              description: 'Invalid input or id',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            404: {
              description: 'Item not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        delete: {
          tags: ['CRUD'],
          summary: 'Delete item by id',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string', minimum: 1 },
              description: 'Item id',
            },
          ],
          responses: {
            204: { description: 'Item deleted' },
            400: {
              description: 'Invalid id',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            404: {
              description: 'Item not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;