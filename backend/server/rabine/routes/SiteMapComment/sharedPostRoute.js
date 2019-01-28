const Boom = require('boom');
const { siteMapCommentValidation } = require('../../validations');

const postRoute = {
  method: 'POST',
  path: '/api/site/{siteId}/map/shared/comment',
  config: {
    tags: ['api', 'site', 'map', 'comment'],
    description: 'Add new site map comment in shared comment',
    notes: 'Add new site map in shared comment',
    validate: {
      params: siteMapCommentValidation.getSiteMapCommentsRequestSchema,
      payload: siteMapCommentValidation.postSharedSiteMapCommentRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteMapCommentValidation.postSiteMapCommentResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const commentPayload = req.payload;
      const { siteId } = req.params;

      const mapCommentInput = {
        ...commentPayload,
        siteId
      };
      const { site } = req.server;

      return site.MapComment.create(mapCommentInput)
        .then((mapComment) => {
          if (mapComment) {
            return reply(mapComment).code(200);
          }

          return reply(Boom.internal());
        }).catch(err => reply(Boom.badRequest(err.message)));
    }
  }
};

module.exports = postRoute;
