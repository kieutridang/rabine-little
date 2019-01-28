import Boom from 'boom';
import { siteOrderInstructionValidation } from '../../validations';

module.exports = {
  method: 'GET',
  path: '/api/site/{siteId}/orders/{orderId}/signedURL/screenshot',
  config: {
    tags: ['api', 'site', 'order', 'instructions'],
    description: 'list site’s order instructions',
    notes: 'list site’s order instructions',
    auth: 'token',
    validate: {
      params: siteOrderInstructionValidation.getSignedURLScreenshotRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteOrderInstructionValidation.getSignedURLScreenshotResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: async (req, reply) => {
      const { site } = req.server;
      const { siteId, orderId } = req.params;

      const user = req.auth.credentials ? req.auth.credentials : {};

      const payload = {
        ...req.payload,
        type: 'screenshot',
        orderId,
        siteId
      };

      return site.Order.getSignedURL({ payload, user })
        .then((instructions) => {
          return reply({ instructions }).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
