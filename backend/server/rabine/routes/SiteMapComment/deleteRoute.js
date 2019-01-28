const Boom = require('boom');
const { siteMapCommentValidation } = require('../../validations');

const deleteMapCommentRoute = {
  method: 'DELETE',
  path: '/api/site/{siteId}/map/comment/{commentId}',
  config: {
    tags: ['api', 'site', 'map', 'comment'],
    description: 'Delete site map comment',
    notes: 'Delete site map comment',
    auth: 'token',
    validate: {
      params: siteMapCommentValidation.deleteSiteMapCommentRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteMapCommentValidation.deleteSiteMapCommentResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { siteId, commentId } = req.params;
      const { site } = req.server;

      return site.MapComment.remove(siteId, commentId)
        .then(comment => reply(comment).code(200))
        .catch(err => reply(Boom.badRequest(err.message)));
    }
  }
};

module.exports = deleteMapCommentRoute;
