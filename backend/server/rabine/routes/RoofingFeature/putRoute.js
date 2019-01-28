const Boom = require('boom');

const { roofingFeatureValidation } = require('../../validations');

const putRoofRoute = {
  method: 'PUT',
  path: '/api/site/{siteId}/roofingFeature/{id}',
  config: {
    tags: ['api', 'roofingFeature'],
    description: 'Update roofingFeature',
    notes: 'Update roofingFeature',
    validate: {
      params: roofingFeatureValidation.RoofFeatureParams,
      payload: roofingFeatureValidation.putRoofPayloadRequest
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: roofingFeatureValidation.putRoofResponse
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const payloadRequest = req.payload;
      const { siteId, id } = req.params;
      const { roofingFeature } = req.server;

      return roofingFeature.update(siteId, id, payloadRequest)
        .then((roofing) => {
          return reply(roofing).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = putRoofRoute;
