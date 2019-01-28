const Boom = require('boom');

const { clientSheetValidation } = require('../../validations');

const getClientSheetRoute = {
  method: 'GET',
  path: '/api/client/{clientId}/sheet',
  config: {
    tags: ['api', 'client', 'bid sheet'],
    description: 'Get client bid sheet',
    notes: 'Get client bid sheet',
    auth: 'token',
    validate: {
      params: clientSheetValidation.getClientBidSheetRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: clientSheetValidation.getClientBidSheetResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { clientId } = req.params;
      const { clientBidSheet } = req.server;

      return clientBidSheet.getByClient(clientId)
        .then((bidSheet) => {
          if (bidSheet) {
            return reply(bidSheet).code(200);
          }

          return reply(Boom.notFound());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getClientSheetRoute;
