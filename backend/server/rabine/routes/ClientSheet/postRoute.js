const Boom = require('boom');

const { clientSheetValidation } = require('../../validations');

const postClientBidSheetRoute = {
  method: 'POST',
  path: '/api/client/{clientId}/sheet',
  config: {
    tags: ['api', 'client', 'bid sheet'],
    description: 'Add client bid sheet',
    notes: 'Add client bid sheet',
    auth: 'token',
    validate: {
      params: clientSheetValidation.getClientBidSheetRequestSchema,
      payload: clientSheetValidation.postClientBidSheetRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: clientSheetValidation.postClientBidSheetResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: async (req, reply) => {
      const { clientId } = req.params;
      const { bidSheetData } = req.payload;

      const { clientBidSheet } = req.server;

      return clientBidSheet.create(clientId, bidSheetData)
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

module.exports = postClientBidSheetRoute;
