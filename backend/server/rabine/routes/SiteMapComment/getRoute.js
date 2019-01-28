const Boom = require('boom');
const { siteMapCommentValidation } = require('../../validations');

const listSiteRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/map/comment/{commentId}',
  config: {
    tags: ['api', 'site', 'map', 'comment'],
    description: 'Get site map comment',
    notes: 'Get site map comment',
    auth: 'token',
    validate: {
      params: siteMapCommentValidation.getSiteMapCommentRequestSchema
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
      const { siteId, commentId } = req.params;
      const { site } = req.server;

      return site.MapComment.get(siteId, commentId)
        .then(comment => reply(comment).code(200))
        .catch(err => reply(Boom.badRequest(err.message)));
    }
  }
};

module.exports = listSiteRoute;
