import Boom from 'boom';
import { siteOrderValidation } from '../../validations';

module.exports = {
  method: 'GET',
  path: '/api/site/{siteId}/orders/{orderId}/instructions',
  config: {
    tags: ['api', 'site', 'order', 'instructions'],
    description: 'list site’s order instructions',
    notes: 'list site’s order instructions',
    auth: 'token',
    validate: {
      params: siteOrderValidation.listOrderInstructionsRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteOrderValidation.listOrderInstructionsResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: async (req, reply) => {
      const { site } = req.server;
      const { orderId } = req.params;

      return site.Order.findAllOrderInstructionsByOrderId(orderId)
        .then((instructions) => {
          return reply({ instructions }).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
