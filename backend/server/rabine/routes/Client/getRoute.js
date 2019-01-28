const Boom = require('boom');

const { clientValidation } = require('../../validations');

const getClientInfoRoute = {
  method: 'GET',
  path: '/api/client/{clientId}',
  config: {
    tags: ['api', 'client'],
    description: 'Get client info',
    notes: 'Get client info',
    auth: 'token',
    validate: {
      params: clientValidation.getClientInfoRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: clientValidation.getClientInfoResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { clientId } = req.params;
      const { client } = req.server;

      return client
        .getById(clientId)
        .then((clientItem) => {
          if (clientItem) {
            return reply(clientItem).code(200);
          }

          return reply(Boom.notFound());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getClientInfoRoute;
