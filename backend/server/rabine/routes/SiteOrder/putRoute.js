import Boom from 'boom';
import { siteOrderValidation } from '../../validations';

module.exports = {
  method: 'PUT',
  path: '/api/site/{siteId}/orders/{_id}',
  config: {
    tags: ['api', 'site', 'order'],
    description: 'put sites order',
    notes: 'put site’s order',
    auth: 'token',
    validate: {
      params: siteOrderValidation.putOrdersRequestSchema,
      payload: siteOrderValidation.putOrdersPayloadSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteOrderValidation.putOrdersResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: async (req, reply) => {
      const { site } = req.server;
      const { siteId, _id } = req.params;

      const user = req.auth.credentials ? req.auth.credentials : {};

      const payload = {
        ...req.payload,
        siteId
      };

      return site.Order.updateOrderServicesByOrderId({ _id, payload, user })
        .then((updated) => {
          return reply(updated).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
