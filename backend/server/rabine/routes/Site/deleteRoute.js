const Boom = require('boom');

const { siteValidation } = require('../../validations');

const deleteSiteRoute = {
  method: 'DELETE',
  path: '/api/site/{siteId}',
  config: {
    tags: ['api', 'site'],
    description: 'Delete site info',
    notes: 'Delete site info',
    auth: 'token',
    validate: {
      params: siteValidation.deleteSiteInfoRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteValidation.deleteSiteInfoResponseSchema
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
        .deleteSite(siteId)
        .then((siteItem) => {
          if (siteItem) {
            const { id } = siteItem;
            return reply({ id }).code(200);
          }

          return reply(Boom.notFound());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = deleteSiteRoute;
