import Boom from 'boom';
import { siteOrderValidation } from '../../validations';

module.exports = {
  method: 'POST',
  path: '/api/site/{siteId}/orders',
  config: {
    tags: ['api', 'site', 'order'],
    description: 'post sites order',
    notes: 'post site’s order',
    auth: 'token',
    validate: {
      params: siteOrderValidation.postOrdersRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteOrderValidation.postOrdersResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: async (req, reply) => {
      const { site } = req.server;
      const { siteId } = req.params;

      const user = req.auth.credentials ? req.auth.credentials : {};

      const payload = {
        ...req.payload,
        siteId
      };

      return site.Order.create({ payload, user })
        .then((createdOrder) => {
          return reply(createdOrder).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
