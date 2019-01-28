const Boom = require('boom');
const { siteRepairValidation } = require('../../validations');

const listZonePolygonRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/polygon/zone',
  config: {
    tags: ['api', 'repair', 'site'],
    description: 'Get list site polygon zone',
    notes: 'Get list site polygon zone ',
    validate: {
      params: siteRepairValidation.zoneRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteRepairValidation.zoneResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { siteId } = req.params;
      const { site } = req.server;

      return site.Repair.listZonePolygon(siteId)
        .then(zones => reply(zones))
        .catch(err => reply(Boom.badRequest(err.message)));
    }
  }
};

module.exports = listZonePolygonRoute;
