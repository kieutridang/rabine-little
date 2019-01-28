const Boom = require('boom');
const { clientValidation } = require('../../validations');

const putClientRoute = {
  method: 'PUT',
  path: '/api/client/{clientId}',
  config: {
    tags: ['api', 'client'],
    description: 'Update client by clientId',
    notes: 'Update client',
    auth: 'token',
    validate: {
      payload: clientValidation.postClientRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: clientValidation.postClientResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const clientRequest = req.payload;
      const { clientId } = req.params;
      const { client } = req.server;

      return client
        .findAndUpdate(clientId, clientRequest)
        .then((savedClient) => {
          if (savedClient) {
            return reply(savedClient).code(200);
          }
          return reply(Boom.notFound());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = putClientRoute;
