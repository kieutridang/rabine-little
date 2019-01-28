const Boom = require('boom');
const { siteRepairValidation } = require('../../validations');

const listRepairPolygonRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/polygon/repairs',
  config: {
    tags: ['api', 'repair', 'site'],
    description: 'Get list site polygon repair',
    notes: 'Get list site polygon repair ',
    validate: {
      params: siteRepairValidation.repairRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteRepairValidation.repairResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { siteId } = req.params;
      const { site } = req.server;

      return site.Repair.listRepairPolygon(siteId)
        .then(repairs => reply(repairs))
        .catch(err => reply(Boom.badRequest(err.message)));
    }
  }
};

module.exports = listRepairPolygonRoute;
