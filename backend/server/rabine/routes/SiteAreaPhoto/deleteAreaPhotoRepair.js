const Boom = require('boom');

const { areaPhotoRepairValidation } = require('../../validations');

const deleteAreaPhotoRepair = {
  method: 'DELETE',
  path: '/api/photos/{photoId}/repairs/{repairId}',
  config: {
    tags: ['api', 'area photo', 'repairs'],
    description: 'delete area photo repair',
    notes: 'delete area photo repair',
    auth: 'token',
    validate: {
      params: areaPhotoRepairValidation.deleteAreaPhotoRepairParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: areaPhotoRepairValidation.deleteAreaPhotoRepairResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { params } = req;
      const { site } = req.server;
      const { photoId, repairId } = params;

      return site.AreaPhotoRepair.remove(photoId, repairId)
        .then((isSuccess) => {
          if (isSuccess) {
            return reply({ isSuccess }).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = deleteAreaPhotoRepair;
