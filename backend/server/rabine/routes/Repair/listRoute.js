const Boom = require('boom');

const { repairValidation } = require('../../validations');

const getRepairListRoute = {
  method: 'GET',
  path: '/api/repairs',
  config: {
    tags: ['api', 'repair'],
    description: 'Get all repairs list',
    notes: 'Get all repairs list',
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: repairValidation.getRepairListResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { title } = req.params;
      const { repair } = req.server;

      return repair.list({ title })
        .then((repairs) => {
          if (repairs) {
            return reply(repairs).code(200);
          }

          return reply(Boom.notFound());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getRepairListRoute;
