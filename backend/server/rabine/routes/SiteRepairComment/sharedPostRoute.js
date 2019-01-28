const Boom = require('boom');
const { siteRepairCommentValidation } = require('../../validations');

const postRoute = {
  method: 'POST',
  path: '/api/repair/{repairInstanceId}/shared/comment',
  config: {
    tags: ['api', 'repair-comment', 'comment'],
    description: 'Add new repair comment in shared comment',
    notes: 'Add new repair in shared comment',
    validate: {
      params: siteRepairCommentValidation.getSiteRepairCommentsRequestSchema,
      payload: siteRepairCommentValidation.postSharedSiteRepairCommentRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteRepairCommentValidation.postSiteRepairCommentResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const commentPayload = req.payload;
      const { repairInstanceId } = req.params;

      const mapCommentInput = {
        ...commentPayload,
        repairInstanceId
      };
      const { site } = req.server;

      return site.RepairComment.create(mapCommentInput)
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
