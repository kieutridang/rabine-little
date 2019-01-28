const Boom = require('boom');
const { siteMapCommentValidation } = require('../../validations');

const listSiteRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/map/comment',
  config: {
    tags: ['api', 'site', 'map', 'comment'],
    description: 'Get site map comment',
    notes: 'Get site map comment',
    validate: {
      params: siteMapCommentValidation.getSiteMapCommentsRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteMapCommentValidation.getSiteMapCommentsResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { siteId } = req.params;
      const { site } = req.server;

      return site.MapComment.list(siteId)
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
