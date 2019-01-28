const Boom = require('boom');

const { hvacValidation } = require('../../validations');

const listHVACRoute = {
  method: 'PUT',
  path: '/api/site/{siteId}/hvac/{id}',
  config: {
    tags: ['api', 'hvac'],
    description: 'update HVAC',
    notes: 'update new hvac',
    auth: 'token',
    validate: {
      params: hvacValidation.putHVACRequest,
      payload: hvacValidation.putHVACPayloadRequest
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: hvacValidation.putHVACRespone
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { id } = req.params;
      const payloadRequest = req.payload;
      const { hvac } = req.server;

      return hvac.update(id, payloadRequest)
        .then((hvacItem) => {
          return reply(hvacItem).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = listHVACRoute;
