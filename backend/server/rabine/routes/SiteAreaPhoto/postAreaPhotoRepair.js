const Boom = require('boom');

const { areaPhotoRepairValidation } = require('../../validations');

const postAreaPhotoRepair = {
  method: 'POST',
  path: '/api/photos/{photoId}/repairs',
  config: {
    tags: ['api', 'area photo', 'repairs'],
    description: 'add area photo repair',
    notes: 'add area photo repair',
    auth: 'token',
    validate: {
      params: areaPhotoRepairValidation.areaPhotoRepairParamSchema,
      payload: areaPhotoRepairValidation.postAreaPhotoRepairRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: areaPhotoRepairValidation.postAreaPhotoRepairResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { payload, params } = req;
      const { site } = req.server;

      const { photoId } = params;

      return site.AreaPhotoRepair.create(photoId, payload)
        .then((found) => {
          if (found) {
            return reply(found).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = postAreaPhotoRepair;
