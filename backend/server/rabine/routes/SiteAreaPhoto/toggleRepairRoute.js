const Boom = require('boom');

const { siteAreaValidation } = require('../../validations');

const toggleRepairSitePhotoRoute = {
  method: 'PUT',
  path: '/api/site/{siteId}/areas/{areaId}/photos/{photoId}/repair/{repair}',
  config: {
    tags: ['api', 'site'],
    description: 'PUT photo repair',
    notes: 'Put photo repair',
    auth: 'token',
    validate: {
      params: siteAreaValidation.toggleAreaPhotoRepairRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteAreaValidation.toggleAreaPhotoRepairResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { site } = req.server;
      const toggleAreaPhotoRepairRequest = req.params;

      return site.Area.toggleAreaPhotoRepair(toggleAreaPhotoRepairRequest)
        .then((found) => {

          if (found) {
            return reply({ success: true }).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = toggleRepairSitePhotoRoute;
