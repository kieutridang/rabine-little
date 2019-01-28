const Boom = require('boom');
const { siteRepairValidation } = require('../../validations');

const putRoute = {
  method: 'PUT',
  path: '/api/site/repair',
  config: {
    tags: ['api', 'site', 'repair'],
    description: 'Update site repair',
    notes: 'Update site repair',
    validate: {
      payload: siteRepairValidation.updateSiteRepairResponseSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteRepairValidation.updateSiteRepairResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const siteRepairInput = req.payload;
      const { site } = req.server;
      return site.Repair.updateSiteRepair(siteRepairInput)
        .then((siteRepair) => {
          if (siteRepair) {
            return reply(siteRepair).code(200);
          }

          return reply(Boom.internal());
        }).catch(err => reply(Boom.badRequest(err.message)));
    }
  }
};

module.exports = putRoute;
