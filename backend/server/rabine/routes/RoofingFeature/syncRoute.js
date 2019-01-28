const Boom = require('boom');

const { roofingFeatureValidation } = require('../../validations');

const listRoofRoute = {
  method: 'POST',
  path: '/api/site/roofingFeature/sync/{siteId}',
  config: {
    tags: ['api', 'roofingFeature', 'roofing'],
    description: 'Sync roofing feature',
    notes: 'Sync roofing',
    validate: {
      params: roofingFeatureValidation.syncPavementToRoofingParamRequest
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: roofingFeatureValidation.syncPavementToRoofingResponse
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const request = req.params;
      const { syncFeatureToRoofing } = req.server;

      return syncFeatureToRoofing.sync(request)
        .then((roofing) => {
          if (roofing) {
            return reply(roofing).code(200);
          }

          return reply(Boom.notFound());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = listRoofRoute;
