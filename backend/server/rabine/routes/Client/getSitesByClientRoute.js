const Boom = require('boom');

const { siteValidation } = require('../../validations');

const listSitesByClientRoute = {
  method: 'GET',
  path: '/api/client/{clientId}/sites',
  config: {
    tags: ['api', 'order'],
    description: 'Get order',
    notes: 'Get order',
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
      const { clientId } = req.params;
      const { site } = req.server;

      return site.getSitesByClient(clientId)
        .then((sites) => {
          return reply(sites).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = listSitesByClientRoute;
