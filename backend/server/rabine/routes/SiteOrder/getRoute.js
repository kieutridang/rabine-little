import Boom from 'boom';
import { siteOrderValidation } from '../../validations';

module.exports = {
  method: 'GET',
  path: '/api/site/{siteId}/orders/{_id}',
  config: {
    tags: ['api', 'site', 'order'],
    description: 'get site’s orders',
    notes: 'get site’s orders',
    auth: 'token',
    validate: {
      params: siteOrderValidation.getOrdersItemRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteOrderValidation.getOrdersItemResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: async (req, reply) => {
      const { site } = req.server;
      const { _id } = req.params;

      return site.Order.findOneById(_id)
        .then((foundOrder) => {
          return reply(foundOrder).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
