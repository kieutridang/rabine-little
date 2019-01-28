const Boom = require('boom');

const { hvacValidation } = require('../../validations');

const deleteHVACRoute = {
  method: 'DELETE',
  path: '/api/site/{siteId}/hvac/{id}',
  config: {
    tags: ['api', 'hvac'],
    description: 'Delete hvac by siteId and id',
    notes: 'Delete hvac by Id',
    auth: 'token',
    validate: {
      params: hvacValidation.deleteHVACRequest
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: hvacValidation.deleteHVACResponse
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const request = req.params;
      const { hvac } = req.server;

      return hvac.remove(request)
        .then((hvacs) => {
          return reply(hvacs).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = deleteHVACRoute;
