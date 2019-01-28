const Boom = require('boom');
const { repairValidation } = require('../../validations');

const getRepairRoute = {
  method: 'GET',
  path: '/api/repairs/{repairId}',
  config: {
    tags: ['api', 'repair'],
    description: 'Get repair info',
    notes: 'Get repair info',
    validate: {
      params: repairValidation.getRepairRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: repairValidation.getRepairResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { repairId } = req.params;
      const { repair } = req.server;

      return repair.getById(repairId)
        .then((repairItem) => {
          if (repairItem) {
            return reply(repairItem).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getRepairRoute;
