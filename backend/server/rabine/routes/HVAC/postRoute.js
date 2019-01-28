const Boom = require('boom');

const { hvacValidation } = require('../../validations');

const listHVACRoute = {
  method: 'POST',
  path: '/api/site/{siteId}/hvac',
  config: {
    tags: ['api', 'hvac'],
    description: 'Add HVAC',
    notes: 'create new hvac',
    auth: 'token',
    validate: {
      params: hvacValidation.getHVACsRequest,
      payload: hvacValidation.postHVACsPayloadRequest
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: hvacValidation.HVACSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { siteId } = req.params;
      const payloadRequest = req.payload;
      const { hvac } = req.server;

      return hvac.post(siteId, payloadRequest)
        .then((roofItem) => {
          return reply(roofItem).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = listHVACRoute;
