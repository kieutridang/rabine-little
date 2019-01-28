const Boom = require('boom');

const { hvacValidation } = require('../../validations');

const listHVACRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/hvac',
  config: {
    tags: ['api', 'hvac'],
    description: 'Get hvacs by siteId',
    notes: 'Get hvac by siteId',
    auth: 'token',
    validate: {
      params: hvacValidation.getHVACsRequest
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: hvacValidation.getHVACsResponse
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const request = req.params;
      const { hvac } = req.server;

      return hvac.list(request)
        .then((hvacs) => {
          return reply(hvacs).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = listHVACRoute;
