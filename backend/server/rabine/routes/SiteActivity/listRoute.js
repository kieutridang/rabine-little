const Boom = require('boom');

const { siteActivityValidation: activityValidation } = require('../../validations');

const getSiteActivitiesRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/activity',
  config: {
    tags: ['api', 'site'],
    description: 'Get siteActivity info',
    notes: 'Get siteActivity info',
    auth: 'token',
    validate: {
      params: activityValidation.getActivitiesRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: activityValidation.getActivitiesResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { siteId } = req.params;
      const { site } = req.server;

      return site.Activity
      .list(siteId)
      .then((activities) => {
        if (activities) {
          return reply(activities).code(200);
        }

        return reply(Boom.notFound());

      })
      .catch((err) => {
        return reply(Boom.badRequest(err.message));
      });
    }
  }
};

module.exports = getSiteActivitiesRoute;
