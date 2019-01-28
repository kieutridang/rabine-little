import Boom from 'boom';
import { siteOrderValidation } from '../../validations';

module.exports = {
  method: 'GET',
  path: '/api/site/{siteId}/orders/{orderId}/activity',
  config: {
    tags: ['api', 'site', 'order', 'activity'],
    description: 'list site’s order activity',
    notes: 'list site’s order activity',
    auth: 'token',
    validate: {
      params: siteOrderValidation.listOrderActivityRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteOrderValidation.listOrderActivityResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: async (req, reply) => {
      const { site } = req.server;
      const { orderId } = req.params;

      return site.Order.findAllOrderActivityByOrderId(orderId)
        .then((activity) => {
          return reply(activity).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
