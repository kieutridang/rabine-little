const Boom = require('boom');

const { siteValidation } = require('../../validations');

const listOrderRoute = {
  method: 'GET',
  path: '/api/orders',
  config: {
    tags: ['api', 'orders'],
    description: 'Get orders',
    notes: 'Get orders',
    auth: 'token',
    validate: {
      query: siteValidation.getSitesRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteValidation.getSitesResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const filter = req.query;
      const { site } = req.server;

      return site.Order.findAll(filter)
        .then((orders) => {
          return reply(orders).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = listOrderRoute;
