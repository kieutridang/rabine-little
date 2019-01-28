const Boom = require('boom');

const { clientValidation } = require('../../validations');

const postClientInfoRoute = {
  method: 'POST',
  path: '/api/client',
  config: {
    tags: ['api', 'client'],
    description: 'Add new client',
    notes: 'post new client',
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
      const { client } = req.server;

      return client
        .create(clientRequest)
        .then((clientItem) => {
          if (clientItem) {
            return reply(clientItem).code(200);
          }

          return reply(Boom.internal());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = postClientInfoRoute;
