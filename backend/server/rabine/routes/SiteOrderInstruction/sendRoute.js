import Boom from 'boom';
import { siteOrderInstructionValidation } from '../../validations';

module.exports = {
  method: 'PUT',
  path: '/api/site/{siteId}/orders/{orderId}/instructions/send',
  config: {
    tags: ['api', 'site', 'order', 'instructions', 'send'],
    description: 'put sites order instructions for send',
    notes: 'put site’s order instructions for send',
    auth: 'token',
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteOrderInstructionValidation.putOrderInstructionsSendResponseSchema
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
        orderId,
        siteId
      };

      return site.Order.sendOrderInstruction({ payload, user })
        .then((sent) => {
          return reply(sent).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
