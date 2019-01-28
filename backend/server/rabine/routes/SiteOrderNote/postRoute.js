import Boom from 'boom';
import { siteOrderValidation } from '../../validations';

module.exports = {
  method: 'POST',
  path: '/api/site/{siteId}/orders/{orderId}/notes',
  config: {
    tags: ['api', 'site', 'order', 'notes'],
    description: 'post sites order notes',
    notes: 'post site’s order notes',
    auth: 'token',
    validate: {
      params: siteOrderValidation.postOrderNotesRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteOrderValidation.postOrderNotesResponseSchema
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

      return site.Order.createOrderNote({ payload, user })
        .then((createdOrderNote) => {
          return reply(createdOrderNote).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
