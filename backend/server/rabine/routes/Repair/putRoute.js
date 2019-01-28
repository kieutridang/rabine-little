const Boom = require('boom');

const { repairValidation } = require('../../validations');

const putRepairListRoute = {
  method: 'PUT',
  path: '/api/repairs/{repairId}',
  config: {
    tags: ['api', 'repair'],
    description: 'Put to repairs',
    notes: 'Put to repairs',
    validate: {
      payload: repairValidation.repairSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: repairValidation.repairResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { repairId } = req.params;
      const { repair } = req.server;
      const { title } = req.payload;

      return repair.update(repairId, { title }).then((updated) => {
        if (updated) {
          return reply(updated).code(200);
        }

        return reply(Boom.notFound());
      }).catch((err) => {
        return reply(Boom.badRequest(err.message));
      });
    }
  }
};

module.exports = putRepairListRoute;
