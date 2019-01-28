import Boom from 'boom';
import { siteOrderValidation } from '../../validations';

module.exports = {
  method: 'GET',
  path: '/api/site/{siteId}/orders/{orderId}/notes',
  config: {
    tags: ['api', 'site', 'order', 'notes'],
    description: 'list site’s order notes',
    notes: 'list site’s order notes',
    auth: 'token',
    validate: {
      params: siteOrderValidation.listOrderNotesRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteOrderValidation.listOrderNotesResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: async (req, reply) => {
      const { site } = req.server;
      const { orderId } = req.params;

      return site.Order.findAllOrderNotesByOrderId(orderId)
        .then((notes) => {
          return reply({ notes }).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
