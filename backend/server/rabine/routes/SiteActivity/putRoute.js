const Boom = require('boom');

const { siteActivityValidation, siteValidation } = require('../../validations');

const putSiteActivityRoute = {
  method: 'PUT',
  path: '/api/site/{siteId}/activity',
  config: {
    tags: ['api', 'site'],
    description: 'PUT site activity',
    notes: 'Put site activity',
    auth: 'token',
    validate: {
      params: siteValidation.getSiteInfoRequestSchema,
      payload: siteActivityValidation.putActivityRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteActivityValidation.putActivityResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { payload, params, auth } = req;
      const { site } = req.server;

      const siteActivityRequest = {
        ...payload,
        siteId: params.siteId,
        username: auth.credentials.username
      };

      return site.Activity
        .create(siteActivityRequest)
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

module.exports = putSiteActivityRoute;
