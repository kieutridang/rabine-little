const Boom = require('boom');

const { siteAreaValidation } = require('../../validations');

const toggleDefectedSitePhotoRoute = {
  method: 'PUT',
  path: '/api/site/{siteId}/areas/{areaId}/photos/{photoId}/defect/{defected}',
  config: {
    tags: ['api', 'site'],
    description: 'PUT photo defected',
    notes: 'Put photo defected',
    auth: 'token',
    validate: {
      params: siteAreaValidation.toggleAreaPhotoRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteAreaValidation.toggleAreaPhotoResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { site } = req.server;
      const toggleAreaPhotoRequest = req.params;

      return site.Area.toggleAreaPhotoDefected(toggleAreaPhotoRequest)
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

module.exports = toggleDefectedSitePhotoRoute;
