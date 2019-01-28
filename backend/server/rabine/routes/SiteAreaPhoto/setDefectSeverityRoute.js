const Boom = require('boom');

const { siteAreaValidation } = require('../../validations');

const setDefectSeverityRoute = {
  method: 'PUT',
  path: '/api/site/{siteId}/areas/{areaId}/photos/{photoId}/severity/{severity}',
  config: {
    tags: ['api', 'site'],
    description: 'PUT photo defect severity',
    notes: 'Put photo defect severity',
    auth: 'token',
    validate: {
      params: siteAreaValidation.setAreaPhotoDefectedSeverityRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteAreaValidation.setAreaPhotoDefectedSeverityResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { site } = req.server;
      const setDefectedSeverity = req.params;

      return site.Area.setAreaPhotoDefectedSeverity(setDefectedSeverity)
        .then((found) => {
          if (found) {
            return reply({ success: true }).code(200);
          }

          return reply(Boom.notFound());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = setDefectSeverityRoute;
