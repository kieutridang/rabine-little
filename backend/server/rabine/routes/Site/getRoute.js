const Boom = require('boom');

const { siteValidation } = require('../../validations');

const getSiteInfoRoute = {
  method: 'GET',
  path: '/api/site/{siteId}',
  config: {
    tags: ['api', 'site'],
    description: 'Get site info',
    notes: 'Get site info',
    auth: 'token',
    validate: {
      params: siteValidation.getSiteInfoRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteValidation.getSiteInfoResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { siteId } = req.params;
      const { site } = req.server;

      return site
        .getSiteInfo(siteId)
        .then((siteItem) => {
          if (siteItem) {
            return reply(siteItem).code(200);
          }

          return reply(Boom.notFound());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getSiteInfoRoute;
