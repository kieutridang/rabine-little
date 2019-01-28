const Boom = require('boom');

const { siteMapValidation } = require('../../validations');

const putSiteMapData = {
  method: 'PUT',
  path: '/api/site/{siteId}/map',
  config: {
    tags: ['api', 'site'],
    description: 'PUT site map',
    notes: 'Put site map',
    auth: 'token',
    validate: {
      params: siteMapValidation.getSiteMapInfoRequestSchema,
      payload: siteMapValidation.putSiteMapInfoRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteMapValidation.putSiteMapInfoResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const {
        payload: { layers, features },
        server: { site },
        params: { siteId }
      } = req;

      if (!siteId) {
        return reply(Boom.badRequest());
      }

      return site.Map.updateById({ siteId, layers, features })
        .then((updatedSiteMap) => {
          if (updatedSiteMap) {
            return reply(updatedSiteMap).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = putSiteMapData;
