const Boom = require('boom');

const { roofingFeatureValidation } = require('../../validations');

const deleteRoofingFeatureRoute = {
  method: 'DELETE',
  path: '/api/site/{siteId}/roofingFeature/{id}',
  config: {
    tags: ['api', 'roofingFeature'],
    description: 'Delete roofingFeature by siteId and id',
    notes: 'Delete roofingFeature by Id',
    validate: {
      params: roofingFeatureValidation.RoofFeatureParams
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: roofingFeatureValidation.getRoofItemResponse
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const request = req.params;
      const { roofingFeature } = req.server;

      return roofingFeature.remove(request)
        .then((response) => {
          if (response.n > 0) {
            return reply({ success: true }).code(200);
          }

          return reply(Boom.notFound('no item', request));
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = deleteRoofingFeatureRoute;
