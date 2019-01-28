const Boom = require('boom');

const { clientValidation } = require('../../validations');

const deleteClientRoute = {
  method: 'DELETE',
  path: '/api/client/{clientId}',
  config: {
    tags: ['api', 'client'],
    description: 'Delete client info',
    notes: 'Delete client info',
    auth: 'token',
    validate: {
      params: clientValidation.deleteClientRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: clientValidation.deleteClientResponseSchema
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
        .deleteClient(clientId)
        .then((item) => {
          if (item) {
            const { id } = item;
            return reply({ id }).code(200);
          }

          return reply(Boom.notFound());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = deleteClientRoute;
