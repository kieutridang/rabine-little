const Boom = require('boom');

const { siteAreaValidation } = require('../../validations');

const setAreaPhotoDefectedType = {
  method: 'PUT',
  path: '/api/site/{siteId}/areas/{areaId}/photos/{photoId}/defectType/{repairId}',
  config: {
    tags: ['api', 'site'],
    description: 'PUT site area photos',
    notes: 'Put site area photos',
    auth: 'token',
    validate: {
      params: siteAreaValidation.setAreaPhotoDefectedTypeRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteAreaValidation.setAreaPhotoDefectedTypeResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { site } = req.server;
      const parms = req.params;

      return site.Area.setAreaPhotoDefectedType(parms)
        .then((isSuccess) => {
          if (isSuccess) {
            return reply({ success: true }).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = setAreaPhotoDefectedType;
