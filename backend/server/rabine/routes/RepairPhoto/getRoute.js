const Boom = require('boom');
const { repairValidation } = require('../../validations');

const getRepairPhotosRoute = {
  method: 'GET',
  path: '/api/repairs/{repairId}/photos',
  config: {
    tags: ['api', 'repair', 'photos'],
    description: 'Get repair photos',
    notes: 'Get repair photos',
    validate: {
      params: repairValidation.getRepairPhotosRequest
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: repairValidation.getRepairPhotosResponse
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { repairId } = req.params;
      const { repair } = req.server;

      return repair.getRepairPhotos(repairId)
        .then((photos) => {
          if (photos) {
            return reply(photos).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getRepairPhotosRoute;
