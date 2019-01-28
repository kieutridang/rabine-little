import Boom from 'boom';
import { siteOrderValidation } from '../../validations';

module.exports = {
  method: 'GET',
  path: '/api/site/{siteId}/orders',
  config: {
    tags: ['api', 'site', 'order'],
    description: 'list site’s orders',
    notes: 'list site’s orders',
    auth: 'token',
    validate: {
      params: siteOrderValidation.listOrdersRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteOrderValidation.listOrdersResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: async (req, reply) => {
      const { site } = req.server;
      const { siteId } = req.params;

      return site.Order.findAllBySiteId(siteId)
        .then((orders) => {
          return reply({ orders }).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
