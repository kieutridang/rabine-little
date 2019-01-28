const Boom = require('boom');
const { siteActivityValidation: activityValidation } = require('../../validations');

const getSiteActivityRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/activity/{activityId}',
  config: {
    tags: ['api', 'site'],
    description: 'Get siteActivity info',
    notes: 'Get siteActivity info',
    auth: 'token',
    validate: {
      params: activityValidation.getActivityRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: activityValidation.getActivityResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { activityId, siteId } = req.params;
      const { site } = req.server;

      return site.Activity
        .getById(activityId, siteId)
        .then((activity) => {
          if (activity) {
            return reply(activity).code(200);
          }

          return reply(Boom.notFound());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getSiteActivityRoute;
