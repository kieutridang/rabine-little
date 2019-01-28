const Boom = require('boom');

const { siteAreaValidation } = require('../../validations');

const putSiteAreaRoute = {
  method: 'PUT',
  path: '/api/site/{siteId}/areas',
  config: {
    tags: ['api', 'site'],
    description: 'PUT site areas',
    notes: 'Put site areas',
    auth: 'token',
    validate: {
      params: siteAreaValidation.getSiteAreasRequestSchema,
      payload: siteAreaValidation.putSiteAreaRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteAreaValidation.putSiteAreaResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { site } = req.server;
      const { siteId } = req.params;
      const siteAreaRequest = req.payload;

      if (!siteAreaRequest ||
          !siteAreaRequest.siteId ||
          !siteId ||
          siteAreaRequest.siteId.toString() !== siteId.toString()) {
        return reply(Boom.badRequest());
      }

      return site.Area.create(siteAreaRequest)
        .then((area) => {
          if (area) {
            return reply(area).code(200);
          }

          return reply(Boom.notFound());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = putSiteAreaRoute;
