const Boom = require('boom');

const { siteAreaValidation } = require('../../validations');

const setAreaPhotoRepairName = {
  method: 'PUT',
  path: '/api/site/{siteId}/areas/{areaId}/photos/{photoId}/repairName/{repairInstanceId?}',
  config: {
    tags: ['api', 'site'],
    description: 'PUT photo repair name',
    notes: 'Put photo repair name',
    auth: 'token',
    validate: {
      params: siteAreaValidation.setAreaPhotoRepairNameRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteAreaValidation.setAreaPhotoRepairNameResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { params } = req;
      const { site } = req.server;

      return site.Area.setAreaPhotoRepairInstance(params)
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

module.exports = setAreaPhotoRepairName;
