const Boom = require('boom');
const { siteRepairCommentValidation } = require('../../validations');

const listSiteRoute = {
  method: 'GET',
  path: '/api/repair/{repairInstanceId}/comment',
  config: {
    tags: ['api', 'repair-comment', 'comment'],
    description: 'Get repair comment',
    notes: 'Get repair comment',
    validate: {
      params: siteRepairCommentValidation.getSiteRepairCommentsRequestSchema
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
      const { repairInstanceId } = req.params;
      const { site } = req.server;

      return site.RepairComment.list(repairInstanceId)
        .then((repairs) => {
          return reply(repairs).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = listSiteRoute;
