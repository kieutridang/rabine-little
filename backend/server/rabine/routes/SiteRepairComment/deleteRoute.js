const Boom = require('boom');
const { siteRepairCommentValidation } = require('../../validations');

const deleteRepairCommentRoute = {
  method: 'DELETE',
  path: '/api/repair/{repairInstanceId}/comment/{commentId}',
  config: {
    tags: ['api', 'repair-comment', 'comment'],
    description: 'Delete repair comment',
    notes: 'Delete repair comment',
    auth: 'token',
    validate: {
      params: siteRepairCommentValidation.deleteSiteRepairCommentRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteRepairCommentValidation.deleteSiteRepairCommentResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { repairInstanceId, commentId } = req.params;
      const { site } = req.server;

      return site.RepairComment.remove(repairInstanceId, commentId)
        .then(comment => reply(comment).code(200))
        .catch(err => reply(Boom.badRequest(err.message)));
    }
  }
};

module.exports = deleteRepairCommentRoute;
