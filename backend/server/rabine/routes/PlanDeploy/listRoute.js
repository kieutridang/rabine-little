const Boom = require('boom');

const { planDeployValidation } = require('../../validations');

const getPlanDeploysRoute = {
  method: 'GET',
  path: '/api/plan',
  config: {
    tags: ['api', 'plan deploy'],
    description: 'Get plan deploy list',
    auth: 'token',
    notes: 'Get plan deploy list',
    validate: {
      query: planDeployValidation.getPlanDeploysRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: planDeployValidation.getPlanDeploysResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { name, all = false } = req.query;
      const { planDeploy } = req.server;

      return planDeploy.list(name, all)
        .then((site) => {
          if (site) {
            return reply(site).code(200);
          }

          return reply(Boom.notFound());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getPlanDeploysRoute;
