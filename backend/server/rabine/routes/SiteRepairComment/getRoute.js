const Boom = require('boom');
const { siteRepairCommentValidation } = require('../../validations');

const listSiteRoute = {
  method: 'GET',
  path: '/api/repair/{repairInstanceId}/comment/{commentId}',
  config: {
    tags: ['api', 'repair-comment', 'comment'],
    description: 'Get repair comment',
    notes: 'Get repair comment',
    auth: 'token',
    validate: {
      params: siteRepairCommentValidation.getSiteRepairCommentRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteRepairCommentValidation.getSiteRepairCommentsResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { repairInstanceId, commentId } = req.params;
      const { site } = req.server;

      return site.RepairComment.get(repairInstanceId, commentId)
        .then(comment => reply(comment).code(200))
        .catch(err => reply(Boom.badRequest(err.message)));
    }
  }
};

module.exports = listSiteRoute;
