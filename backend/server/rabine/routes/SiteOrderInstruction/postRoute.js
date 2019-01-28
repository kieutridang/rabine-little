import Boom from 'boom';
import { siteOrderInstructionValidation } from '../../validations';

module.exports = {
  method: 'POST',
  path: '/api/site/{siteId}/orders/{orderId}/instructions',
  config: {
    tags: ['api', 'site', 'order', 'instructions'],
    description: 'post sites order instructions',
    notes: 'post site’s order instructions',
    auth: 'token',
    validate: {
      params: siteOrderInstructionValidation.postOrderInstructionsRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteOrderInstructionValidation.postOrderInstructionsResponseSchema
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
        orderId,
        siteId
      };

      return site.Order.createOrderInstruction({ payload, user })
        .then((createdOrderInstruction) => {
          return reply(createdOrderInstruction).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
