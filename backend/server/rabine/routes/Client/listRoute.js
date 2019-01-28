const Boom = require('boom');

const { clientValidation } = require('../../validations');

const listClientRoute = {
  method: 'GET',
  path: '/api/client',
  config: {
    tags: ['api', 'client'],
    description: 'Get clients',
    notes: 'Get clients',
    auth: 'token',
    validate: {
      query: clientValidation.getClientsRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: clientValidation.getClientsResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const filter = req.query;
      const { client } = req.server;

      return client
        .list(filter)
        .then((clients) => {
          return reply(clients).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = listClientRoute;
