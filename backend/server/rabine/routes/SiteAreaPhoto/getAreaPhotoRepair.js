const Boom = require('boom');

const { areaPhotoRepairValidation } = require('../../validations');

const getAreaPhotoRepair = {
  method: 'GET',
  path: '/api/photos/{photoId}/repairs',
  config: {
    tags: ['api', 'area photo', 'repairs'],
    description: 'get area photo repair',
    notes: 'get area photo repair',
    auth: 'token',
    validate: {
      params: areaPhotoRepairValidation.getAreaPhotoRepairsRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: areaPhotoRepairValidation.getAreaPhotoRepairsResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { params } = req;
      const { site } = req.server;
      const { photoId } = params;

      return site.AreaPhotoRepair.getRepairsOfPhoto(photoId)
        .then((repairs) => {
          if (repairs) {
            return reply(repairs).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getAreaPhotoRepair;
