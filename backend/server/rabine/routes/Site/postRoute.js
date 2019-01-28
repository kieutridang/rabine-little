const Boom = require('boom');

const { siteValidation } = require('../../validations');

const postSiteRoute = {
  method: 'POST',
  path: '/api/site',
  config: {
    tags: ['api', 'site'],
    description: 'Add new site',
    notes: 'post new site',
    auth: 'token',
    validate: {
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
      const { site } = req.server;

      const user = req.auth.credentials ? req.auth.credentials : null;

      return site.create(siteRequest, user)
        .then((savedSite) => {
          if (savedSite) {
            return reply(savedSite).code(200);
          }

          return reply(Boom.internal());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = postSiteRoute;
