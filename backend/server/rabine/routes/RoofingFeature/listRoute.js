const Boom = require('boom');

const { roofingFeatureValidation } = require('../../validations');

const listRoofRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/roofingFeature/{type?}',
  config: {
    tags: ['api', 'roofingFeature'],
    description: 'Get roofingFeature by siteId',
    notes: 'Get roofingFeature by siteId',
    validate: {
      params: roofingFeatureValidation.getRoofsRequest
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: roofingFeatureValidation.getRoofsResponse
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const request = req.params;
      const { roofingFeature } = req.server;

      return roofingFeature.list(request)
        .then((roofings) => {
          if (roofings) {
            return reply(roofings).code(200);
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
