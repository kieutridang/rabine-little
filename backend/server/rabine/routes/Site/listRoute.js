const Boom = require('boom');

const { siteValidation } = require('../../validations');

const listSiteRoute = {
  method: 'GET',
  path: '/api/site',
  config: {
    tags: ['api', 'site'],
    description: 'Get site',
    notes: 'Get site',
    auth: 'token',
    validate: {
      query: siteValidation.getSitesRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteValidation.getSitesResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const filter = req.query;
      const { site } = req.server;

      return site.list(filter)
        .then((sites) => {
          return reply(sites).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = listSiteRoute;
