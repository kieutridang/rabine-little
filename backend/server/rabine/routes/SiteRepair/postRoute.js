const Boom = require('boom');
const { siteRepairValidation } = require('../../validations');

const postRoute = {
  method: 'POST',
  path: '/api/site/repair',
  config: {
    tags: ['api', 'site', 'repair'],
    description: 'Add new site repair',
    notes: 'Add new site repair',
    validate: {
      payload: siteRepairValidation.siteRepairRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteRepairValidation.siteRepairResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const siteRepairInput = req.payload;
      const { site } = req.server;
      return site.Repair.addSiteRepair(siteRepairInput)
        .then((siteRepair) => {
          if (siteRepair) {
            return reply(siteRepair).code(200);
          }

          return reply(Boom.internal());
        }).catch(err => reply(Boom.badRequest(err.message)));
    }
  }
};

module.exports = postRoute;
