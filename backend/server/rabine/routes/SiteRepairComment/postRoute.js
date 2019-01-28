const Boom = require('boom');
const { siteRepairCommentValidation } = require('../../validations');

const postRoute = {
  method: 'POST',
  path: '/api/repair/{repairInstanceId}/comment',
  config: {
    tags: ['api', 'repair-comment', 'comment'],
    auth: 'token',
    description: 'Add new repair comment',
    notes: 'Add new repair comment',
    validate: {
      params: siteRepairCommentValidation.getSiteRepairCommentsRequestSchema,
      payload: siteRepairCommentValidation.postSiteRepairCommentRequestSchema
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
      const userId = req.auth.credentials ? req.auth.credentials._id : null;

      const mapCommentInput = {
        ...commentPayload,
        repairInstanceId,
        userId
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
