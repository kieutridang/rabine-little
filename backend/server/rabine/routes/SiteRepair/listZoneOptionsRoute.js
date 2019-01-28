const Boom = require('boom');
const { siteRepairValidation } = require('../../validations');

const listZonePolygonRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/zones',
  config: {
    tags: ['api', 'zones'],
    description: 'Get list zones for selectbox',
    notes: 'Get list zones for selectbox',
    validate: {
      params: siteRepairValidation.zoneRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteRepairValidation.zoneOptionResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { siteId } = req.params;
      const { site } = req.server;

      return site.Repair.listZoneOptions(siteId)
        .then(zones => reply(zones))
        .catch(err => reply(Boom.badRequest(err.message)));
    }
  }
};

module.exports = listZonePolygonRoute;
