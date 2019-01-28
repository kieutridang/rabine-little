const Boom = require('boom');

const { areaPhotoValidation, siteAreaValidation } = require('../../validations');

const putSitePhotoRoute = {
  method: 'PUT',
  path: '/api/site/{siteId}/areas/{areaId}/photos/{photoId}',
  config: {
    tags: ['api', 'site'],
    description: 'PUT site area photos',
    notes: 'Put site area photos',
    auth: 'token',
    validate: {
      params: siteAreaValidation.getSiteAreaRequestSchema,
      payload: areaPhotoValidation.putPhotoRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: areaPhotoValidation.putPhotoResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { site } = req.server;

      return site.Area.updateAreaPhoto(req.params, req.payload)
        .then((area) => {
          if (area) {
            return reply(area).code(200);
          }

          return reply(Boom.notFound());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = putSitePhotoRoute;
