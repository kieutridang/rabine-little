const Boom = require('boom');
const { siteMapCommentValidation } = require('../../validations');

const postRoute = {
  method: 'POST',
  path: '/api/site/{siteId}/map/comment',
  config: {
    tags: ['api', 'site', 'map', 'comment'],
    auth: 'token',
    description: 'Add new site map comment',
    notes: 'Add new site map comment',
    validate: {
      params: siteMapCommentValidation.getSiteMapCommentsRequestSchema,
      payload: siteMapCommentValidation.postSiteMapCommentRequestSchema
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
      const userId = req.auth.credentials ? req.auth.credentials._id : null;

      const mapCommentInput = {
        ...commentPayload,
        siteId,
        userId
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
