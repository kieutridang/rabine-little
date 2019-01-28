const Boom = require('boom');

const { roofingFeatureValidation } = require('../../validations');

const postRoofRoute = {
  method: 'POST',
  path: '/api/site/{siteId}/roofingFeature',
  config: {
    tags: ['api', 'roofingFeature'],
    description: 'Add roofingFeature',
    notes: 'Add roofingFeature',
    validate: {
      params: roofingFeatureValidation.postRoofParamRequest,
      payload: roofingFeatureValidation.postRoofPayloadRequest
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: roofingFeatureValidation.postRoofResponse
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const payloadRequest = req.payload;
      const { siteId } = req.params;
      const { roofingFeature } = req.server;

      return roofingFeature.post(siteId, payloadRequest)
        .then((roofing) => {
          return reply(roofing).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = postRoofRoute;
