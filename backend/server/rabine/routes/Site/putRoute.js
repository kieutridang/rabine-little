const Boom = require('boom');
const { siteValidation } = require('../../validations');

const putSiteRoute = {
  method: 'PUT',
  path: '/api/site/{siteId}',
  config: {
    tags: ['api', 'site'],
    description: 'Update site by siteId',
    notes: 'Update site',
    validate: {
      params: siteValidation.getSiteInfoRequestSchema,
      payload: siteValidation.postSiteRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteValidation.postSiteResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const siteRequest = req.payload;
      const { siteId } = req.params;
      const { site } = req.server;

      return site.findAndUpdate(siteId, siteRequest)
        .then((savedSite) => {
          if (savedSite) {
            return reply(savedSite).code(200);
          }
          return reply(Boom.notFound());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = putSiteRoute;
