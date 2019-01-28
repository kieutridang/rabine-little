const Boom = require('boom');
const { siteRepairValidation } = require('../../validations');

const deleteRoute = {
  method: 'DELETE',
  path: '/api/site/repair/{id}',
  config: {
    tags: ['api', 'site', 'repair'],
    description: 'Delete site repair',
    notes: 'Delete site repair',
    validate: {
      params: siteRepairValidation.deleteRepairRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteRepairValidation.deleteRepairResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { id } = req.params;
      const { site } = req.server;
      return site.Repair.deleteSiteRepair(id)
        .then((response) => {
          if (response.ok) {
            return reply({ id }).code(200);
          }

          return reply(Boom.internal());
        }).catch(err => reply(Boom.badRequest(err.message)));
    }
  }
};

module.exports = deleteRoute;
