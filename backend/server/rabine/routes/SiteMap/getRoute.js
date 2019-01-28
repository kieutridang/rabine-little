const Boom = require('boom');

const { siteMapValidation } = require('../../validations');

const getSiteMapInfoRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/map',
  config: {
    tags: ['api', 'site'],
    description: 'Get site map data',
    notes: 'Get site map data',
    auth: 'token',
    validate: {
      params: siteMapValidation.getSiteMapInfoRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteMapValidation.getSiteMapInfoResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { siteId } = req.params;
      const { site } = req.server;

      return site.getSiteMapInfo(siteId)
      .then((siteMap) => {
        if (siteMap) {
          return reply(siteMap).code(200);
        }

        return reply(Boom.notFound());

      })
      .catch((err) => {
        return reply(Boom.badRequest(err.message));
      });
    }
  }
};

module.exports = getSiteMapInfoRoute;
